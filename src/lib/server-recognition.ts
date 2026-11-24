"use client";

/**
 * Nhận dạng lời nói trên máy chủ EngQuiz (POST /api/transcribe, Whisper chạy tại chỗ): ghi âm bằng bộ ghi chung
 * rồi gửi một lượt. Dùng thay Web Speech API khi đã đăng nhập; dịch vụ không chạy thì `markServerDown` và cả trang
 * quay về nhận dạng của trình duyệt.
 */
import type { ApiResponse } from "./learner-schema";
import { openMicrophone, recordUntilSilence, type RecordKind } from "./recorder";
import type { TranscribeResult } from "./transcribe";

let serverDown = false;
export const isServerDown = () => serverDown;

export type ServerListenOutcome =
  | { kind: "heard"; transcript: string; alternatives: string[]; durationMs: number }
  | { kind: "cancelled" }
  | { kind: "failed"; message: string };

export interface ServerListenHooks {
  /** Micro đã mở và đang ghi; nhận hàm dừng sớm. */
  onRecording: (stopNow: () => void) => void;
  /** Đã ghi xong, đang chờ máy chủ nhận dạng. */
  onRecognizing: () => void;
  isCancelled: () => boolean;
}

const NO_SPEECH = "Không nghe thấy tiếng nói. Hãy nói to, rõ và gần micro hơn.";

/** Một lượt nghe: mở micro → ghi tới khi nói xong → gửi nhận dạng. */
export async function listenOnServer(
  { lang, kind, expected }: { lang: string; kind: RecordKind; expected?: string },
  hooks: ServerListenHooks,
): Promise<ServerListenOutcome> {
  let stream: MediaStream;
  try {
    stream = await openMicrophone();
  } catch (err) {
    const denied = err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "SecurityError");
    return {
      kind: "failed",
      message: denied
        ? "Trình duyệt chưa được phép dùng micro. Bấm biểu tượng ổ khóa cạnh thanh địa chỉ → cho phép Micro, rồi thử lại."
        : "Không mở được micro. Kiểm tra micro đã cắm và đang bật.",
    };
  }
  const startedAt = performance.now();
  let blob: Blob | null;
  try {
    blob = await recordUntilSilence(stream, kind, { onStart: hooks.onRecording });
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
  const durationMs = performance.now() - startedAt;
  if (hooks.isCancelled()) return { kind: "cancelled" };
  if (!blob) return { kind: "failed", message: NO_SPEECH };

  hooks.onRecognizing();
  const form = new FormData();
  form.set("file", blob, "rec");
  form.set("lang", lang.toLowerCase().startsWith("zh") ? "zh" : "en");
  if (expected) form.set("expected", expected);
  let res: Response;
  let json: ApiResponse<TranscribeResult> | null;
  try {
    res = await fetch("/api/transcribe", { method: "POST", body: form });
    json = (await res.json().catch(() => null)) as ApiResponse<TranscribeResult> | null;
  } catch {
    return { kind: "failed", message: "Mất kết nối khi gửi bản ghi. Kiểm tra mạng rồi thử lại." };
  }
  if (hooks.isCancelled()) return { kind: "cancelled" };
  // Dịch vụ tắt / phiên đăng nhập hết hạn → lần bấm sau dùng nhận dạng của trình duyệt.
  if (res.status === 401 || (res.status === 503 && json?.error?.includes("tạm nghỉ"))) serverDown = true;
  if (!res.ok || !json?.success || !json.data) return { kind: "failed", message: json?.error ?? "Không nhận dạng được bản ghi này. Hãy thử lại." };
  const transcript = json.data.transcript.trim();
  if (!transcript) return { kind: "failed", message: NO_SPEECH };
  const alternatives = [transcript, ...json.data.alternatives.map((a) => a.trim()).filter((a) => a && a !== transcript)];
  return { kind: "heard", transcript, alternatives, durationMs };
}
