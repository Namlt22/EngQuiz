import { describe, expect, it } from "vitest";
import { checkSentence } from "@/core/sentence-practice";
import { CHAT_LEVELS } from "@/lib/ai-chat";
import { SENTENCE_SETS, sentenceSetsFor } from "./sentence-practice";

describe("bài luyện đặt câu", () => {
  it("id bộ và id câu không trùng; mỗi bộ 8 câu; cấp hợp lệ", () => {
    const setIds = SENTENCE_SETS.map((s) => s.id);
    expect(new Set(setIds).size).toBe(setIds.length);
    const taskIds = SENTENCE_SETS.flatMap((s) => s.tasks.map((t) => t.id));
    expect(new Set(taskIds).size).toBe(taskIds.length);
    for (const s of SENTENCE_SETS) {
      expect(s.tasks, s.id).toHaveLength(8);
      expect(CHAT_LEVELS[s.course], s.id).toContain(s.level);
    }
    expect(sentenceSetsFor("en").length).toBeGreaterThanOrEqual(6);
    expect(sentenceSetsFor("zh").length).toBeGreaterThanOrEqual(4);
  });

  it("mọi đáp án tự chấm đúng; đáp án câu hỏi kết thúc bằng dấu hỏi", () => {
    for (const s of SENTENCE_SETS) {
      for (const t of s.tasks) {
        expect(t.answers.length, t.id).toBeGreaterThan(0);
        for (const a of t.answers) {
          expect(checkSentence(s.course, a, t.answers).correct, `${t.id}: ${a}`).toBe(true);
          if (t.kind === "question") expect(a, t.id).toMatch(/[?？]$/);
        }
      }
    }
  });

  it("câu sai rõ ràng bị chấm sai", () => {
    const yn = SENTENCE_SETS.find((s) => s.id === "en-yes-no")!.tasks[0];
    expect(checkSentence("en", "She is a teacher?", yn.answers).correct).toBe(false);
    const ma = SENTENCE_SETS.find((s) => s.id === "zh-ma")!.tasks[0];
    expect(checkSentence("zh", "他是老师。", ma.answers).correct).toBe(false);
  });
});
