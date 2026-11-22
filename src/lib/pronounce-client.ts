"use client";

/**
 * Ghi âm một từ / câu rồi gửi /api/pronounce để chấm tới từng âm (máy chủ EngQuiz, scripts/voice/pronounce_service.py).
 *
 * Nhận biết đang nói theo NỀN ỒN của chính phòng / micro (không dùng một ngưỡng cố định: micro laptop bật lọc ồn
 * thường nhỏ hơn hẳn, ngưỡng cố định khiến app "không nghe thấy" rồi chờ hết giờ). Tự dừng khi im lặng sau tiếng nói,
 * khi bấm dừng hoặc quá giờ. Giữ bản ghi cuối để người học nghe lại giọng mình (như ELSA).
 *
 * Chỉ dùng khi đã đăng nhập và trình duyệt ghi âm được; dịch vụ chấm không chạy thì `available` tắt trong lượt mở
 * trang này để màn hình quay về nhận dạng giọng nói của trình duyệt.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import type { ApiResponse } from "./learner-schema";
import type { PronounceResult } from "./pronounce";

/** Tiếng nói phải to hơn nền ồn ít nhất ~10 dB (×3 biên độ), và không nhỏ hơn mức tuyệt đối này (RMS 0–1). */
const SPEECH_OVER_FLOOR = 3;
const MIN_SPEECH_RMS = 0.004;
/** Nền ồn ban đầu khi chưa đo được (rất nhỏ — thà nhận nhầm tiếng ồn là tiếng nói còn hơn "không nghe thấy"). */
const START_FLOOR = 0.002;
const END_SILENCE_MS = { word: 600, sentence: 900 } as const;
const MAX_MS = { word: 6_000, sentence: 15_000 } as const;
/** Chưa nói gì sau chừng này thì dừng và báo. */
const NO_SPEECH_MS = 5_000;
const TICK_MS = 40;

export type PronouncePhase = "idle" | "preparing" | "recording" | "scoring";
export type PronounceKind = "word" | "sentence" | "ipa";

let serviceDown = false;

function pickMimeType(): string | undefined {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
  return options.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
}

export function usePronounceCheck() {
  const { status } = useSession();
  const [supported, setSupported] = useState(false);
  const [down, setDown] = useState(serviceDown);
  const [phase, setPhase] = useState<PronouncePhase>("idle");
  /** Mức âm lượng micro hiện tại (0–1) để vẽ thanh mức — người học thấy app đang nghe. */
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  /** Bản ghi cuối (URL tạm) để nghe lại giọng mình. */
  const [lastRecording, setLastRecording] = useState<string | null>(null);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    setSupported(typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia && window.isSecureContext);
    return () => stopRef.current();
  }, []);
  useEffect(() => () => void (lastRecording && URL.revokeObjectURL(lastRecording)), [lastRecording]);

  const available = supported && status === "authenticated" && !down;

  /** Bấm lần nữa khi đang ghi → dừng sớm và chấm phần đã ghi. */
  const stop = useCallback(() => stopRef.current(), []);

  const check = useCallback(async (text: string, kind: PronounceKind = "word", focus?: string): Promise<PronounceResult | null> => {
    setError(null);
    setPhase("preparing");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    } catch {
      setPhase("idle");
      setError("Không mở được micro. Hãy cho phép trình duyệt dùng micro rồi thử lại.");
      return null;
    }

    const blob = await recordUntilSilence(stream, kind === "sentence" ? "sentence" : "word", {
      onStart: (stopNow) => {
        stopRef.current = stopNow;
        setPhase("recording");
      },
      onLevel: setLevel,
    });
    stream.getTracks().forEach((t) => t.stop());
    stopRef.current = () => {};
    setLevel(0);
    if (!blob) {
      setPhase("idle");
      setError("Chưa nghe thấy tiếng nói. Hãy nói to và gần micro hơn.");
      return null;
    }
    setLastRecording(URL.createObjectURL(blob));

    setPhase("scoring");
    try {
      const form = new FormData();
      form.set("file", blob, "rec");
      form.set("text", text);
      form.set("mode", kind);
      if (focus) form.set("focus", focus);
      const res = await fetch("/api/pronounce", { method: "POST", body: form });
      const json = (await res.json().catch(() => null)) as ApiResponse<PronounceResult> | null;
      if (res.status === 503 && json?.error?.includes("tạm nghỉ")) {
        serviceDown = true;
        setDown(true);
      }
      if (!res.ok || !json?.success || !json.data) {
        setError(json?.error ?? "Không chấm được bản ghi này. Hãy thử lại.");
        return null;
      }
      return json.data;
    } catch {
      setError("Mất kết nối khi gửi bản ghi. Hãy thử lại.");
      return null;
    } finally {
      setPhase("idle");
    }
  }, []);

  return { available, phase, busy: phase !== "idle", level, error, lastRecording, check, stop };
}

/**
 * Ghi tới khi im lặng sau tiếng nói / quá giờ / bấm dừng. Trả null nếu không có tiếng nói nào.
 * Nền ồn = mức nhỏ nhất gần đây (bám theo phòng); tiếng nói = to hơn nền SPEECH_OVER_FLOOR lần.
 */
function recordUntilSilence(
  stream: MediaStream,
  kind: "word" | "sentence",
  cb: { onStart: (stopNow: () => void) => void; onLevel: (level: number) => void },
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    const ctx = new AudioContext();
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
      void ctx.close();
      resolve(heard && chunks.length ? new Blob(chunks, { type: recorder.mimeType || "audio/webm" }) : null);
    };

    timer = window.setInterval(() => {
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += v * v;
      const rms = Math.sqrt(sum / buf.length);
      const now = performance.now();
      // Nền ồn: hạ ngay khi gặp mức nhỏ hơn, nâng chậm (để tiếng nói kéo dài không bị coi là nền).
      floor = rms < floor ? rms : floor + (rms - floor) * 0.01;
      const loud = rms > Math.max(floor * SPEECH_OVER_FLOOR, MIN_SPEECH_RMS);
      if (loud) {
        heard = true;
        lastLoud = now;
      }
      cb.onLevel(Math.min(1, rms * 12));
      const elapsed = now - started;
      if ((heard && now - lastLoud > END_SILENCE_MS[kind]) || elapsed > MAX_MS[kind] || (!heard && elapsed > NO_SPEECH_MS)) finish();
    }, TICK_MS);

    recorder.start();
    cb.onStart(finish);
  });
}
