import { describe, expect, it } from "vitest";
import { SPEAKING_PROMPTS, getSpeakingPrompt, promptIdByText } from "@/content/speaking-prompts";
import { FEEDBACK_LIMITS, feedbackRequestSchema, normalizeFeedback, type FeedbackModelOutput } from "./speaking-feedback";

const raw: FeedbackModelOutput = {
  scores: { grammar: 7.3, vocabulary: 12, fluency: -1, task: 8 },
  estimatedLevel: "A2",
  corrections: [
    { original: "I am a engineer", corrected: "I am an engineer", type: "grammar", explanationVi: "Dùng an trước nguyên âm." },
    { original: "same", corrected: "same", type: "other", explanationVi: "không đổi" },
    { original: "", corrected: "x", type: "other", explanationVi: "rỗng" },
  ],
  improvedAnswer: "  My name is Nam and I'm an engineer.  ",
  strengthsVi: ["a", "b", "c", "d", "e", ""],
  tipsVi: ["Nói thêm lý do."],
  followUpQuestion: "What do you like about your job?",
};

describe("normalizeFeedback", () => {
  it("kẹp điểm 0–10 (bước 0,5), tính điểm tổng 0–100", () => {
    const f = normalizeFeedback(raw);
    expect(f.scores).toEqual({ grammar: 7.5, vocabulary: 10, fluency: 0, task: 8 });
    expect(f.overall).toBe(64);
  });

  it("bỏ sửa lỗi rỗng hoặc không đổi, cắt danh sách và khoảng trắng", () => {
    const f = normalizeFeedback(raw);
    expect(f.corrections.map((c) => c.corrected)).toEqual(["I am an engineer"]);
    expect(f.strengthsVi).toHaveLength(FEEDBACK_LIMITS.maxListItems);
    expect(f.improvedAnswer).toBe("My name is Nam and I'm an engineer.");
  });

  it("chuỗi quá dài bị cắt", () => {
    const f = normalizeFeedback({ ...raw, improvedAnswer: "x".repeat(5000) });
    expect(f.improvedAnswer).toHaveLength(FEEDBACK_LIMITS.maxTextChars);
  });
});

describe("feedbackRequestSchema", () => {
  it("chặn trường lạ, trình độ sai, transcript quá dài", () => {
    const ok = { promptId: "intro-daily-1", transcript: "hi there friend", seconds: 5 };
    expect(feedbackRequestSchema.safeParse(ok).success).toBe(true);
    expect(feedbackRequestSchema.safeParse({ ...ok, level: "Z9" }).success).toBe(false);
    expect(feedbackRequestSchema.safeParse({ ...ok, model: "x" }).success).toBe(false);
    expect(feedbackRequestSchema.safeParse({ ...ok, transcript: "a".repeat(FEEDBACK_LIMITS.maxTranscriptChars + 1) }).success).toBe(false);
  });
});

describe("SPEAKING_PROMPTS", () => {
  it("id không trùng, tra được theo id và theo câu chữ", () => {
    const ids = SPEAKING_PROMPTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(SPEAKING_PROMPTS.length).toBeGreaterThan(30);
    expect(getSpeakingPrompt("intro-daily-1")?.text).toBe("Tell me about yourself.");
    expect(promptIdByText("Introduce yourself at a new job.", "work")).toBe("intro-work-1");
    expect(getSpeakingPrompt("nope")).toBeUndefined();
  });
});
