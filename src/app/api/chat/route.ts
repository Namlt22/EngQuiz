/**
 * POST /api/chat — một lượt Trò chuyện cùng AI. Body: ChatRequest → ApiResponse<ChatReply>.
 *
 * Tính phí: mở cuộc (tin đầu tiên) lấy 1 lượt AI (src/server/billing.ts); các tin sau trong cùng cuộc không tốn thêm,
 * tối đa CHAT_LIMITS.maxLearnerTurns tin. Số tin đếm ở server (src/server/chat-sessions.ts).
 * Chống lạm dụng: bắt buộc đăng nhập, cùng nguồn, giới hạn kích thước body, giới hạn tần suất theo người dùng / IP / cả server.
 * Tin đầu tiên lỗi do phía AI thì trả lại lượt AI.
 */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getChatScenario } from "@/content/chat-scenarios";
import { CHAT_LIMITS, chatRequestSchema, FREE_CHAT_ID } from "@/lib/ai-chat";
import { aiErrorResponse, logAiError } from "@/server/ai-errors";
import { AiRefusedError } from "@/server/anthropic-client";
import { fail, ok, readJsonBody } from "@/server/api-response";
import { BillingError, refundAiTurn, takeAiTurn } from "@/server/billing";
import { getChatReply } from "@/server/chat-ai";
import { createChatSessions } from "@/server/chat-sessions";
import { createRateLimiter, refundAll, takeAll, type LimitStep } from "@/server/rate-limit";
import { clientIp, isSameOrigin } from "@/server/request";

export const dynamic = "force-dynamic";

/** 25 lượt × 400 ký tự + JSON ≈ 15 KB; để dư cho ký tự nhiều byte (tiếng Việt, chữ Hán). */
const MAX_BODY_BYTES = 48 * 1024;
const TEN_MINUTES = 10 * 60_000;
const ONE_DAY = 24 * 60 * 60_000;
const GLOBAL_KEY = "all";
const TAG = "api/chat";

const sessions = createChatSessions();
const userBurst = createRateLimiter({ limit: 40, windowMs: TEN_MINUTES });
const ipBurst = createRateLimiter({ limit: 80, windowMs: TEN_MINUTES });
const globalDaily = createRateLimiter({ limit: 6000, windowMs: ONE_DAY });

const limitSteps = (userId: string, ip: string): LimitStep[] => [
  { limiter: userBurst, key: userId, message: "Bạn gửi hơi nhanh, hãy nghỉ vài phút rồi thử lại." },
  { limiter: ipBurst, key: ip, message: "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút." },
  { limiter: globalDaily, key: GLOBAL_KEY, message: "Hôm nay hệ thống đã dùng hết lượt trò chuyện AI. Hãy thử lại vào ngày mai." },
];

const AI_MESSAGES = {
  refused: "AI không trả lời được tin này. Hãy nói theo cách khác.",
  badOutput: "AI trả kết quả không đọc được. Hãy gửi lại.",
  fallback: "Có lỗi khi trò chuyện với AI. Hãy thử lại.",
};

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để trò chuyện cùng AI.");

  const body = await readJsonBody(req, MAX_BODY_BYTES, { tooLarge: "Cuộc trò chuyện quá dài.", invalid: "Dữ liệu không phải JSON hợp lệ." });
  if (body instanceof Response) return body;
  const parsed = chatRequestSchema.safeParse(body.json);
  if (!parsed.success) return fail(400, "Dữ liệu gửi lên không hợp lệ.");
  const { course, scenarioId, conversationId, messages } = parsed.data;

  const scenario = scenarioId === FREE_CHAT_ID ? undefined : getChatScenario(scenarioId);
  if (scenarioId !== FREE_CHAT_ID && (!scenario || scenario.course !== course)) return fail(400, "Không tìm thấy tình huống.");
  // Nhập vai luôn dùng cấp của tình huống; trò chuyện tự do dùng cấp người học chọn.
  const level = scenario?.level ?? parsed.data.level;

  const existing = sessions.get(userId, conversationId);
  if (existing?.busy) return fail(409, "AI đang trả lời tin trước, hãy đợi một chút.");
  if (existing && existing.answered >= CHAT_LIMITS.maxLearnerTurns) {
    return fail(409, `Cuộc trò chuyện đã đủ ${CHAT_LIMITS.maxLearnerTurns} tin. Hãy bắt đầu cuộc mới.`);
  }

  const steps = limitSteps(userId, clientIp(req));
  const limited = takeAll(steps);
  if (limited) return fail(429, limited);

  // Tin đầu tiên của cuộc: mở cuộc (đồng bộ, đánh dấu bận) rồi mới lấy lượt AI.
  const chat = existing ?? sessions.open(userId, conversationId);
  chat.busy = true;
  if (!existing) {
    try {
      chat.turn = await takeAiTurn(userId);
    } catch (e) {
      sessions.close(userId, conversationId);
      refundAll(steps);
      if (e instanceof BillingError) return fail(e.status, e.message);
      console.error(`[${TAG}] lấy lượt AI lỗi:`, e);
      return fail(500, "Có lỗi khi kiểm tra gói AI. Hãy thử lại.");
    }
  }

  try {
    const turnsLeft = CHAT_LIMITS.maxLearnerTurns - (chat.answered + 1);
    const reply = await getChatReply({ course, level, scenario, messages, turnsLeft });
    chat.answered += 1;
    chat.lastUsed = Date.now();
    return ok(reply);
  } catch (e) {
    logAiError(TAG, e);
    if (!(e instanceof AiRefusedError)) {
      refundAll(steps);
      // Cuộc chưa có câu trả lời nào → trả lại lượt AI và bỏ cuộc, người học gửi lại sẽ mở cuộc mới.
      if (chat.answered === 0 && chat.turn) {
        sessions.close(userId, conversationId);
        await refundAiTurn(userId, chat.turn).catch((err) => console.error(`[${TAG}] trả lượt AI lỗi:`, err));
      }
    }
    return aiErrorResponse(e, AI_MESSAGES);
  } finally {
    chat.busy = false;
  }
}
