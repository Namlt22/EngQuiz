"use client";

/**
 * Nhận dạng giọng nói cho mọi màn hình có micro.
 *
 * Đã đăng nhập → ghi âm rồi nhận dạng trên máy chủ EngQuiz (./server-recognition, Whisper chạy tại chỗ): nghe giọng
 * Việt tốt hơn, chạy được cả trên Firefox. Whisper chỉ trả chữ sau khi nói xong (~1,5 giây), nên trên máy tính có
 * thêm nhận dạng của trình duyệt chạy song song để hiện chữ ngay khi nói và dừng sớm khi đã đọc đủ câu mẫu
 * (`startPreview`); chữ cuối cùng vẫn là của Whisper, bản đoán của trình duyệt chỉ ghép thêm vào alternatives.
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

/**
 * Điện thoại: micro thường chỉ cho một bên thu, chạy thêm nhận dạng của trình duyệt có thể làm bản ghi im lặng
 * → không xem trước, chỉ hiện chữ khi máy chủ trả về.
 */
function canPreview(): boolean {
  return !/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

interface Preview {
  /** Ngừng nghe thêm (người học đã nói xong); các đoạn đang dở vẫn được trình duyệt chốt nốt. */
  pause: () => void;
  /** Tắt hẳn, trả các bản đoán đã chốt (rỗng nếu không có). */
  collect: () => string[];
}

const NO_PREVIEW: Preview = { pause: () => {}, collect: () => [] };

/** Nhận dạng của trình duyệt chỉ để xem trước lời nói; mọi lỗi của nó bị bỏ qua (máy chủ mới là kết quả chính). */
function startPreview(lang: string, onHeard: (text: string) => void): Preview {
  const Ctor = getCtor();
  if (!Ctor || !canPreview()) return NO_PREVIEW;
  const rec = new Ctor();
  rec.lang = lang;
  if (localOk.has(lang) && "processLocally" in rec) rec.processLocally = true;
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = ALTERNATIVES;
  const finals: string[] = [];
  let lastAlternatives: string[] = [];
  let interim = "";
  rec.onresult = (e) => {
    interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i];
      if (result.isFinal) {
        finals.push(result[0].transcript.trim());
        lastAlternatives = Array.from({ length: result.length }, (_, k) => result[k].transcript.trim());
      } else interim += result[0].transcript;
    }
    onHeard([...finals, interim.trim()].filter(Boolean).join(" "));
  };
  rec.onerror = () => {};
  try {
    rec.start();
  } catch {
    return NO_PREVIEW;
  }
  const quietly = (fn: () => void) => {
    try {
      fn();
    } catch {
      /* đã dừng */
    }
  };
  return {
    pause: () => quietly(() => rec.stop()),
    collect: () => {
      rec.onresult = null;
      quietly(() => rec.abort());
      if (finals.length === 1 && !interim.trim()) return lastAlternatives.filter(Boolean);
      const joined = [...finals, interim.trim()].filter(Boolean).join(" ");
      return joined ? [joined] : [];
    },
  };
}

/** Ghép bản đoán, bỏ trùng (không phân biệt hoa thường / dấu câu), giữ thứ tự. */
export function mergeAlternatives(...lists: readonly (readonly string[])[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const text of lists.flat()) {
    const key = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

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
  /** Lượt máy chủ đang ở đâu: bấm dừng lúc micro chưa mở thì hủy lượt, lúc đang ghi thì dừng ghi. */
  const serverPhaseRef = useRef<"idle" | "preparing" | "recording" | "recognizing">("idle");
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
    let preview = NO_PREVIEW;
    cancelRef.current = () => {
      cancelled = true;
      serverStopRef.current();
      preview.collect();
    };
    serverStopRef.current = () => {};
    serverPhaseRef.current = "preparing";
    setError(null);
    setLive("");
    setReady(false);
    setRecognizing(false);
    setListening(true);
    const kind = continuous ? "long" : silenceFor(expected) === END_SILENCE_MS.word ? "word" : "sentence";
    const zh = lang.toLowerCase().startsWith("zh");
    let outcome: Awaited<ReturnType<typeof listenOnServer>>;
    try {
      outcome = await listenOnServer(
        { lang, kind, expected: expected?.[0] },
        {
          onRecording: (stopNow) => {
            serverStopRef.current = stopNow;
            // Bấm dừng / hủy khi micro còn đang mở → dừng ngay lúc micro vừa mở.
            if (cancelled || !current()) return stopNow();
            serverPhaseRef.current = "recording";
            setReady(true);
            preview = startPreview(lang, (text) => {
              if (!current() || serverPhaseRef.current !== "recording") return;
              setLive(text);
              // Đã nghe đủ câu cần đọc → dừng ngay, không chờ im lặng.
              if (!continuous && expected?.length && heardAll(text, expected, zh ? "zh" : "en")) stopNow();
            });
          },
          onRecognizing: () => {
            serverStopRef.current = () => {};
            preview.pause();
            if (!current()) return;
            serverPhaseRef.current = "recognizing";
            setRecognizing(true);
          },
          isCancelled: () => cancelled,
        },
      );
    } catch {
      outcome = { kind: "failed", message: "Không ghi âm được. Hãy thử lại." };
    }
    const browserGuesses = preview.collect();
    if (current()) {
      serverStopRef.current = () => {};
      serverPhaseRef.current = "idle";
      setListening(false);
      setReady(false);
      setRecognizing(false);
    }
    if (outcome.kind === "cancelled" || cancelled || !current()) return null;
    if (outcome.kind === "failed") {
      setError(outcome.message);
      return null;
    }
    setLive(outcome.transcript);
    const alternatives = continuous ? [outcome.transcript] : mergeAlternatives(outcome.alternatives, browserGuesses);
    return { transcript: outcome.transcript, alternatives, durationMs: outcome.durationMs };
  }

  const stop = useCallback(() => {
    recRef.current?.stop();
    // Micro chưa mở (đang "Chuẩn bị…", có khi đang chờ hỏi quyền micro) → hủy lượt này ngay, nút trở lại như cũ.
    if (serverPhaseRef.current === "preparing") {
      cancelRef.current();
      turnRef.current += 1;
      serverPhaseRef.current = "idle";
      setListening(false);
      setReady(false);
      return;
    }
    serverStopRef.current();
  }, []);
  /** Hủy lượt đang nghe: promise của lượt đó trả null. */
  const cancel = useCallback(() => {
    cancelRef.current();
    const rec = recRef.current;
    recRef.current = null;
    rec?.abort();
    turnRef.current += 1;
    serverPhaseRef.current = "idle";
    setListening(false);
    setReady(false);
    setRecognizing(false);
  }, []);

  return { status, listening, ready, recognizing, live, error, listen, stop, cancel };
}
