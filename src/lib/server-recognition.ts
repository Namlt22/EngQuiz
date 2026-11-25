"use client";

/**
 * Nhận dạng lời nói trên máy chủ EngQuiz (POST /api/transcribe, Whisper chạy tại chỗ): ghi âm bằng bộ ghi chung
 * rồi gửi một lượt. Dùng thay Web Speech API khi đã đăng nhập; dịch vụ không chạy thì `markServerDown` và cả trang
 * quay về nhận dạng của trình duyệt.
 */
import { isServiceResting, postApi, replyData, replyError, type ApiReply } from "./api-client";
import { isMicPermissionError, recordFromMicrophone, type RecordKind } from "./recorder";
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

const MIC_DENIED = "Trình duyệt chưa được phép dùng micro. Bấm biểu tượng ổ khóa cạnh thanh địa chỉ → cho phép Micro, rồi thử lại.";
const MIC_FAILED = "Không mở được micro. Kiểm tra micro đã cắm và đang bật.";

/** Một lượt nghe: mở micro → ghi tới khi nói xong → gửi nhận dạng. */
export async function listenOnServer(
  { lang, kind, expected }: { lang: string; kind: RecordKind; expected?: string },
  hooks: ServerListenHooks,
): Promise<ServerListenOutcome> {
  const take = await recordFromMicrophone(kind, { onStart: hooks.onRecording });
  if (take.kind === "mic-error") return { kind: "failed", message: isMicPermissionError(take.error) ? MIC_DENIED : MIC_FAILED };
  if (hooks.isCancelled()) return { kind: "cancelled" };
  if (!take.blob) return { kind: "failed", message: NO_SPEECH };

  hooks.onRecognizing();
  let reply: ApiReply<TranscribeResult>;
  try {
    reply = await postApi<TranscribeResult>("/api/transcribe", transcribeForm(take.blob, lang, expected));
  } catch {
    return { kind: "failed", message: "Mất kết nối khi gửi bản ghi. Kiểm tra mạng rồi thử lại." };
  }
  if (hooks.isCancelled()) return { kind: "cancelled" };
  // Dịch vụ tắt / phiên đăng nhập hết hạn → lần bấm sau dùng nhận dạng của trình duyệt.
  if (reply.status === 401 || isServiceResting(reply)) serverDown = true;
  const data = replyData(reply);
  if (!data) return { kind: "failed", message: replyError(reply, "Không nhận dạng được bản ghi này. Hãy thử lại.") };
  return heardOutcome(data, take.durationMs);
}

function transcribeForm(blob: Blob, lang: string, expected?: string): FormData {
  const form = new FormData();
  form.set("file", blob, "rec");
  form.set("lang", lang.toLowerCase().startsWith("zh") ? "zh" : "en");
  if (expected) form.set("expected", expected);
  return form;
}

/** Kết quả máy chủ → lượt nghe: bản chính đứng đầu, bỏ bản đoán rỗng / trùng. */
export function heardOutcome(data: TranscribeResult, durationMs: number): ServerListenOutcome {
  const transcript = data.transcript.trim();
  if (!transcript) return { kind: "failed", message: NO_SPEECH };
  const alternatives = [transcript, ...data.alternatives.map((a) => a.trim()).filter((a) => a && a !== transcript)];
  return { kind: "heard", transcript, alternatives, durationMs };
}
