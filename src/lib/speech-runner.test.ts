import { describe, expect, it, vi } from "vitest";
import { COLD_START_MS, INTERRUPT_GAP_MS, START_TIMEOUT_MS, createSpeechRunner, type SynthLike, type UtteranceLike } from "./speech-runner";

/** Giọng máy giả: ghi lại lệnh, cho test tự bắn sự kiện start/end/error. */
function fakeSynth() {
  const log: string[] = [];
  const spoken: (UtteranceLike & { text: string })[] = [];
  const synth = {
    speaking: false,
    pending: false,
    paused: false,
    speak(u: UtteranceLike) {
      spoken.push(u as UtteranceLike & { text: string });
      log.push(`speak:${(u as UtteranceLike & { text: string }).text}`);
      this.pending = true;
    },
    cancel() {
      log.push("cancel");
      for (const u of spoken) u.onerror?.({ error: "interrupted" });
      this.speaking = false;
      this.pending = false;
    },
    resume() {
      log.push("resume");
      this.paused = false;
    },
  };
  return { synth: synth as SynthLike & typeof synth, log, spoken };
}

const utt = (text: string): UtteranceLike & { text: string } => ({ text, onstart: null, onend: null, onerror: null });

function setup({ cold = false } = {}) {
  vi.useFakeTimers();
  const fake = fakeSynth();
  const runner = createSpeechRunner({ synth: fake.synth, setTimeout: (fn, ms) => setTimeout(fn, ms), wakeAudio: () => cold });
  return { ...fake, runner };
}

describe("điều phối giọng máy", () => {
  it("thiết bị đã thức, không có câu đang đọc: đọc ngay", () => {
    const { runner, log } = setup();
    runner.speak(() => [utt("hello")]);
    expect(log).toEqual(["speak:hello"]);
  });

  it("thiết bị đang ngủ: chờ COLD_START_MS rồi mới đọc (không mất âm đầu)", () => {
    const { runner, log } = setup({ cold: true });
    runner.speak(() => [utt("你")]);
    expect(log).toEqual([]);
    vi.advanceTimersByTime(COLD_START_MS);
    expect(log).toEqual(["speak:你"]);
  });

  it("đang đọc dở mà bấm câu khác: huỷ, chờ một nhịp rồi mới đọc câu mới", () => {
    const { runner, log, synth } = setup();
    runner.speak(() => [utt("a")]);
    synth.speaking = true;
    runner.speak(() => [utt("b")]);
    expect(log).toEqual(["speak:a", "cancel"]);
    vi.advanceTimersByTime(INTERRUPT_GAP_MS);
    expect(log).toEqual(["speak:a", "cancel", "speak:b"]);
  });

  it("bấm liên tiếp khi đang chờ: chỉ câu cuối được đọc", () => {
    const { runner, log } = setup({ cold: true });
    runner.speak(() => [utt("1")]);
    runner.speak(() => [utt("2")]);
    runner.speak(() => [utt("3")]);
    vi.advanceTimersByTime(COLD_START_MS);
    expect(log).toEqual(["speak:3"]);
  });

  it("đang ở trạng thái paused (lỗi Chrome sau khi đổi tab): resume trước khi đọc", () => {
    const { runner, log, synth } = setup();
    synth.paused = true;
    runner.speak(() => [utt("x")]);
    expect(log).toEqual(["resume", "speak:x"]);
  });

  it("hàng đợi kẹt: quá thời gian chưa bắt đầu thì huỷ và đọc lại một lần; lần hai vẫn kẹt thì báo lỗi", () => {
    const { runner, log } = setup();
    const onError = vi.fn();
    runner.speak(() => [utt("stuck")], { onError });
    vi.advanceTimersByTime(START_TIMEOUT_MS + INTERRUPT_GAP_MS);
    expect(log).toEqual(["speak:stuck", "cancel", "speak:stuck"]);
    expect(onError).not.toHaveBeenCalled();
    vi.advanceTimersByTime(START_TIMEOUT_MS);
    expect(onError).toHaveBeenCalledWith("timeout");
  });

  it("đã bắt đầu đọc thì không đọc lại; đọc xong gọi onEnd", () => {
    const { runner, log, spoken } = setup();
    const onEnd = vi.fn();
    runner.speak(() => [utt("ok")], { onEnd });
    spoken[0].onstart?.({});
    vi.advanceTimersByTime(START_TIMEOUT_MS * 2);
    expect(log).toEqual(["speak:ok"]);
    spoken[0].onend?.({});
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it("bị huỷ vì câu khác không tính là lỗi, không gọi onEnd", () => {
    const { runner, spoken, synth } = setup();
    const onError = vi.fn();
    const onEnd = vi.fn();
    runner.speak(() => [utt("first")], { onError, onEnd });
    synth.speaking = true;
    runner.speak(() => [utt("second")]);
    expect(spoken[0]).toBeDefined();
    expect(onError).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
  });

  it("dừng: huỷ và bỏ mọi lần đọc đang chờ", () => {
    const { runner, log } = setup({ cold: true });
    runner.speak(() => [utt("later")]);
    runner.stop();
    vi.advanceTimersByTime(COLD_START_MS * 2);
    expect(log).toEqual(["cancel"]);
  });
});
