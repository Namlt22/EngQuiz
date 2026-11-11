/**
 * Chấm câu hỏi Quiz. Logic thuần, không phụ thuộc UI.
 */
import type { Question } from "@/content/types";
import { isEquivalent } from "./normalize";

export type QuizResponse =
  | { type: "mcq"; choice: number }
  | { type: "verb_form" | "gap_fill" | "transform"; text: string }
  | { type: "error_id"; choice: number }
  | { type: "word_order"; order: string[] }
  | { type: "matching"; pairs: number[] };

function matchesAny(text: string, answers: string[]): boolean {
  return answers.some((a) => isEquivalent(text, a));
}

export function gradeQuestion(q: Question, r: QuizResponse): boolean {
  switch (q.type) {
    case "mcq":
      return r.type === "mcq" && r.choice === q.answer;
    case "error_id":
      return r.type === "error_id" && r.choice === q.answer;
    case "verb_form":
    case "gap_fill":
    case "transform":
      return "text" in r && matchesAny(r.text, q.answers);
    case "word_order":
      return r.type === "word_order" && matchesAny(r.order.join(" "), q.answers);
    case "matching":
      return (
        r.type === "matching" &&
        r.pairs.length === q.pairs.length &&
        r.pairs.every((p, i) => p === q.pairs[i])
      );
  }
}

/** Đáp án đúng ở dạng chữ, dùng để hiển thị khi người học làm sai. */
export function correctAnswerText(q: Question): string {
  switch (q.type) {
    case "mcq":
      return q.options[q.answer];
    case "error_id":
      return `${q.segments[q.answer].text.trim()} → ${q.correction}`;
    case "verb_form":
    case "gap_fill":
    case "transform":
    case "word_order":
      return q.answers[0];
    case "matching":
      return q.left.map((l, i) => `${l} — ${q.right[q.pairs[i]]}`).join(" · ");
  }
}

/** Câu trả lời đã đủ để bấm "Kiểm tra" chưa. */
export function isResponseComplete(q: Question, r: QuizResponse | null): boolean {
  if (!r) return false;
  switch (r.type) {
    case "mcq":
    case "error_id":
      return r.choice >= 0;
    case "verb_form":
    case "gap_fill":
    case "transform":
      return r.text.trim().length > 0;
    case "word_order":
      return q.type === "word_order" && r.order.length === q.words.length;
    case "matching":
      return r.pairs.every((p) => p >= 0);
  }
}
