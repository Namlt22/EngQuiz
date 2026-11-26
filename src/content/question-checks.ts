/**
 * Kiểm tra một câu hỏi có hợp lệ không — chỉ dùng trong test (content.test.ts, lessons.test.ts),
 * để chủ điểm ngữ pháp, bài đọc và hội thoại cùng theo một bộ luật.
 */
import { expect } from "vitest";
import { gradeQuestion } from "@/core/grading";
import type { Question } from "./types";

/** Hình thức: một chỗ trống, phương án không trùng, đủ đoạn gạch chân. */
export function expectWellFormed(q: Question) {
  if (q.type === "verb_form" || q.type === "gap_fill") expect(q.prompt.split("___").length - 1, q.id).toBe(1);
  if (q.type === "mcq") expect(new Set(q.options).size, q.id).toBe(q.options.length);
  if (q.type === "error_id") expect(q.segments.filter((s) => s.underline).length, q.id).toBeGreaterThanOrEqual(2);
}

/** Đáp án trỏ đúng chỗ và tự chấm đúng chính nó. */
export function expectSelfGrading(q: Question) {
  switch (q.type) {
    case "mcq":
      expect(q.answer, q.id).toBeLessThan(q.options.length);
      expect(gradeQuestion(q, { type: "mcq", choice: q.answer })).toBe(true);
      break;
    case "error_id":
      expect(q.segments[q.answer]?.underline, q.id).toBe(true);
      break;
    case "word_order": {
      // Các từ trong đáp án phải đúng bằng các từ đã cho.
      const used = q.answers[0].replace(/[?.!]$/, " $&").split(/\s+/).filter(Boolean);
      const given = q.words.join(" ").toLowerCase().split(/\s+/).sort();
      expect(used.map((w) => w.toLowerCase()).sort(), q.id).toEqual(given);
      break;
    }
    case "matching":
      expect([...q.pairs].sort(), q.id).toEqual(q.right.map((_, i) => i));
      expect(q.pairs.length).toBe(q.left.length);
      break;
    case "true_false":
      expect(q.statement.length, q.id).toBeGreaterThan(3);
      if (!q.answer) expect(q.correction, `${q.id}: câu sai cần có câu sửa`).toBeTruthy();
      break;
    default:
      expect(q.answers.length, q.id).toBeGreaterThan(0);
      for (const a of q.answers) expect(gradeQuestion(q, { type: q.type, text: a } as never), `${q.id}: ${a}`).toBe(true);
  }
}
