/**
 * Nhận dạng giọng nói của trình duyệt (Web Speech API): kiểu tối thiểu, tạo đối tượng nhận dạng, nhận dạng trên máy
 * (Chrome 139+), xem trước lời nói khi đang ghi lên máy chủ, và một lượt nghe đầy đủ cho hook useSpeechRecognition.
 * Micro chỉ dùng được trên HTTPS hoặc localhost (secure context).
 */
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
export interface Recognition {
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
export type RecognitionCtor = (new () => Recognition) & {
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

const ALTERNATIVES = 5;

/**
 * Nhận dạng trên máy dùng được cho ngôn ngữ nào. Kiểm một lần khi mở trang (bất đồng bộ) và lưu kết quả
 * để lúc bấm micro đọc ngay (processLocally phải đặt TRƯỚC khi start).
 */
const localChecked = new Set<string>();
const localOk = new Set<string>();
export function checkLocalSupport(Ctor: RecognitionCtor, lang: string): void {
  if (localChecked.has(lang) || typeof Ctor.available !== "function") return;
  localChecked.add(lang);
  Ctor.available({ langs: [lang], processLocally: true })
    .then((r) => {
      if (r === "available") localOk.add(lang);
    })
    .catch(() => {});
}

export function getRecognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

/** Tạo đối tượng nhận dạng; có gói ngôn ngữ trên máy → nhận dạng tại chỗ (không qua mạng, nhanh hơn rõ rệt). */
function createRecognition(Ctor: RecognitionCtor, lang: string, continuous: boolean): Recognition {
  const rec = new Ctor();
  rec.lang = lang;
  if (localOk.has(lang) && "processLocally" in rec) rec.processLocally = true;
  rec.continuous = continuous;
  rec.interimResults = true;
  rec.maxAlternatives = ALTERNATIVES;
  return rec;
}

/**
 * Đọc các kết quả mới của một sự kiện: đoạn đã chốt thêm vào `finals`; trả phần chưa chốt và
 * các bản đoán của đoạn chốt cuối (undefined nếu sự kiện này không chốt đoạn nào).
 */
function readResults(e: RecognitionEvent, finals: string[]): { interim: string; alternatives?: string[] } {
  let interim = "";
  let alternatives: string[] | undefined;
  for (let i = e.resultIndex; i < e.results.length; i++) {
    const result = e.results[i];
    if (result.isFinal) {
      finals.push(result[0].transcript.trim());
      alternatives = Array.from({ length: result.length }, (_, k) => result[k].transcript.trim());
    } else interim += result[0].transcript;
  }
  return { interim, alternatives };
}

const joinHeard = (finals: readonly string[], interim: string) => [...finals, interim.trim()].filter(Boolean).join(" ");

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

/** Ngắt giọng đọc mẫu đang phát để micro không thu lại tiếng của chính app. */
export function stopSpeaking(): void {
  if (window.speechSynthesis?.speaking || window.speechSynthesis?.pending) window.speechSynthesis.cancel();
}

const quietly = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* đã dừng */
  }
};

/* ---------------- Xem trước lời nói (khi ghi lên máy chủ) ---------------- */

/**
 * Điện thoại: micro thường chỉ cho một bên thu, chạy thêm nhận dạng của trình duyệt có thể làm bản ghi im lặng
 * → không xem trước, chỉ hiện chữ khi máy chủ trả về.
 */
function canPreview(): boolean {
  return !/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export interface Preview {
  /** Ngừng nghe thêm (người học đã nói xong); các đoạn đang dở vẫn được trình duyệt chốt nốt. */
  pause: () => void;
  /** Tắt hẳn, trả các bản đoán đã chốt (rỗng nếu không có). */
  collect: () => string[];
}

export const NO_PREVIEW: Preview = { pause: () => {}, collect: () => [] };

/** Nhận dạng của trình duyệt chỉ để xem trước lời nói; mọi lỗi của nó bị bỏ qua (máy chủ mới là kết quả chính). */
export function startPreview(lang: string, onHeard: (text: string) => void): Preview {
  const Ctor = getRecognitionCtor();
  if (!Ctor || !canPreview()) return NO_PREVIEW;
  const rec = createRecognition(Ctor, lang, true);
  const finals: string[] = [];
  let lastAlternatives: string[] = [];
  let interim = "";
  rec.onresult = (e) => {
    const read = readResults(e, finals);
    interim = read.interim;
    if (read.alternatives) lastAlternatives = read.alternatives;
    onHeard(joinHeard(finals, interim));
  };
  rec.onerror = () => {};
  try {
    rec.start();
  } catch {
    return NO_PREVIEW;
  }
  return {
    pause: () => quietly(() => rec.stop()),
    collect: () => {
      rec.onresult = null;
      quietly(() => rec.abort());
      if (finals.length === 1 && !interim.trim()) return lastAlternatives.filter(Boolean);
      const joined = joinHeard(finals, interim);
      return joined ? [joined] : [];
    },
  };
}

/* ---------------- Một lượt nghe bằng trình duyệt ---------------- */

export interface ListenResult {
  /** Toàn bộ lời nói (các đoạn đã chốt nối lại). */
  transcript: string;
  /** Các bản đoán khác nhau cho lời nói (chế độ một câu); bản 0 = transcript. */
  alternatives: string[];
  durationMs: number;
}

export interface BrowserTurnHooks {
  onReady: () => void;
  onLive: (text: string) => void;
  onError: (message: string) => void;
  /** Lượt kết thúc khi vẫn là lượt hiện tại (lượt cũ vừa bị hủy kết thúc muộn thì không gọi). */
  onEnded: () => void;
  /** Không bắt đầu được (sau onError). */
  onStartFailed: () => void;
}

export interface BrowserTurn {
  rec: Recognition;
  /** Bị hủy (đổi câu/đề, rời trang, bắt đầu lượt mới) → không trả kết quả, để không chấm nhầm ngữ cảnh. */
  cancel: () => void;
  /** Bắt đầu nghe; trả kết quả khi dừng (null = lỗi / hủy / không nghe được gì). Gọi một lần. */
  start: () => Promise<ListenResult | null>;
}

/**
 * Tạo một lượt nghe (chưa bắt đầu: hook gắn ref / trạng thái trước rồi mới `start`). Chế độ một câu: tự dừng khi đã nghe đủ câu cần đọc (`expected`), hoặc khi im lặng một lúc
 * sau lần nói cuối. `isCurrent` cho biết lượt này còn là lượt đang chạy của hook.
 */
export function createBrowserTurn(
  Ctor: RecognitionCtor,
  { lang, continuous, expected, isCurrent }: { lang: string; continuous: boolean; expected?: readonly string[]; isCurrent: (rec: Recognition) => boolean },
  hooks: BrowserTurnHooks,
): BrowserTurn {
  const rec = createRecognition(Ctor, lang, continuous);
  const finals: string[] = [];
  let alternatives: string[] = [];
  /** Phần đang nhận dạng dở (chưa chốt) gần nhất — dùng khi tự dừng sớm mà trình duyệt chưa kịp chốt. */
  let interimText = "";
  let silenceTimer = 0;
  const zhLang = lang.toLowerCase().startsWith("zh");
  const silenceMs = silenceFor(expected);
  const scheduleEnd = (text: string) => {
    if (continuous) return;
    window.clearTimeout(silenceTimer);
    if (expected?.length && heardAll(text, expected, zhLang ? "zh" : "en")) {
      rec.stop();
      return;
    }
    silenceTimer = window.setTimeout(() => {
      if (isCurrent(rec)) rec.stop();
    }, silenceMs);
  };
  let failed = false;
  let cancelled = false;
  const startedAt = performance.now();

  const start = () =>
    new Promise<ListenResult | null>((resolve) => {
    const markReady = () => {
      if (isCurrent(rec)) hooks.onReady();
    };
    rec.onaudiostart = markReady;
    // Trình duyệt không có audiostart: coi như sẵn sàng khi bắt đầu.
    if (!("onaudiostart" in rec)) rec.onstart = markReady;
    rec.onresult = (e) => {
      const read = readResults(e, finals);
      if (read.alternatives) alternatives = read.alternatives;
      interimText = read.interim.trim();
      const heardSoFar = joinHeard(finals, interimText);
      hooks.onLive(heardSoFar);
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
      hooks.onError(recognitionErrorMessage(e.error));
    };
    rec.onend = () => {
      window.clearTimeout(silenceTimer);
      if (isCurrent(rec)) hooks.onEnded();
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
      hooks.onError(recognitionErrorMessage(err instanceof Error ? err.name : "start-failed"));
      hooks.onStartFailed();
      resolve(null);
    }
  });

  return {
    rec,
    cancel: () => {
      cancelled = true;
    },
    start,
  };
}
