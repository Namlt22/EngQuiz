/**
 * POST /api/chat — một lượt Trò chuyện cùng AI. Body: ChatRequest → ApiResponse<ChatReply>.
 *
 * Tính phí: mở cuộc (tin đầu tiên) lấy 1 lượt AI (src/server/billing.ts); các tin sau trong cùng cuộc không tốn thêm,
 * tối đa CHAT_LIMITS.maxLearnerTurns tin. Số tin đếm ở server (src/server/chat-sessions.ts).
 * Chống lạm dụng: bắt buộc đăng nhập, cùng nguồn, giới hạn kích thước body, giới hạn tần suất theo người dùng / IP / cả server.
 * Tin đầu tiên lỗi do phía AI thì trả lại lượt AI.
 */
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getChatScenario } from "@/content/chat-scenarios";
import { CHAT_LIMITS, chatRequestSchema, FREE_CHAT_ID, type ChatReply } from "@/lib/ai-chat";
import type { ApiResponse } from "@/lib/learner-schema";
import { AiBadOutputError, AiNotConfiguredError, AiRefusedError, AiUnavailableError } from "@/server/anthropic-client";
import { BillingError, refundAiTurn, takeAiTurn } from "@/server/billing";
import { getChatReply } from "@/server/chat-ai";
import { createChatSessions } from "@/server/chat-sessions";
import { createRateLimiter } from "@/server/rate-limit";
import { BodyTooLargeError, clientIp, isSameOrigin, readBodyWithLimit } from "@/server/request";

export const dynamic = "force-dynamic";

/** 25 lượt × 400 ký tự + JSON ≈ 15 KB; để dư cho ký tự nhiều byte (tiếng Việt, chữ Hán). */
const MAX_BODY_BYTES = 48 * 1024;
const TEN_MINUTES = 10 * 60_000;
const ONE_DAY = 24 * 60 * 60_000;
const GLOBAL_KEY = "all";

const sessions = createChatSessions();
const userBurst = createRateLimiter({ limit: 40, windowMs: TEN_MINUTES });
const ipBurst = createRateLimiter({ limit: 80, windowMs: TEN_MINUTES });
const globalDaily = createRateLimiter({ limit: 6000, windowMs: ONE_DAY });

function fail(status: number, error: string) {
  return NextResponse.json<ApiResponse<never>>({ success: false, data: null, error }, { status });
}

/** Lấy một lượt ở mọi bộ đếm tần suất; bộ nào hết thì trả lại các lượt đã lấy và báo lý do. */
function takeRate(userId: string, ip: string): string | null {
  const steps: [ReturnType<typeof createRateLimiter>, string, string][] = [
    [userBurst, userId, "Bạn gửi hơi nhanh, hãy nghỉ vài phút rồi thử lại."],
    [ipBurst, ip, "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút."],
    [globalDaily, GLOBAL_KEY, "Hôm nay hệ thống đã dùng hết lượt trò chuyện AI. Hãy thử lại vào ngày mai."],
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

function refundRate(userId: string, ip: string) {
  userBurst.refund(userId);
  ipBurst.refund(ip);
  globalDaily.refund(GLOBAL_KEY);
}

/** Lỗi phía AI → mã HTTP + thông báo cho người học (không lộ chi tiết nội bộ). */
function aiErrorResponse(e: unknown) {
  if (e instanceof AiNotConfiguredError) {
    return e.reason === "missing"
      ? fail(503, "AI chưa được cấu hình trên server (thiếu ENGQUIZ_ANTHROPIC_API_KEY).")
      : fail(503, "Khóa API của AI bị từ chối (sai, đã thu hồi hoặc hết credit). Hãy báo người quản trị.");
  }
  if (e instanceof AiRefusedError) return fail(422, "AI không trả lời được tin này. Hãy nói theo cách khác.");
  if (e instanceof AiBadOutputError) return fail(502, "AI trả kết quả không đọc được. Hãy gửi lại.");
  if (e instanceof AiUnavailableError) return fail(503, "AI đang bận hoặc lỗi kết nối. Hãy thử lại sau ít phút.");
  return fail(500, "Có lỗi khi trò chuyện với AI. Hãy thử lại.");
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để trò chuyện cùng AI.");

  let json: unknown;
  try {
    json = JSON.parse(await readBodyWithLimit(req, MAX_BODY_BYTES));
  } catch (e) {
    if (e instanceof BodyTooLargeError) return fail(413, "Cuộc trò chuyện quá dài.");
    return fail(400, "Dữ liệu không phải JSON hợp lệ.");
  }
  const parsed = chatRequestSchema.safeParse(json);
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

  const ip = clientIp(req);
  const rateError = takeRate(userId, ip);
  if (rateError) return fail(429, rateError);

  // Tin đầu tiên của cuộc: mở cuộc (đồng bộ, đánh dấu bận) rồi mới lấy lượt AI.
  const chat = existing ?? sessions.open(userId, conversationId);
  chat.busy = true;
  if (!existing) {
    try {
      chat.turn = await takeAiTurn(userId);
    } catch (e) {
      sessions.close(userId, conversationId);
      refundRate(userId, ip);
      if (e instanceof BillingError) return fail(e.status, e.message);
      console.error("[api/chat] lấy lượt AI lỗi:", e);
      return fail(500, "Có lỗi khi kiểm tra gói AI. Hãy thử lại.");
    }
  }

  try {
    const turnsLeft = CHAT_LIMITS.maxLearnerTurns - (chat.answered + 1);
    const reply = await getChatReply({ course, level, scenario, messages, turnsLeft });
    chat.answered += 1;
    chat.lastUsed = Date.now();
    return NextResponse.json<ApiResponse<ChatReply>>({ success: true, data: reply, error: null });
  } catch (e) {
    // Chỉ log loại lỗi và thông điệp do EngQuiz tạo (không chứa lời của người học).
    console.error(`[api/chat] ${e instanceof Error ? `${e.name}: ${e.message}` : String(e)}`);
    if (!(e instanceof AiRefusedError)) {
      refundRate(userId, ip);
      // Cuộc chưa có câu trả lời nào → trả lại lượt AI và bỏ cuộc, người học gửi lại sẽ mở cuộc mới.
      if (chat.answered === 0 && chat.turn) {
        sessions.close(userId, conversationId);
        await refundAiTurn(userId, chat.turn).catch((err) => console.error("[api/chat] trả lượt AI lỗi:", err));
      }
    }
    return aiErrorResponse(e);
  } finally {
    chat.busy = false;
  }
}
