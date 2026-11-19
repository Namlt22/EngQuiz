/**
 * Bài kiểm tra bộ thủ (trang /zh/hanzi) — hàm thuần.
 * Mỗi câu: cho một bộ thủ, chọn nghĩa đúng trong 4 lựa chọn (3 nghĩa nhiễu lấy từ các bộ khác).
 */
import type { Radical } from "@/content/zh/hanzi-basics";

export const RADICAL_QUIZ_ROUNDS = 8;
export const RADICAL_PASS_PERCENT = 75;
const OPTION_COUNT = 4;

export interface RadicalRound {
  radical: Radical;
  options: string[];
  answer: number;
}

type Rng = () => number;

function shuffle<T>(arr: readonly T[], rng: Rng): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildRadicalQuiz(radicals: readonly Radical[], rng: Rng = Math.random, rounds = RADICAL_QUIZ_ROUNDS): RadicalRound[] {
  return shuffle(radicals, rng)
    .slice(0, rounds)
    .map((radical) => {
      // Nghĩa nhiễu lấy từ bộ KHÁC nhóm nghĩa: 辶 (đi) không được có "chạy, đi" của 走 làm đáp án nhiễu.
      const pool = radicals.filter((r) => r.meaning !== radical.meaning && (!radical.family || r.family !== radical.family));
      const distractors = shuffle([...new Set(pool.map((r) => r.meaning))], rng).slice(0, OPTION_COUNT - 1);
      const options = shuffle([radical.meaning, ...distractors], rng);
      return { radical, options, answer: options.indexOf(radical.meaning) };
    });
}
