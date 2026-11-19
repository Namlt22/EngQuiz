/**
 * Điều phối giọng máy (Web Speech API) — dùng chung cho mọi nút nghe của khoá tiếng Anh và tiếng Trung.
 * Tách khỏi React và nhận phụ thuộc qua tham số để test được với giọng giả.
 *
 * Xử lý các lỗi làm "mất chữ đầu" / "bấm nghe mà chậm":
 *  1. Thiết bị âm thanh đang ngủ → đánh thức (wakeAudio) và chờ COLD_START_MS trước khi đọc.
 *  2. Đang đọc dở mà bấm câu khác → cancel() rồi chờ INTERRUPT_GAP_MS mới speak():
 *     Chrome (nhất là Android, giọng online) gọi speak() liền sau cancel() hay bỏ mất câu mới hoặc kẹt hàng đợi.
 *  3. Chrome thỉnh thoảng kẹt ở trạng thái "paused" sau khi đổi tab → resume() trước khi đọc.
 *  4. Hàng đợi kẹt (không phát, không báo lỗi) → sau START_TIMEOUT_MS chưa bắt đầu thì huỷ và đọc lại một lần.
 *  5. Bấm liên tiếp: chỉ lần bấm cuối được đọc (token), các lần chờ trước bị bỏ.
 * Một runner duy nhất cho cả trang (giọng máy là tài nguyên chung của trình duyệt).
 */

export interface SynthLike {
  readonly speaking: boolean;
  readonly pending: boolean;
  readonly paused: boolean;
  speak(u: UtteranceLike): void;
  cancel(): void;
  resume(): void;
}

export interface UtteranceLike {
  onstart: ((ev: unknown) => void) | null;
  onend: ((ev: unknown) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
}

export interface RunnerDeps {
  synth: SynthLike;
  setTimeout: (fn: () => void, ms: number) => unknown;
  /** Trả về true nếu thiết bị âm thanh vừa được đánh thức (đang "lạnh"). */
  wakeAudio: () => boolean;
}

export interface SpeakHooks {
  onStart?: () => void;
  /** Đọc xong cả câu (không gọi khi bị huỷ / lỗi). */
  onEnd?: () => void;
  /** Lỗi thật (không phát được, mất mạng, hết thời gian chờ). */
  onError?: (code: string) => void;
  /** Câu kết thúc vì bất kỳ lý do gì (xong, huỷ, lỗi) — để tắt trạng thái "đang đọc". */
  onSettle?: () => void;
}

export const INTERRUPT_GAP_MS = 60;
export const COLD_START_MS = 250;
export const START_TIMEOUT_MS = 5000;

export function createSpeechRunner(deps: RunnerDeps) {
  let token = 0;
  /** Giữ tham chiếu câu đang đọc để Chrome không thu hồi sớm (mất sự kiện onend). */
  let current: UtteranceLike[] = [];

  function attempt(my: number, makeParts: () => UtteranceLike[], hooks: SpeakHooks, retry: boolean) {
    if (my !== token) return;
    const parts = makeParts();
    if (!parts.length) return;
    const last = parts[parts.length - 1];
    let started = false;
    let failed = false;

    parts[0].onstart = () => {
      started = true;
      hooks.onStart?.();
    };
    last.onend = () => {
      hooks.onSettle?.();
      if (!failed && my === token) hooks.onEnd?.();
    };
    for (const u of parts) {
      u.onerror = (e) => {
        hooks.onSettle?.();
        if (failed || e.error === "interrupted" || e.error === "canceled") return;
        failed = true;
        hooks.onError?.(e.error);
      };
    }
    current = parts;
    for (const u of parts) deps.synth.speak(u);

    deps.setTimeout(() => {
      if (my !== token || started || failed) return;
      deps.synth.cancel();
      if (retry) {
        deps.setTimeout(() => attempt(my, makeParts, hooks, false), INTERRUPT_GAP_MS);
      } else {
        failed = true;
        hooks.onSettle?.();
        hooks.onError?.("timeout");
      }
    }, START_TIMEOUT_MS);
  }

  return {
    /** `makeParts` tạo các câu (utterance) mới mỗi lần gọi — dùng lại được khi phải đọc lại. */
    speak(makeParts: () => UtteranceLike[], hooks: SpeakHooks = {}) {
      const my = ++token;
      const { synth } = deps;
      const cold = deps.wakeAudio();
      const interrupting = synth.speaking || synth.pending;
      if (interrupting) synth.cancel();
      if (synth.paused) synth.resume();
      const delay = (interrupting ? INTERRUPT_GAP_MS : 0) + (cold ? COLD_START_MS : 0);
      if (delay) deps.setTimeout(() => attempt(my, makeParts, hooks, true), delay);
      else attempt(my, makeParts, hooks, true);
    },
    stop() {
      token++;
      deps.synth.cancel();
    },
    /** Để test: câu đang được giữ tham chiếu */
    get current() {
      return current;
    },
  };
}

export type SpeechRunner = ReturnType<typeof createSpeechRunner>;
