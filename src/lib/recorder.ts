"use client";

/**
 * Ghi âm tới khi người học nói xong — dùng chung cho chấm phát âm (/api/pronounce) và nhận dạng lời nói (/api/transcribe).
 *
 * Nhận biết đang nói theo NỀN ỒN của chính phòng / micro (không dùng một ngưỡng cố định: micro laptop bật lọc ồn
 * thường nhỏ hơn hẳn, ngưỡng cố định khiến app "không nghe thấy" rồi chờ hết giờ). Tự dừng khi im lặng sau tiếng nói,
 * khi bấm dừng hoặc quá giờ.
 */

/** Tiếng nói phải to hơn nền ồn ít nhất ~10 dB (×3 biên độ), và không nhỏ hơn mức tuyệt đối này (RMS 0–1). */
const SPEECH_OVER_FLOOR = 3;
const MIN_SPEECH_RMS = 0.004;
/** Nền ồn ban đầu khi chưa đo được (rất nhỏ — thà nhận nhầm tiếng ồn là tiếng nói còn hơn "không nghe thấy"). */
const START_FLOOR = 0.002;
const TICK_MS = 40;
/** Đủ cho lời nói rõ, file nhỏ (3 phút ≈ 720 KB). */
const AUDIO_BITS_PER_SECOND = 32_000;

/** word: một từ; sentence: một câu; long: nói tự do, chỉ dừng khi bấm dừng / quá giờ. */
export type RecordKind = "word" | "sentence" | "long";

/** Im lặng chừng này sau lần nói cuối thì tự dừng (null = không tự dừng). Người học hay ngập ngừng giữa câu. */
const END_SILENCE_MS: Record<RecordKind, number | null> = { word: 700, sentence: 1200, long: null };
const MAX_MS: Record<RecordKind, number> = { word: 6_000, sentence: 15_000, long: 190_000 };
/** Chưa nói gì sau chừng này thì dừng và báo. */
const NO_SPEECH_MS: Record<RecordKind, number> = { word: 5_000, sentence: 6_000, long: 10_000 };

export function pickMimeType(): string | undefined {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
  return options.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
}

/** Trình duyệt ghi âm được (MediaRecorder + micro + trang https/localhost). Chỉ gọi phía trình duyệt. */
export function canRecordAudio(): boolean {
  return typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia && window.isSecureContext;
}

export function openMicrophone(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
}

/** Nền ồn: hạ ngay khi gặp mức nhỏ hơn, nâng chậm (để tiếng nói kéo dài không bị coi là nền). */
export function nextFloor(floor: number, rms: number): number {
  return rms < floor ? rms : floor + (rms - floor) * 0.01;
}

export function isSpeech(rms: number, floor: number): boolean {
  return rms > Math.max(floor * SPEECH_OVER_FLOOR, MIN_SPEECH_RMS);
}

/** Có nên dừng ghi ở thời điểm này không. */
export function shouldStop(kind: RecordKind, { heard, sinceLoudMs, elapsedMs }: { heard: boolean; sinceLoudMs: number; elapsedMs: number }): boolean {
  const silence = END_SILENCE_MS[kind];
  if (heard && silence !== null && sinceLoudMs > silence) return true;
  if (!heard && elapsedMs > NO_SPEECH_MS[kind]) return true;
  return elapsedMs > MAX_MS[kind];
}

/**
 * Ghi tới khi im lặng sau tiếng nói / quá giờ / bấm dừng. Trả null nếu không có tiếng nói nào.
 * `onStart` nhận hàm dừng sớm (vẫn trả phần đã ghi).
 */
export function recordUntilSilence(
  stream: MediaStream,
  kind: RecordKind,
  cb: { onStart: (stopNow: () => void) => void; onLevel?: (level: number) => void },
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: AUDIO_BITS_PER_SECOND });
    const chunks: Blob[] = [];
    const ctx = new AudioContext();
    // Safari / Chrome có thể tạo AudioContext ở trạng thái "suspended" sau khi chờ quyền micro → thanh mức đứng im,
    // app tưởng không có tiếng nói rồi tự dừng.
    void ctx.resume().catch(() => {});
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
    let floor = START_FLOOR;
    let heard = false;
    let lastLoud = 0;
    const started = performance.now();
    let timer = 0;

    const finish = () => {
      window.clearInterval(timer);
      if (recorder.state !== "inactive") recorder.stop();
    };
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      void ctx.close().catch(() => {});
      resolve(heard && chunks.length ? new Blob(chunks, { type: recorder.mimeType || "audio/webm" }) : null);
    };

    timer = window.setInterval(() => {
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += v * v;
      const rms = Math.sqrt(sum / buf.length);
      const now = performance.now();
      floor = nextFloor(floor, rms);
      if (isSpeech(rms, floor)) {
        heard = true;
        lastLoud = now;
      }
      cb.onLevel?.(Math.min(1, rms * 12));
      if (shouldStop(kind, { heard, sinceLoudMs: now - lastLoud, elapsedMs: now - started })) finish();
    }, TICK_MS);

    // Ghi theo khúc 1 giây: dừng giữa chừng vẫn còn dữ liệu.
    recorder.start(1000);
    cb.onStart(finish);
  });
}
