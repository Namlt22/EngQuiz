/**
 * Kiểu & schema của tính năng "Nói tự do + AI sửa lỗi" — dùng chung client và server.
 *
 *  - feedbackRequestSchema: dữ liệu client gửi lên (kiểm tra ở API, không tin client).
 *  - feedbackModelSchema: dạng JSON bắt Claude trả về (structured outputs). Structured outputs không hỗ trợ
 *    ràng buộc số (min/max) nên điểm được kẹp lại trong normalizeFeedback().
 *  - SpeakingFeedback: kết quả đã làm sạch trả về cho trình duyệt.
 */
import { z } from "zod";

export const FEEDBACK_LIMITS = {
  minWords: 3,
  maxTranscriptChars: 2000,
  maxCorrections: 10,
  maxListItems: 4,
  maxTextChars: 1200,
  maxSeconds: 600,
} as const;

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export const CORRECTION_TYPES = ["grammar", "vocabulary", "word_order", "missing_word", "pronunciation", "other"] as const;
export type CorrectionType = (typeof CORRECTION_TYPES)[number];

export const feedbackRequestSchema = z.strictObject({
  promptId: z.string().min(1).max(100),
  transcript: z.string().trim().min(1).max(FEEDBACK_LIMITS.maxTranscriptChars),
  /** Thời lượng nói (giây) — để AI biết người học nói được bao lâu. */
  seconds: z.number().int().min(0).max(FEEDBACK_LIMITS.maxSeconds),
  /** Trình độ trong hồ sơ lộ trình (nếu có) để AI sửa vừa sức. */
  level: z.enum(CEFR_LEVELS).optional(),
});
export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;

export const feedbackModelSchema = z.object({
  scores: z.object({
    grammar: z.number().describe("0-10: grammatical accuracy"),
    vocabulary: z.number().describe("0-10: range and correctness of vocabulary"),
    fluency: z.number().describe("0-10: length, flow and linking of ideas (judged from the transcript and duration)"),
    task: z.number().describe("0-10: how well the answer addresses the question"),
  }),
  estimatedLevel: z.enum(CEFR_LEVELS),
  corrections: z.array(
    z.object({
      original: z.string().describe("The learner's words exactly as in the transcript"),
      corrected: z.string().describe("Natural, correct English"),
      type: z.enum(CORRECTION_TYPES),
      explanationVi: z.string().describe("Short explanation in Vietnamese"),
    }),
  ),
  improvedAnswer: z.string().describe("The learner's answer rewritten naturally at about one CEFR level above theirs"),
  strengthsVi: z.array(z.string()).describe("What the learner did well, in Vietnamese"),
  tipsVi: z.array(z.string()).describe("Concrete next steps, in Vietnamese"),
  followUpQuestion: z.string().describe("A natural follow-up question in simple English"),
});
export type FeedbackModelOutput = z.infer<typeof feedbackModelSchema>;

export interface SpeakingFeedback {
  /** 0–100, trung bình 4 tiêu chí. */
  overall: number;
  scores: FeedbackModelOutput["scores"];
  estimatedLevel: CefrLevel;
  corrections: FeedbackModelOutput["corrections"];
  improvedAnswer: string;
  strengthsVi: string[];
  tipsVi: string[];
  followUpQuestion: string;
}

const clampScore = (n: number) => (Number.isFinite(n) ? Math.min(10, Math.max(0, Math.round(n * 2) / 2)) : 0);
const cut = (s: string) => s.trim().slice(0, FEEDBACK_LIMITS.maxTextChars);
const cutList = (list: string[]) => list.map(cut).filter(Boolean).slice(0, FEEDBACK_LIMITS.maxListItems);

/** Kẹp điểm về 0–10, cắt bớt danh sách/chuỗi quá dài, tính điểm tổng. */
export function normalizeFeedback(raw: FeedbackModelOutput): SpeakingFeedback {
  const scores = {
    grammar: clampScore(raw.scores.grammar),
    vocabulary: clampScore(raw.scores.vocabulary),
    fluency: clampScore(raw.scores.fluency),
    task: clampScore(raw.scores.task),
  };
  const overall = Math.round(((scores.grammar + scores.vocabulary + scores.fluency + scores.task) / 4) * 10);
  return {
    overall,
    scores,
    estimatedLevel: raw.estimatedLevel,
    corrections: raw.corrections
      .map((c) => ({ ...c, original: cut(c.original), corrected: cut(c.corrected), explanationVi: cut(c.explanationVi) }))
      .filter((c) => c.original && c.corrected && c.original !== c.corrected)
      .slice(0, FEEDBACK_LIMITS.maxCorrections),
    improvedAnswer: cut(raw.improvedAnswer),
    strengthsVi: cutList(raw.strengthsVi),
    tipsVi: cutList(raw.tipsVi),
    followUpQuestion: cut(raw.followUpQuestion),
  };
}

export const CORRECTION_LABELS: Record<CorrectionType, string> = {
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
  word_order: "Trật tự từ",
  missing_word: "Thiếu từ",
  pronunciation: "Phát âm (máy nghe nhầm)",
  other: "Khác",
};
