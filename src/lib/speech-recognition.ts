"use client";

/**
 * Nhận dạng giọng nói cho mọi màn hình có micro.
 *
 * Đã đăng nhập → ghi âm rồi nhận dạng trên máy chủ EngQuiz (./server-recognition, Whisper chạy tại chỗ): nghe giọng
 * Việt tốt hơn, chạy được cả trên Firefox. Whisper chỉ trả chữ sau khi nói xong (~1,5 giây), nên trên máy tính có
 * thêm nhận dạng của trình duyệt chạy song song để hiện chữ ngay khi nói và dừng sớm khi đã đọc đủ câu mẫu
 * (`startPreview`); chữ cuối cùng vẫn là của Whisper, bản đoán của trình duyệt chỉ ghép thêm vào alternatives.
 * Chưa đăng nhập hoặc dịch vụ tắt → Web Speech API của trình duyệt (./browser-speech; Chrome, Edge, Safari; cần mạng).
 * Micro chỉ dùng được trên HTTPS hoặc localhost (secure context).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  checkLocalSupport,
  createBrowserTurn,
  END_SILENCE_MS,
  getRecognitionCtor,
  NO_PREVIEW,
  silenceFor,
  startPreview,
  stopSpeaking,
  type ListenResult,
  type Recognition,
} from "./browser-speech";
import { canRecordAudio } from "./recorder";
import { isServerDown, listenOnServer, type ServerListenOutcome } from "./server-recognition";
import { heardAll } from "./speech-match";

export { END_SILENCE_MS, recognitionErrorMessage, silenceFor, type ListenResult } from "./browser-speech";

export type RecognitionStatus = "unsupported" | "insecure" | "ready";

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

/** Loại bản ghi cho máy chủ: nói tự do → dài; câu đích ngắn → một từ; còn lại → một câu. */
const recordKindFor = (continuous: boolean, expected?: readonly string[]) =>
  continuous ? "long" : silenceFor(expected) === END_SILENCE_MS.word ? "word" : "sentence";

type ListenOptions = { continuous: boolean; expected?: readonly string[] };

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
    const Ctor = getRecognitionCtor();
    if (!Ctor) setBrowserStatus("unsupported");
    else if (!window.isSecureContext) setBrowserStatus("insecure");
    else checkLocalSupport(Ctor, lang);
    return () => {
      cancelRef.current();
      serverStopRef.current();
      recRef.current?.abort();
    };
  }, []);

  /** Về trạng thái nghỉ (nút micro như cũ). */
  function goIdle() {
    setListening(false);
    setReady(false);
  }

  /** Dọn lượt trước và đặt trạng thái "đang nghe" cho lượt mới. */
  function beginTurn() {
    setError(null);
    setLive("");
    setReady(false);
    setListening(true);
  }

  /**
   * Bắt đầu nghe; promise trả kết quả khi dừng (bấm stop, hoặc tự dừng khi im lặng ở chế độ một câu).
   * Trả null nếu lỗi (thông báo nằm trong `error`) hoặc không nghe được gì.
   * expected: câu / từ người học cần đọc (chế độ một câu). Nghe đủ → dừng ngay, không chờ im lặng.
   */
  const listen = useCallback(
    ({ continuous, expected }: ListenOptions): Promise<ListenResult | null> => {
      if (onServer && !isServerDown()) return listenServer({ continuous, expected });
      return listenBrowser({ continuous, expected });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listenServer / listenBrowser chỉ dùng ref, setState và lang
    [lang, onServer],
  );

  /** Một lượt nghe bằng Web Speech API của trình duyệt. */
  function listenBrowser({ continuous, expected }: ListenOptions): Promise<ListenResult | null> {
    const Ctor = getRecognitionCtor();
    if (!Ctor || !window.isSecureContext) {
      setError(Ctor ? "Micro chỉ dùng được trên trang https:// hoặc localhost." : "Trình duyệt này không hỗ trợ nhận dạng giọng nói.");
      return Promise.resolve(null);
    }
    cancelRef.current();
    recRef.current?.abort();
    stopSpeaking();

    const turn = createBrowserTurn(
      Ctor,
      { lang, continuous, expected, isCurrent: (rec) => recRef.current === rec },
      {
        onReady: () => setReady(true),
        onLive: setLive,
        onError: setError,
        // Chỉ lượt hiện tại mới được đổi trạng thái.
        onEnded: () => {
          recRef.current = null;
          goIdle();
        },
        onStartFailed: goIdle,
      },
    );
    recRef.current = turn.rec;
    cancelRef.current = turn.cancel;
    beginTurn();
    return turn.start();
  }

  /** Một lượt nghe qua máy chủ; cùng hợp đồng với nhánh trình duyệt (null = lỗi / hủy / không nghe thấy). */
  async function listenServer({ continuous, expected }: ListenOptions): Promise<ListenResult | null> {
    cancelRef.current();
    recRef.current?.abort();
    serverStopRef.current();
    stopSpeaking();
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
    beginTurn();
    setRecognizing(false);
    const zh = lang.toLowerCase().startsWith("zh");
    let outcome: ServerListenOutcome;
    try {
      outcome = await listenOnServer(
        { lang, kind: recordKindFor(continuous, expected), expected: expected?.[0] },
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
      goIdle();
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
