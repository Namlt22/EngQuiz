"use client";

/**
 * Ghi âm một từ / câu rồi gửi /api/pronounce để chấm tới từng âm (OpenPronounce trên máy chủ).
 * Tự dừng khi người học nói xong (im lặng END_SILENCE_MS sau khi đã có tiếng), hoặc khi bấm dừng / quá giờ.
 *
 * Chỉ dùng khi đã đăng nhập và trình duyệt ghi âm được; dịch vụ chấm không chạy (503) thì `available` tắt trong
 * lượt mở trang này để màn hình quay về nhận dạng giọng nói của trình duyệt.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import type { ApiResponse } from "./learner-schema";
import type { PronounceResult } from "./pronounce";

/** Âm lượng (RMS 0–1) coi là đang nói. */
const SPEECH_RMS = 0.02;
const END_SILENCE_MS = { word: 700, sentence: 1100 } as const;
const MAX_MS = { word: 5_000, sentence: 15_000 } as const;
/** Chưa nói gì sau chừng này thì dừng và báo. */
const NO_SPEECH_MS = 6_000;

export type PronouncePhase = "idle" | "preparing" | "recording" | "scoring";

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
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    setSupported(typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia && window.isSecureContext);
    return () => stopRef.current();
  }, []);

  const available = supported && status === "authenticated" && !down;

  /** Bấm lần nữa khi đang ghi → dừng sớm và chấm phần đã ghi. */
  const stop = useCallback(() => stopRef.current(), []);

  const check = useCallback(async (text: string, kind: "word" | "sentence" = "word"): Promise<PronounceResult | null> => {
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

    const blob = await recordUntilSilence(stream, kind, (stopNow) => {
      stopRef.current = stopNow;
      setPhase("recording");
    });
    stream.getTracks().forEach((t) => t.stop());
    stopRef.current = () => {};
    if (!blob) {
      setPhase("idle");
      setError("Chưa nghe được gì. Bấm nút rồi đọc to.");
      return null;
    }

    setPhase("scoring");
    try {
      const form = new FormData();
      form.set("file", blob, "rec");
      form.set("text", text);
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

  return { available, phase, busy: phase !== "idle", error, check, stop };
}

/** Ghi tới khi im lặng sau tiếng nói / quá giờ / bấm dừng. Trả null nếu không có tiếng nói nào. */
function recordUntilSilence(stream: MediaStream, kind: "word" | "sentence", onStart: (stopNow: () => void) => void): Promise<Blob | null> {
  return new Promise((resolve) => {
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
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
      const now = performance.now();
      if (Math.sqrt(sum / buf.length) > SPEECH_RMS) {
        heard = true;
        lastLoud = now;
      }
      const elapsed = now - started;
      if ((heard && now - lastLoud > END_SILENCE_MS[kind]) || elapsed > MAX_MS[kind] || (!heard && elapsed > NO_SPEECH_MS)) finish();
    }, 50);

    recorder.start();
    onStart(finish);
  });
}
