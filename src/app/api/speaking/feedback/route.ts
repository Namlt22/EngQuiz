/**
 * POST /api/speaking/feedback — AI chấm và sửa câu trả lời nói tự do.
 * Body: { promptId, transcript, seconds, level? } → ApiResponse<SpeakingFeedback>
 *
 * Mỗi lượt gọi Claude tốn phí, nên: bắt buộc đăng nhập, cần gói AI (hoặc còn lượt dùng thử — src/server/billing.ts,
 * lượt/ngày lưu trong database), chỉ nhận đề có sẵn, giới hạn tần suất theo người dùng,
 * theo IP (chặn một người tạo nhiều tài khoản) và tổng cả server mỗi ngày. Lượt lỗi do phía AI được trả lại.
 * Bộ đếm nằm trong bộ nhớ tiến trình (reset khi khởi động lại) — nên đặt thêm hạn mức chi tiêu cho khóa API ở Anthropic Console.
 */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getSpeakingPrompt } from "@/content/speaking-prompts";
import { FEEDBACK_LIMITS, feedbackRequestSchema } from "@/lib/speaking-feedback";
import { aiErrorResponse, logAiError } from "@/server/ai-errors";
import { fail, ok, readJsonBody } from "@/server/api-response";
import { BillingError, refundAiTurn, takeAiTurn, type AiTurn } from "@/server/billing";
import { createRateLimiter, refundAll, takeAll, type LimitStep } from "@/server/rate-limit";
import { clientIp, isSameOrigin } from "@/server/request";
import { AiRefusedError, getSpeakingFeedback } from "@/server/speaking-ai";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const TEN_MINUTES = 10 * 60_000;
const ONE_DAY = 24 * 60 * 60_000;
const GLOBAL_KEY = "all";
const TAG = "api/speaking/feedback";

const userBurst = createRateLimiter({ limit: 10, windowMs: TEN_MINUTES });
const ipBurst = createRateLimiter({ limit: 20, windowMs: TEN_MINUTES });
const globalDaily = createRateLimiter({ limit: 500, windowMs: ONE_DAY });

const limitSteps = (userId: string, ip: string): LimitStep[] => [
  { limiter: userBurst, key: userId, message: "Bạn gửi hơi nhiều, hãy nghỉ vài phút rồi thử lại." },
  { limiter: ipBurst, key: ip, message: "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút." },
  { limiter: globalDaily, key: GLOBAL_KEY, message: "Hôm nay hệ thống đã dùng hết lượt AI chấm. Hãy thử lại vào ngày mai." },
];

const AI_MESSAGES = {
  refused: "AI không chấm được câu trả lời này. Hãy thử nói lại theo đề.",
  badOutput: "AI trả kết quả không đọc được. Hãy thử nói ngắn gọn hơn rồi gửi lại.",
  fallback: "Có lỗi khi chấm bài. Hãy thử lại.",
};

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để dùng AI sửa lỗi.");

  const body = await readJsonBody(req, MAX_BODY_BYTES, { tooLarge: "Câu trả lời quá dài.", invalid: "Dữ liệu không phải JSON hợp lệ." });
  if (body instanceof Response) return body;
  const parsed = feedbackRequestSchema.safeParse(body.json);
  if (!parsed.success) return fail(400, "Dữ liệu gửi lên không hợp lệ.");

  const { promptId, transcript, seconds, level } = parsed.data;
  const prompt = getSpeakingPrompt(promptId);
  if (!prompt) return fail(400, "Không tìm thấy đề nói.");
  if (transcript.split(/\s+/).filter(Boolean).length < FEEDBACK_LIMITS.minWords) {
    return fail(400, `Hãy nói dài hơn (ít nhất ${FEEDBACK_LIMITS.minWords} từ) để AI chấm được.`);
  }

  // Tính lượt sau khi dữ liệu hợp lệ: request hỏng không bị tính.
  const steps = limitSteps(userId, clientIp(req));
  const limited = takeAll(steps);
  if (limited) return fail(429, limited);

  let turn: AiTurn;
  try {
    turn = await takeAiTurn(userId);
  } catch (e) {
    refundAll(steps);
    if (e instanceof BillingError) return fail(e.status, e.message);
    console.error(`[${TAG}] lấy lượt AI lỗi:`, e);
    return fail(500, "Có lỗi khi kiểm tra gói AI. Hãy thử lại.");
  }

  try {
    return ok(await getSpeakingFeedback({ prompt, transcript, seconds, level }));
  } catch (e) {
    logAiError(TAG, e);
    if (!(e instanceof AiRefusedError)) {
      refundAll(steps);
      await refundAiTurn(userId, turn).catch((err) => console.error(`[${TAG}] trả lượt AI lỗi:`, err));
    }
    return aiErrorResponse(e, AI_MESSAGES);
  }
}
