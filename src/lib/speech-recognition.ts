"use client";

/**
 * Nhận dạng giọng nói bằng Web Speech API (Chrome, Edge, Safari bản mới; Firefox chưa hỗ trợ).
 * Lưu ý: Chrome/Edge gửi âm thanh lên máy chủ của Google/Microsoft để nhận dạng → cần mạng.
 * Micro chỉ dùng được trên HTTPS hoặc localhost (secure context).
 */
import { useCallback, useEffect, useRef, useState } from "react";

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
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => Recognition;

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
  "language-not-supported": "Trình duyệt không hỗ trợ nhận dạng tiếng Anh.",
};

export function recognitionErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? `Lỗi nhận dạng giọng nói (${code}). Hãy thử lại.`;
}

const ALTERNATIVES = 5;

export function useSpeechRecognition({ lang = "en-US" }: { lang?: string } = {}) {
  const [status, setStatus] = useState<RecognitionStatus>("ready");
  const [listening, setListening] = useState(false);
  /** Lời nói đang nhận dạng (chưa chốt + đã chốt), để hiện trực tiếp. */
  const [live, setLive] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const cancelRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!getCtor()) setStatus("unsupported");
    else if (!window.isSecureContext) setStatus("insecure");
    return () => {
      cancelRef.current();
      recRef.current?.abort();
    };
  }, []);

  /**
   * Bắt đầu nghe; promise trả kết quả khi dừng (bấm stop, hoặc tự dừng khi im lặng ở chế độ một câu).
   * Trả null nếu lỗi (thông báo nằm trong `error`) hoặc không nghe được gì.
   */
  const listen = useCallback(
    ({ continuous }: { continuous: boolean }): Promise<ListenResult | null> => {
      const Ctor = getCtor();
      if (!Ctor || !window.isSecureContext) {
        setError(Ctor ? "Micro chỉ dùng được trên trang https:// hoặc localhost." : "Trình duyệt này không hỗ trợ nhận dạng giọng nói.");
        return Promise.resolve(null);
      }
      cancelRef.current();
      recRef.current?.abort();

      const rec = new Ctor();
      rec.lang = lang;
      rec.continuous = continuous;
      rec.interimResults = true;
      rec.maxAlternatives = ALTERNATIVES;
      recRef.current = rec;

      const finals: string[] = [];
      let alternatives: string[] = [];
      let failed = false;
      // Bị hủy (đổi câu/đề, rời trang, bắt đầu lượt mới) → không trả kết quả, để không chấm nhầm ngữ cảnh.
      let cancelled = false;
      cancelRef.current = () => {
        cancelled = true;
      };
      const startedAt = performance.now();
      setError(null);
      setLive("");
      setListening(true);

      return new Promise((resolve) => {
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
          setLive([...finals, interim.trim()].filter(Boolean).join(" "));
        };
        rec.onerror = (e) => {
          if (e.error === "aborted") {
            cancelled = true;
            return;
          }
          failed = true;
          setError(recognitionErrorMessage(e.error));
        };
        rec.onend = () => {
          // Chỉ lượt hiện tại mới được đổi trạng thái; lượt cũ vừa bị hủy kết thúc muộn thì bỏ qua.
          if (recRef.current === rec) {
            recRef.current = null;
            setListening(false);
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
          setError(recognitionErrorMessage(err instanceof Error ? err.name : "start-failed"));
          resolve(null);
        }
      });
    },
    [lang],
  );

  const stop = useCallback(() => recRef.current?.stop(), []);
  /** Hủy lượt đang nghe: promise của lượt đó trả null. */
  const cancel = useCallback(() => {
    cancelRef.current();
    const rec = recRef.current;
    recRef.current = null;
    rec?.abort();
    setListening(false);
  }, []);

  return { status, listening, live, error, listen, stop, cancel };
}
