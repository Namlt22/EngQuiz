"use client";

/**
 * Giữ thiết bị âm thanh luôn "thức" trong lúc người học đang nghe.
 *
 * Vì sao: tai nghe Bluetooth, loa Windows (tiết kiệm điện) và nhiều điện thoại tắt luồng âm khi im lặng vài giây.
 * Lần phát tiếp theo phải chờ 0,2–0,5 giây để thiết bị bật lại → nuốt mất âm đầu (bài pinyin chỉ đọc một chữ
 * nên mất luôn phụ âm đầu). Phát một luồng gần như im lặng (-100 dBFS, không nghe thấy) qua Web Audio giữ cho
 * thiết bị mở sẵn; tự tắt sau IDLE_MS không dùng hoặc khi ẩn tab để không tốn pin.
 *
 * Phải gọi lần đầu trong một thao tác của người dùng (bấm nút) — trình duyệt chỉ cho mở âm thanh khi đó.
 */

const IDLE_MS = 45_000;
/** Biên độ nhiễu cực nhỏ: khác 0 để hệ điều hành không coi là "im lặng" mà tắt thiết bị. */
const NOISE_LEVEL = 1e-5;

let ctx: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let listening = false;

function sleep() {
  try {
    source?.stop();
  } catch {
    /* đã dừng */
  }
  source = null;
  void ctx?.suspend().catch(() => {});
}

function onVisibility() {
  if (document.visibilityState === "hidden") sleep();
}

/**
 * Bật (hoặc gia hạn) luồng giữ thiết bị. Trả về true nếu thiết bị đang "lạnh" (vừa bật lại) —
 * khi đó nên chờ COLD_START_MS trước khi phát để không mất âm đầu.
 */
export function wakeAudio(): boolean {
  if (typeof window === "undefined") return false;
  const AC: typeof AudioContext | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return false;
  let cold = false;
  try {
    if (!ctx) ctx = new AC();
    if (ctx.state !== "running") {
      cold = true;
      void ctx.resume().catch(() => {});
    }
    if (!source) {
      cold = true;
      const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * NOISE_LEVEL;
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(ctx.destination);
      source.start();
    }
    if (!listening) {
      document.addEventListener("visibilitychange", onVisibility);
      listening = true;
    }
  } catch {
    // Trình duyệt không cho mở âm thanh (chưa có thao tác người dùng…): vẫn phát bình thường, chỉ không giữ thiết bị.
    return false;
  }
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(sleep, IDLE_MS);
  return cold;
}
