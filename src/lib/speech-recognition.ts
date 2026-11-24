"use client";

/**
 * Nhận dạng giọng nói cho mọi màn hình có micro.
 *
 * Đã đăng nhập → ghi âm rồi nhận dạng trên máy chủ EngQuiz (./server-recognition, Whisper chạy tại chỗ): nghe giọng
 * Việt tốt hơn, chạy được cả trên Firefox, không gửi âm thanh cho Google/Microsoft.
 * Chưa đăng nhập hoặc dịch vụ tắt → Web Speech API của trình duyệt (Chrome, Edge, Safari; cần mạng).
 * Micro chỉ dùng được trên HTTPS hoặc localhost (secure context).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { canRecordAudio } from "./recorder";
import { isServerDown, listenOnServer } from "./server-recognition";
import { heardAll } from "./speech-match";

/* Kiểu tối thiểu — lib DOM của TypeScript chưa có SpeechRecognition. */
interface RecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface RecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: RecognitionAlternative;
}
interface RecognitionEvent {
  readonly resultIndex: number;
  readonly results: { readonly length: number; [index: number]: RecognitionResult };
}
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  /** Micro đã thật sự bắt đầu thu (Chrome, Edge, Safari). */
  onaudiostart?: (() => void) | null;
  onstart?: (() => void) | null;
  /** Chrome 139+: nhận dạng ngay trên máy (không gửi âm thanh lên máy chủ) khi đã có gói ngôn ngữ. */
  processLocally?: boolean;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = (new () => Recognition) & {
  /** Chrome 139+: kiểm tra có nhận dạng trên máy được không ("available" = đã có gói ngôn ngữ). */
  available?: (opts: { langs: string[]; processLocally: boolean }) => Promise<string>;
};

/**
 * Sau lần nói cuối cùng, chờ ngần này mili giây im lặng thì tự dừng (trình duyệt tự chờ 1,5–2 giây).
 * Đọc một từ: ngắn; đọc câu / nói tự do: dài hơn để người học ngập ngừng giữa câu không bị cắt.
 */
export const END_SILENCE_MS = { word: 600, sentence: 1100 } as const;

/** Câu đích ngắn (một từ / cụm ≤ 2 từ, hoặc ≤ 3 chữ Hán) → dùng khoảng im lặng ngắn. */
export function silenceFor(expected: readonly string[] | undefined): number {
  const short = !!expected?.length && expected.every((e) => (/\p{Script=Han}/u.test(e) ? [...e.replace(/\s/g, "")].length <= 3 : e.trim().split(/\s+/).length <= 2));
  return short ? END_SILENCE_MS.word : END_SILENCE_MS.sentence;
}

/**
 * Nhận dạng trên máy dùng được cho ngôn ngữ nào. Kiểm một lần khi mở trang (bất đồng bộ) và lưu kết quả
 * để lúc bấm micro đọc ngay (processLocally phải đặt TRƯỚC khi start).
 */
const localChecked = new Set<string>();
const localOk = new Set<string>();
function checkLocalSupport(Ctor: RecognitionCtor, lang: string): void {
  if (localChecked.has(lang) || typeof Ctor.available !== "function") return;
  localChecked.add(lang);
  Ctor.available({ langs: [lang], processLocally: true })
    .then((r) => {
      if (r === "available") localOk.add(lang);
    })
    .catch(() => {});
}

function getCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export type RecognitionStatus = "unsupported" | "insecure" | "ready";

export interface ListenResult {
  /** Toàn bộ lời nói (các đoạn đã chốt nối lại). */
  transcript: string;
  /** Các bản đoán khác nhau cho lời nói (chế độ một câu); bản 0 = transcript. */
  alternatives: string[];
  durationMs: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Trình duyệt chưa được phép dùng micro. Bấm biểu tượng ổ khóa cạnh thanh địa chỉ → cho phép Micro, rồi thử lại.",
  "service-not-allowed": "Trình duyệt không cho dùng dịch vụ nhận dạng giọng nói. Hãy dùng Chrome hoặc Edge.",
  "audio-capture": "Không tìm thấy micro. Kiểm tra micro đã cắm và đang bật.",
  network: "Nhận dạng giọng nói cần Internet (Chrome/Edge gửi âm thanh lên máy chủ để nhận dạng). Kiểm tra mạng rồi thử lại.",
  "no-speech": "Không nghe thấy tiếng nói. Hãy nói to, rõ và gần micro hơn.",
  "language-not-supported": "Trình duyệt không hỗ trợ nhận dạng giọng nói cho ngôn ngữ này.",
};

export function recognitionErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? `Lỗi nhận dạng giọng nói (${code}). Hãy thử lại.`;
}

const ALTERNATIVES = 5;

/** Dòng trạng thái khi đang nghe: "Chuẩn bị…" (micro chưa mở) → "Đang nghe…" → "Đang nhận dạng…" (chờ máy chủ). */
export function listenLabel({ ready, recognizing }: { ready: boolean; recognizing: boolean }): string {
  return recognizing ? "Đang nhận dạng…" : ready ? "Đang nghe…" : "Chuẩn bị…";
}

export function useSpeechRecognition({ lang = "en-US" }: { lang?: string } = {}) {
  const { status: authStatus } = useSession();
  const [canRecord, setCanRecord] = useState(false);
  const [browserStatus, setBrowserStatus] = useState<RecognitionStatus>("ready");
  const onServer = authStatus === "authenticated" && canRecord && !isServerDown();
  const status: RecognitionStatus = onServer ? "ready" : browserStatus;
  /** Đã ghi xong, đang chờ máy chủ nhận dạng. */
  const [recognizing, setRecognizing] = useState(false);
  const serverStopRef = useRef<() => void>(() => {});
  const turnRef = useRef(0);
  const [listening, setListening] = useState(false);
  /** Micro đã mở thật sự (sau sự kiện audiostart). Trước đó là đang chuẩn bị — người học chưa nên nói. */
  const [ready, setReady] = useState(false);
  /** Lời nói đang nhận dạng (chưa chốt + đã chốt), để hiện trực tiếp. */
  const [live, setLive] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const cancelRef = useRef<() => void>(() => {});

  useEffect(() => {
    setCanRecord(canRecordAudio());
    const Ctor = getCtor();
    if (!Ctor) setBrowserStatus("unsupported");
    else if (!window.isSecureContext) setBrowserStatus("insecure");
    else checkLocalSupport(Ctor, lang);
    return () => {
      cancelRef.current();
      serverStopRef.current();
      recRef.current?.abort();
    };
  }, []);

  /**
   * Bắt đầu nghe; promise trả kết quả khi dừng (bấm stop, hoặc tự dừng khi im lặng ở chế độ một câu).
   * Trả null nếu lỗi (thông báo nằm trong `error`) hoặc không nghe được gì.
   */
  const listen = useCallback(
    /**
     * expected: câu / từ người học cần đọc (chế độ một câu). Nghe đủ → dừng ngay, không chờ im lặng.
     */
    ({ continuous, expected }: { continuous: boolean; expected?: readonly string[] }): Promise<ListenResult | null> => {
      if (onServer && !isServerDown()) return listenServer({ continuous, expected });
      const Ctor = getCtor();
      if (!Ctor || !window.isSecureContext) {
        setError(Ctor ? "Micro chỉ dùng được trên trang https:// hoặc localhost." : "Trình duyệt này không hỗ trợ nhận dạng giọng nói.");
        return Promise.resolve(null);
      }
      cancelRef.current();
      recRef.current?.abort();
      if (window.speechSynthesis?.speaking || window.speechSynthesis?.pending) window.speechSynthesis.cancel();

      const rec = new Ctor();
      rec.lang = lang;
      // Có gói ngôn ngữ trên máy → nhận dạng tại chỗ (không qua mạng, nhanh hơn rõ rệt).
      if (localOk.has(lang) && "processLocally" in rec) rec.processLocally = true;
      rec.continuous = continuous;
      rec.interimResults = true;
      rec.maxAlternatives = ALTERNATIVES;
      recRef.current = rec;

      const finals: string[] = [];
      let alternatives: string[] = [];
      /** Phần đang nhận dạng dở (chưa chốt) gần nhất — dùng khi tự dừng sớm mà trình duyệt chưa kịp chốt. */
      let interimText = "";
      let silenceTimer = 0;
      const zhLang = lang.toLowerCase().startsWith("zh");
      const silenceMs = silenceFor(expected);
      /** Chế độ một câu: tự dừng khi đã nghe đủ câu cần đọc, hoặc khi im lặng một lúc sau lần nói cuối. */
      const scheduleEnd = (text: string) => {
        if (continuous) return;
        window.clearTimeout(silenceTimer);
        if (expected?.length && heardAll(text, expected, zhLang ? "zh" : "en")) {
          rec.stop();
          return;
        }
        silenceTimer = window.setTimeout(() => {
          if (recRef.current === rec) rec.stop();
        }, silenceMs);
      };
      let failed = false;
      // Bị hủy (đổi câu/đề, rời trang, bắt đầu lượt mới) → không trả kết quả, để không chấm nhầm ngữ cảnh.
      let cancelled = false;
      cancelRef.current = () => {
        cancelled = true;
      };
      const startedAt = performance.now();
      setError(null);
      setLive("");
      setReady(false);
      setListening(true);

      return new Promise((resolve) => {
        const markReady = () => {
          if (recRef.current === rec) setReady(true);
        };
        rec.onaudiostart = markReady;
        // Trình duyệt không có audiostart: coi như sẵn sàng khi bắt đầu.
        if (!("onaudiostart" in rec)) rec.onstart = markReady;
        rec.onresult = (e) => {
          let interim = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const result = e.results[i];
            if (result.isFinal) {
              finals.push(result[0].transcript.trim());
              alternatives = Array.from({ length: result.length }, (_, k) => result[k].transcript.trim());
            } else {
              interim += result[0].transcript;
            }
          }
          interimText = interim.trim();
          const heardSoFar = [...finals, interimText].filter(Boolean).join(" ");
          setLive(heardSoFar);
          scheduleEnd(heardSoFar);
        };
        rec.onerror = (e) => {
          if (e.error === "aborted") {
            cancelled = true;
            return;
          }
          failed = true;
          // Nhận dạng trên máy hỏng (gói ngôn ngữ bị gỡ…) → lần sau dùng nhận dạng qua mạng.
          if (rec.processLocally) localOk.delete(lang);
          setError(recognitionErrorMessage(e.error));
        };
        rec.onend = () => {
          window.clearTimeout(silenceTimer);
          // Chỉ lượt hiện tại mới được đổi trạng thái; lượt cũ vừa bị hủy kết thúc muộn thì bỏ qua.
          if (recRef.current === rec) {
            recRef.current = null;
            setListening(false);
            setReady(false);
          }
          // Dừng sớm trước khi trình duyệt chốt câu → dùng phần đang nhận dạng dở.
          if (!finals.length && interimText) {
            finals.push(interimText);
            alternatives = [interimText];
          }
          const transcript = finals.join(" ").trim();
          // Lỗi giữa chừng (vd mất mạng sau 2 phút nói) vẫn giữ phần đã nhận dạng; thông báo lỗi vẫn hiện.
          if (cancelled || !transcript) return resolve(null);
          if (failed && continuous === false) return resolve(null);
          const alts = continuous ? [transcript] : [transcript, ...alternatives.filter((a) => a && a !== transcript)];
          resolve({ transcript, alternatives: alts, durationMs: performance.now() - startedAt });
        };
        try {
          rec.start();
        } catch (err) {
          setListening(false);
          setReady(false);
          setError(recognitionErrorMessage(err instanceof Error ? err.name : "start-failed"));
          resolve(null);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listenServer chỉ dùng ref, setState và lang
    [lang, onServer],
  );

  /** Một lượt nghe qua máy chủ; cùng hợp đồng với nhánh trình duyệt (null = lỗi / hủy / không nghe thấy). */
  async function listenServer({ continuous, expected }: { continuous: boolean; expected?: readonly string[] }): Promise<ListenResult | null> {
    cancelRef.current();
    recRef.current?.abort();
    serverStopRef.current();
    if (window.speechSynthesis?.speaking || window.speechSynthesis?.pending) window.speechSynthesis.cancel();
    const turn = ++turnRef.current;
    const current = () => turnRef.current === turn;
    let cancelled = false;
    cancelRef.current = () => {
      cancelled = true;
      serverStopRef.current();
    };
    setError(null);
    setLive("");
    setReady(false);
    setRecognizing(false);
    setListening(true);
    const kind = continuous ? "long" : silenceFor(expected) === END_SILENCE_MS.word ? "word" : "sentence";
    const outcome = await listenOnServer(
      { lang, kind, expected: expected?.[0] },
      {
        onRecording: (stopNow) => {
          serverStopRef.current = stopNow;
          if (current()) setReady(true);
        },
        onRecognizing: () => {
          serverStopRef.current = () => {};
          if (current()) setRecognizing(true);
        },
        isCancelled: () => cancelled,
      },
    );
    if (current()) {
      serverStopRef.current = () => {};
      setListening(false);
      setReady(false);
      setRecognizing(false);
    }
    if (outcome.kind === "cancelled" || cancelled) return null;
    if (outcome.kind === "failed") {
      if (current()) setError(outcome.message);
      return null;
    }
    setLive(outcome.transcript);
    return { transcript: outcome.transcript, alternatives: continuous ? [outcome.transcript] : outcome.alternatives, durationMs: outcome.durationMs };
  }

  const stop = useCallback(() => {
    recRef.current?.stop();
    serverStopRef.current();
  }, []);
  /** Hủy lượt đang nghe: promise của lượt đó trả null. */
  const cancel = useCallback(() => {
    cancelRef.current();
    const rec = recRef.current;
    recRef.current = null;
    rec?.abort();
    turnRef.current += 1;
    setListening(false);
    setReady(false);
    setRecognizing(false);
  }, []);

  return { status, listening, ready, recognizing, live, error, listen, stop, cancel };
}
