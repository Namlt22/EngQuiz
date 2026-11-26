/**
 * Game ngữ pháp (khoá tiếng Anh): biến câu hỏi có sẵn của một chủ điểm thành 4 chế độ chơi.
 *   choose     – trắc nghiệm (mcq)
 *   truefalse  – câu Đúng/Sai, TỰ SINH từ mcq, chia động từ và tìm lỗi sai (không cần soạn thêm)
 *   fix        – tìm lỗi sai (error_id)
 *   type       – tự gõ đáp án (verb_form, gap_fill)
 */
import type { Question } from "@/content/types";

export type GrammarMode = "choose" | "truefalse" | "fix" | "type";
export const GRAMMAR_MODES: GrammarMode[] = ["choose", "truefalse", "fix", "type"];
/** Ít hơn số câu này thì không mở chế độ đó. */
export const MIN_GAME_QUESTIONS = 3;

type TF = Extract<Question, { type: "true_false" }>;

const fill = (prompt: string, word: string) => prompt.replace("___", word);
/** Chỉ dùng câu có đúng một chỗ trống (câu nhiều chỗ trống có đáp án dạng "a / b"). */
const oneBlank = (prompt: string) => prompt.split("___").length === 2;

/** Mỗi câu nguồn cho ra một cặp (câu đúng, câu sai). */
function statementPair(q: Question): { right: string; wrong: string } | null {
  switch (q.type) {
    case "mcq": {
      if (!oneBlank(q.prompt)) return null;
      const wrongIdx = q.options.findIndex((_, i) => i !== q.answer);
      return { right: fill(q.prompt, q.options[q.answer]), wrong: fill(q.prompt, q.options[wrongIdx]) };
    }
    case "verb_form": {
      // Câu sai = giữ nguyên động từ gốc (lỗi kinh điển: "He watch TV"). Bỏ qua base không phải một từ tiếng Anh.
      const base = q.base.trim();
      if (!oneBlank(q.prompt) || !/^[a-z]+$/i.test(base) || q.answers.some((a) => a.toLowerCase() === base.toLowerCase())) return null;
      return { right: fill(q.prompt, q.answers[0]), wrong: fill(q.prompt, base) };
    }
    case "error_id": {
      const wrong = q.segments.map((s) => s.text).join("");
      const right = q.segments.map((s, i) => (i === q.answer ? s.text.replace(s.text.trim(), q.correction) : s.text)).join("");
      return { right, wrong };
    }
    default:
      return null;
  }
}

/** Sinh câu Đúng/Sai xen kẽ (câu chẵn đúng, câu lẻ sai) để hai đáp án cân bằng. */
export function deriveTrueFalse(questions: readonly Question[]): TF[] {
  const out: TF[] = [];
  for (const q of questions) {
    const pair = statementPair(q);
    if (!pair) continue;
    const isTrue = out.length % 2 === 0;
    out.push({
      id: `${q.id}-tf`,
      type: "true_false",
      statement: isTrue ? pair.right : pair.wrong,
      answer: isTrue,
      correction: isTrue ? undefined : pair.right,
      explanation: q.explanation,
    });
  }
  return out;
}

export function buildGrammarGame(mode: GrammarMode, questions: readonly Question[]): Question[] {
  switch (mode) {
    case "choose":
      return questions.filter((q) => q.type === "mcq");
    case "truefalse":
      return deriveTrueFalse(questions);
    case "fix":
      return questions.filter((q) => q.type === "error_id");
    case "type":
      return questions.filter((q) => q.type === "verb_form" || q.type === "gap_fill");
  }
}

/** Các chế độ chơi được (đủ câu) cho một chủ điểm. */
export function availableGrammarModes(questions: readonly Question[]): GrammarMode[] {
  return GRAMMAR_MODES.filter((m) => buildGrammarGame(m, questions).length >= MIN_GAME_QUESTIONS);
}
