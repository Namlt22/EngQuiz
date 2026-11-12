/**
 * POST /api/speaking/feedback — AI chấm và sửa câu trả lời nói tự do.
 * Body: { promptId, transcript, seconds, level? } → ApiResponse<SpeakingFeedback>
 *
 * Mỗi lượt gọi Claude tốn phí, nên: bắt buộc đăng nhập, chỉ nhận đề có sẵn, giới hạn tần suất theo người dùng,
 * theo IP (chặn một người tạo nhiều tài khoản) và tổng cả server mỗi ngày. Lượt lỗi do phía AI được trả lại.
 * Bộ đếm nằm trong bộ nhớ tiến trình (reset khi khởi động lại) — nên đặt thêm hạn mức chi tiêu cho khóa API ở Anthropic Console.
 */
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getSpeakingPrompt } from "@/content/speaking-prompts";
import type { ApiResponse } from "@/lib/learner-schema";
import { FEEDBACK_LIMITS, feedbackRequestSchema, type SpeakingFeedback } from "@/lib/speaking-feedback";
import { createRateLimiter } from "@/server/rate-limit";
import { BodyTooLargeError, clientIp, isSameOrigin, readBodyWithLimit } from "@/server/request";
import { AiBadOutputError, AiNotConfiguredError, AiRefusedError, AiUnavailableError, getSpeakingFeedback } from "@/server/speaking-ai";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const TEN_MINUTES = 10 * 60_000;
const ONE_DAY = 24 * 60 * 60_000;
const GLOBAL_KEY = "all";

const userBurst = createRateLimiter({ limit: 10, windowMs: TEN_MINUTES });
const userDaily = createRateLimiter({ limit: 60, windowMs: ONE_DAY });
const ipBurst = createRateLimiter({ limit: 20, windowMs: TEN_MINUTES });
const globalDaily = createRateLimiter({ limit: 500, windowMs: ONE_DAY });

function fail(status: number, error: string) {
  return NextResponse.json<ApiResponse<never>>({ success: false, data: null, error }, { status });
}

/** Lấy một lượt ở mọi bộ đếm; nếu bộ nào hết thì trả lại các lượt đã lấy và báo lý do. */
function takeQuota(userId: string, ip: string): string | null {
  const steps: [ReturnType<typeof createRateLimiter>, string, string][] = [
    [userBurst, userId, "Bạn gửi hơi nhiều, hãy nghỉ vài phút rồi thử lại."],
    [ipBurst, ip, "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút."],
    [userDaily, userId, "Bạn đã dùng hết lượt AI chấm hôm nay. Mai luyện tiếp nhé!"],
    [globalDaily, GLOBAL_KEY, "Hôm nay hệ thống đã dùng hết lượt AI chấm. Hãy thử lại vào ngày mai."],
  ];
  for (let i = 0; i < steps.length; i++) {
    const [limiter, key, message] = steps[i];
    if (!limiter.check(key)) {
      steps.slice(0, i).forEach(([l, k]) => l.refund(k));
      return message;
    }
  }
  return null;
}

function refundQuota(userId: string, ip: string) {
  userBurst.refund(userId);
  ipBurst.refund(ip);
  userDaily.refund(userId);
  globalDaily.refund(GLOBAL_KEY);
}

/** Lỗi phía AI → mã HTTP + thông báo cho người học (không lộ chi tiết nội bộ). */
function aiErrorResponse(e: unknown) {
  if (e instanceof AiNotConfiguredError) {
    return e.reason === "missing"
      ? fail(503, "AI chưa được cấu hình trên server (thiếu ENGQUIZ_ANTHROPIC_API_KEY).")
      : fail(503, "Khóa API của AI bị từ chối (sai, đã thu hồi hoặc hết credit). Hãy báo người quản trị.");
  }
  if (e instanceof AiRefusedError) return fail(422, "AI không chấm được câu trả lời này. Hãy thử nói lại theo đề.");
  if (e instanceof AiBadOutputError) return fail(502, "AI trả kết quả không đọc được. Hãy thử nói ngắn gọn hơn rồi gửi lại.");
  if (e instanceof AiUnavailableError) return fail(503, "AI đang bận hoặc lỗi kết nối. Hãy thử lại sau ít phút.");
  return fail(500, "Có lỗi khi chấm bài. Hãy thử lại.");
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để dùng AI sửa lỗi.");

  let json: unknown;
  try {
    json = JSON.parse(await readBodyWithLimit(req, MAX_BODY_BYTES));
  } catch (e) {
    if (e instanceof BodyTooLargeError) return fail(413, "Câu trả lời quá dài.");
    return fail(400, "Dữ liệu không phải JSON hợp lệ.");
  }
  const parsed = feedbackRequestSchema.safeParse(json);
  if (!parsed.success) return fail(400, "Dữ liệu gửi lên không hợp lệ.");

  const { promptId, transcript, seconds, level } = parsed.data;
  const prompt = getSpeakingPrompt(promptId);
  if (!prompt) return fail(400, "Không tìm thấy đề nói.");
  if (transcript.split(/\s+/).filter(Boolean).length < FEEDBACK_LIMITS.minWords) {
    return fail(400, `Hãy nói dài hơn (ít nhất ${FEEDBACK_LIMITS.minWords} từ) để AI chấm được.`);
  }

  // Tính lượt sau khi dữ liệu hợp lệ: request hỏng không bị tính.
  const ip = clientIp(req);
  const quotaError = takeQuota(userId, ip);
  if (quotaError) return fail(429, quotaError);

  try {
    const feedback = await getSpeakingFeedback({ prompt, transcript, seconds, level });
    return NextResponse.json<ApiResponse<SpeakingFeedback>>({ success: true, data: feedback, error: null });
  } catch (e) {
    // Chỉ log loại lỗi và thông điệp do EngQuiz tạo (không chứa lời nói của người học).
    console.error(`[api/speaking/feedback] ${e instanceof Error ? `${e.name}: ${e.message}` : String(e)}`);
    if (!(e instanceof AiRefusedError)) refundQuota(userId, ip);
    return aiErrorResponse(e);
  }
}
