import { describe, expect, it } from "vitest";
import { COMMON_RADICALS } from "@/content/zh/hanzi-basics";
import { RADICAL_QUIZ_ROUNDS, buildRadicalQuiz } from "./hanzi-quiz";

function seeded(seed = 3) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe("bài kiểm tra bộ thủ", () => {
  it("đủ số câu, không lặp bộ", () => {
    const quiz = buildRadicalQuiz(COMMON_RADICALS, seeded());
    expect(quiz).toHaveLength(RADICAL_QUIZ_ROUNDS);
    expect(new Set(quiz.map((r) => r.radical.form)).size).toBe(RADICAL_QUIZ_ROUNDS);
  });

  it("4 lựa chọn khác nhau, đúng một đáp án là nghĩa của bộ", () => {
    for (let seed = 1; seed < 30; seed++) {
      for (const r of buildRadicalQuiz(COMMON_RADICALS, seeded(seed))) {
        expect(new Set(r.options).size).toBe(4);
        expect(r.options[r.answer]).toBe(r.radical.meaning);
        expect(r.options.filter((o) => o === r.radical.meaning)).toHaveLength(1);
        // Không có nghĩa nhiễu nào thuộc cùng nhóm nghĩa với bộ đang hỏi.
        if (r.radical.family) {
          const sameFamily = COMMON_RADICALS.filter((x) => x.family === r.radical.family && x.meaning !== r.radical.meaning).map((x) => x.meaning);
          for (const o of r.options) expect(sameFamily).not.toContain(o);
        }
      }
    }
  });
});
