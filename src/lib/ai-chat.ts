/**
 * Trò chuyện cùng AI — kiểu dữ liệu, giới hạn và schema dùng chung cho trình duyệt và server.
 *  - Nhập vai theo tình huống (scenarioId) hoặc trò chuyện tự do (scenarioId = "free" + level).
 *  - Mỗi cuộc trò chuyện tính 1 lượt AI, tối đa CHAT_LIMITS.maxLearnerTurns tin nhắn của người học.
 *  - Trình duyệt giữ lịch sử và gửi kèm mỗi lượt; server chỉ đếm số tin trong cuộc (src/server/chat-sessions.ts).
 */
import { z } from "zod";
import type { CourseCode } from "./course";

export const CHAT_LIMITS = {
  /** Số tin nhắn tối đa của người học trong một cuộc (giới hạn chi phí cho 1 lượt AI). */
  maxLearnerTurns: 12,
  /** Độ dài tối đa một tin nhắn (ký tự). */
  maxMessageChars: 400,
} as const;

export const FREE_CHAT_ID = "free";

/** Cấp độ dùng để AI chọn từ ngữ: CEFR cho tiếng Anh, HSK cho tiếng Trung. */
export const CHAT_LEVELS: Record<CourseCode, readonly string[]> = {
  en: ["A1", "A2", "B1", "B2", "C1"],
  zh: ["HSK 1", "HSK 2", "HSK 3", "HSK 4"],
};

const messageSchema = z.object({
  role: z.enum(["learner", "ai"]),
  text: z.string().trim().min(1).max(CHAT_LIMITS.maxMessageChars),
});
export type ChatMessage = z.infer<typeof messageSchema>;

export const chatRequestSchema = z
  .object({
    course: z.enum(["en", "zh"]),
    scenarioId: z.string().min(1).max(60),
    level: z.string().min(1).max(10),
    /** Mã cuộc trò chuyện do trình duyệt tạo (crypto.randomUUID). */
    conversationId: z.string().uuid(),
    /** Toàn bộ lịch sử, tin cuối cùng là của người học. */
    messages: z.array(messageSchema).min(1).max(CHAT_LIMITS.maxLearnerTurns * 2 + 1),
  })
  .refine((r) => r.messages.at(-1)?.role === "learner", { message: "Tin cuối phải là của người học" })
  .refine((r) => CHAT_LEVELS[r.course].includes(r.level), { message: "Cấp độ không hợp lệ" })
  .refine((r) => r.messages.filter((m) => m.role === "learner").length <= CHAT_LIMITS.maxLearnerTurns, {
    message: "Quá số tin nhắn của một cuộc",
  });
export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** Dạng JSON model phải trả (structured output). */
export const chatModelSchema = z.object({
  reply: z.string().describe("Your next line in the conversation, in the target language, 1–3 short sentences."),
  replyPinyin: z.string().describe("Pinyin with tone marks for `reply` when the target language is Chinese; empty string for English."),
  replyVi: z.string().describe("Natural Vietnamese translation of `reply`."),
  hasMistake: z.boolean().describe("true if the learner's LAST message has a real grammar / word-choice error worth correcting."),
  corrected: z.string().describe("The learner's last message rewritten correctly and naturally; empty string when hasMistake is false."),
  explanationVi: z.string().describe("Short explanation of the correction in Vietnamese (1–2 sentences); empty string when hasMistake is false."),
  ended: z.boolean().describe("true only when the role-play goal is reached and you have said goodbye."),
});
export type ChatModelOutput = z.infer<typeof chatModelSchema>;

export interface ChatCorrection {
  corrected: string;
  explanationVi: string;
}

export interface ChatReply {
  reply: string;
  /** Chỉ có với tiếng Trung. */
  replyPinyin?: string;
  replyVi: string;
  /** Sửa lỗi cho tin nhắn vừa gửi của người học (nếu có). */
  correction: ChatCorrection | null;
  ended: boolean;
  /** Số tin người học còn được gửi trong cuộc này. */
  turnsLeft: number;
}

/** Chuẩn hoá kết quả model: bỏ sửa lỗi rỗng / trùng câu gốc, bỏ pinyin với tiếng Anh. */
export function normalizeChatOutput(out: ChatModelOutput, course: CourseCode, learnerText: string, turnsLeft: number): ChatReply {
  const corrected = out.corrected.trim();
  const same = corrected.replace(/[\s.,!?。，！？]/g, "").toLowerCase() === learnerText.replace(/[\s.,!?。，！？]/g, "").toLowerCase();
  const correction = out.hasMistake && corrected && !same ? { corrected, explanationVi: out.explanationVi.trim() } : null;
  return {
    reply: out.reply.trim(),
    ...(course === "zh" && out.replyPinyin.trim() ? { replyPinyin: out.replyPinyin.trim() } : {}),
    replyVi: out.replyVi.trim(),
    correction,
    ended: out.ended,
    turnsLeft,
  };
}
