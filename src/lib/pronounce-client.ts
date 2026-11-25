"use client";

/**
 * Ghi âm một từ / câu rồi gửi /api/pronounce để chấm tới từng âm (máy chủ EngQuiz, scripts/voice/pronounce_service.py).
 *
 * Ghi bằng bộ ghi chung (./recorder: tự dừng theo nền ồn của phòng). Giữ bản ghi cuối để người học nghe lại giọng
 * mình (như ELSA).
 *
 * Chỉ dùng khi đã đăng nhập và trình duyệt ghi âm được; dịch vụ chấm không chạy thì `available` tắt trong lượt mở
 * trang này để màn hình quay về nhận dạng giọng nói của trình duyệt.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { isServiceResting, postApi, replyData, replyError } from "./api-client";
import type { PronounceResult } from "./pronounce";
import { canRecordAudio, recordFromMicrophone } from "./recorder";

export type PronouncePhase = "idle" | "preparing" | "recording" | "scoring";
export type PronounceKind = "word" | "sentence" | "ipa";

let serviceDown = false;

function pronounceForm(blob: Blob, text: string, kind: PronounceKind, focus?: string): FormData {
  const form = new FormData();
  form.set("file", blob, "rec");
  form.set("text", text);
  form.set("mode", kind);
  if (focus) form.set("focus", focus);
  return form;
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
    setSupported(canRecordAudio());
    return () => stopRef.current();
  }, []);
  useEffect(() => () => void (lastRecording && URL.revokeObjectURL(lastRecording)), [lastRecording]);

  const available = supported && status === "authenticated" && !down;

  /** Bấm lần nữa khi đang ghi → dừng sớm và chấm phần đã ghi. */
  const stop = useCallback(() => stopRef.current(), []);

  const check = useCallback(async (text: string, kind: PronounceKind = "word", focus?: string): Promise<PronounceResult | null> => {
    setError(null);
    setPhase("preparing");
    const take = await recordFromMicrophone(kind === "sentence" ? "sentence" : "word", {
      onStart: (stopNow) => {
        stopRef.current = stopNow;
        setPhase("recording");
      },
      onLevel: setLevel,
    });
    stopRef.current = () => {};
    setLevel(0);
    if (take.kind === "mic-error") {
      setPhase("idle");
      setError("Không mở được micro. Hãy cho phép trình duyệt dùng micro rồi thử lại.");
      return null;
    }
    if (!take.blob) {
      setPhase("idle");
      setError("Chưa nghe thấy tiếng nói. Hãy nói to và gần micro hơn.");
      return null;
    }
    setLastRecording(URL.createObjectURL(take.blob));

    setPhase("scoring");
    try {
      const reply = await postApi<PronounceResult>("/api/pronounce", pronounceForm(take.blob, text, kind, focus));
      if (isServiceResting(reply)) {
        serviceDown = true;
        setDown(true);
      }
      const data = replyData(reply);
      if (!data) setError(replyError(reply, "Không chấm được bản ghi này. Hãy thử lại."));
      return data ?? null;
    } catch {
      setError("Mất kết nối khi gửi bản ghi. Hãy thử lại.");
      return null;
    } finally {
      setPhase("idle");
    }
  }, []);

  return { available, phase, busy: phase !== "idle", level, error, lastRecording, check, stop };
}
