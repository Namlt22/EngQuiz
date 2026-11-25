"use client";

/**
 * Phát giọng đọc mẫu tạo sẵn bằng Kokoro (public/audio/voice/en/<khoá>.mp3, xem scripts/voice/generate_kokoro.py).
 * Một câu có file thì useSpeech phát file thay vì giọng máy của trình duyệt: cùng một giọng tự nhiên trên mọi máy.
 * Danh sách khoá có file (index.json) tải một lần; khi chưa tải xong hoặc không có file thì useSpeech dùng giọng máy.
 */
import { wakeAudio } from "./audio-keepalive";
import { COLD_START_MS } from "./speech-runner";

const BASE = "/audio/voice/en";

let index: Set<string> | null = null;
let loading: Promise<void> | null = null;

/** Tải danh sách khoá có file (gọi sớm, vd khi trang có nút nghe vừa mở). Lỗi mạng → coi như không có file nào. */
export function loadVoiceIndex(): Promise<void> {
  loading ??= fetch(`${BASE}/index.json`)
    .then((r) => (r.ok ? r.json() : []))
    .then((keys: unknown) => {
      index = new Set(Array.isArray(keys) ? keys.filter((k): k is string => typeof k === "string") : []);
    })
    .catch(() => {
      index = new Set();
    });
  return loading;
}

export const hasVoiceFile = (key: string) => !!index?.has(key);

let current: HTMLAudioElement | null = null;
let seq = 0;

/** Dừng file đang phát (không gọi onEnd). */
export function stopVoiceFile() {
  seq++;
  current?.pause();
  current = null;
}

export interface VoiceFileCallbacks {
  onStart?: () => void;
  /** Dừng vì xong, bị câu khác cắt ngang hoặc lỗi — để giao diện thoát trạng thái "đang đọc". */
  onSettle?: () => void;
  /** Chỉ khi đọc hết câu. */
  onEnd?: () => void;
  /** Không phát được file → useSpeech chuyển sang giọng máy. */
  onFail?: () => void;
}

export function playVoiceFile(key: string, rate: number, cb: VoiceFileCallbacks = {}) {
  stopVoiceFile();
  const my = seq;
  const audio = new Audio(`${BASE}/${key}.mp3`);
  audio.playbackRate = rate;
  audio.preservesPitch = true;
  current = audio;
  const alive = () => my === seq;
  audio.onended = () => {
    if (!alive()) return;
    current = null;
    cb.onSettle?.();
    cb.onEnd?.();
  };
  audio.onpause = () => {
    // Bị dừng giữa chừng (stopVoiceFile đã đổi seq) — chỉ báo thoát trạng thái đang đọc.
    if (!alive() && !audio.ended) cb.onSettle?.();
  };
  const start = () => {
    if (!alive()) return;
    audio
      .play()
      .then(() => alive() && cb.onStart?.())
      .catch((err: unknown) => {
        if (!alive() || (err instanceof DOMException && err.name === "AbortError")) return;
        current = null;
        cb.onSettle?.();
        cb.onFail?.();
      });
  };
  // Thiết bị âm thanh đang ngủ: đánh thức rồi chờ một nhịp, nếu không âm đầu của câu bị nuốt.
  if (wakeAudio()) window.setTimeout(start, COLD_START_MS);
  else start();
}
