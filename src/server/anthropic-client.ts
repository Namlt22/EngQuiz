/**
 * Kết nối Claude dùng chung cho mọi tính năng AI (chấm bài nói, trò chuyện) — chỉ chạy ở server.
 * Khóa API không bao giờ xuống trình duyệt.
 */
import Anthropic from "@anthropic-ai/sdk";

/** Claude Haiku 5.5 — nhanh và rẻ, đủ tốt cho chấm / sửa câu ngắn và hội thoại ngắn. */
export const AI_MODEL = "claude-haiku-5-5";
const REQUEST_TIMEOUT_MS = 60_000;

/** Chưa đặt khóa (`missing`) hoặc khóa bị API từ chối (`rejected`: sai, bị thu hồi, hết quyền). */
export class AiNotConfiguredError extends Error {
  constructor(
    public readonly reason: "missing" | "rejected",
    message: string,
  ) {
    super(message);
  }
}
/** Lỗi tạm thời (quá tải, mạng, 5xx) — thử lại sau có thể được. */
export class AiUnavailableError extends Error {}
/** Bộ lọc an toàn từ chối nội dung. */
export class AiRefusedError extends Error {}
/** Kết quả bị cắt (hết max_tokens) hoặc sai dạng — thử lại y hệt thường vẫn hỏng. */
export class AiBadOutputError extends Error {}

/**
 * Chỉ dùng khóa đặt riêng cho EngQuiz (ENGQUIZ_ANTHROPIC_API_KEY trong .env) — không dùng ANTHROPIC_API_KEY chung:
 * tiến trình server có thể thừa hưởng khóa của công cụ khác trên máy, và EngQuiz không được tiêu nhầm khóa đó.
 */
function apiKey(): string | undefined {
  return process.env.ENGQUIZ_ANTHROPIC_API_KEY?.trim() || undefined;
}

let client: Anthropic | null = null;

/** Client đã cấu hình; chưa có khóa → AiNotConfiguredError("missing"). */
export function getAiClient(): Anthropic {
  const key = apiKey();
  if (!key) throw new AiNotConfiguredError("missing", "ENGQUIZ_ANTHROPIC_API_KEY chưa được đặt");
  // authToken: null → SDK không tự lấy ANTHROPIC_AUTH_TOKEN hay hồ sơ đăng nhập khác có trên máy chủ.
  client ??= new Anthropic({ apiKey: key, authToken: null, timeout: REQUEST_TIMEOUT_MS, maxRetries: 1 });
  return client;
}

/** Khóa API có trong môi trường server không (để trang hiện thông báo trước khi người học dùng). */
export function isAiConfigured(): boolean {
  return apiKey() !== undefined;
}

/**
 * Đổi lỗi của SDK thành lỗi của EngQuiz. Chỉ giữ loại lỗi + mã HTTP: thông điệp gốc của API có thể chứa
 * một phần nội dung request (lời của người học).
 */
export function toAiError(e: unknown): Error {
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    return new AiNotConfiguredError("rejected", `Khóa API bị từ chối (HTTP ${e.status})`);
  }
  if (e instanceof Anthropic.RateLimitError) return new AiUnavailableError(`Hết hạn mức gọi API (HTTP ${e.status})`);
  if (e instanceof Anthropic.APIError) return new AiUnavailableError(`Lỗi API ${e.name} (HTTP ${e.status ?? "?"})`);
  return new AiUnavailableError(`Lỗi khi gọi API: ${e instanceof Error ? e.name : typeof e}`);
}
