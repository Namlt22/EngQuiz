/** Lỗi phía AI (src/server/anthropic-client.ts) → phản hồi HTTP cho người học, không lộ chi tiết nội bộ. */
import { fail } from "./api-response";
import { AiBadOutputError, AiNotConfiguredError, AiRefusedError, AiUnavailableError } from "./anthropic-client";

/** Thông báo riêng của từng màn hình; các lỗi cấu hình / kết nối dùng chung. */
export interface AiErrorMessages {
  refused: string;
  badOutput: string;
  fallback: string;
}

export function aiErrorResponse(e: unknown, messages: AiErrorMessages) {
  if (e instanceof AiNotConfiguredError) {
    return e.reason === "missing"
      ? fail(503, "AI chưa được cấu hình trên server (thiếu ENGQUIZ_ANTHROPIC_API_KEY).")
      : fail(503, "Khóa API của AI bị từ chối (sai, đã thu hồi hoặc hết credit). Hãy báo người quản trị.");
  }
  if (e instanceof AiRefusedError) return fail(422, messages.refused);
  if (e instanceof AiBadOutputError) return fail(502, messages.badOutput);
  if (e instanceof AiUnavailableError) return fail(503, "AI đang bận hoặc lỗi kết nối. Hãy thử lại sau ít phút.");
  return fail(500, messages.fallback);
}

/** Chỉ log loại lỗi và thông điệp do EngQuiz tạo (không chứa lời của người học). */
export function logAiError(tag: string, e: unknown): void {
  console.error(`[${tag}] ${e instanceof Error ? `${e.name}: ${e.message}` : String(e)}`);
}
