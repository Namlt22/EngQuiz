/**
 * Chấm bài luyện đặt câu — hàm thuần.
 *  - Tiếng Anh: so theo từ, không phân biệt hoa thường, bỏ dấu câu; dạng rút gọn = dạng đầy đủ (doesn't = does not).
 *  - Tiếng Trung: so theo chữ, bỏ khoảng trắng và dấu câu (cả dấu toàn khổ).
 * Sai thì tìm đáp án gần nhất (nhiều phần chung nhất) và chỉ ra phần thiếu / thừa để người học tự sửa.
 */
import type { CourseCode } from "@/lib/course";

export interface SentenceCheck {
  correct: boolean;
  /** Đáp án gần câu người học nhất (để hiện khi sai). */
  closest: string;
  /** Từ (EN) / chữ (ZH) có trong đáp án mà người học thiếu. */
  missing: string[];
  /** Từ / chữ người học viết thừa. */
  extra: string[];
}

/** Dạng rút gọn → dạng đầy đủ (đủ cho các câu ở cấp A1–B2). */
const CONTRACTIONS: [RegExp, string][] = [
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "can not"],
  [/\bcannot\b/g, "can not"],
  [/\bshan't\b/g, "shall not"],
  [/n't\b/g, " not"],
  [/'re\b/g, " are"],
  [/'ve\b/g, " have"],
  [/'ll\b/g, " will"],
  [/'d\b/g, " would"],
  [/\bi'm\b/g, "i am"],
  [/\b(it|he|she|that|what|where|who|how|there|here)'s\b/g, "$1 is"],
];

function tokensEn(s: string): string[] {
  let t = s.toLowerCase().replace(/[’`]/g, "'");
  for (const [re, full] of CONTRACTIONS) t = t.replace(re, full);
  return t
    .replace(/[^a-z0-9' ]+/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean);
}

function tokensZh(s: string): string[] {
  return [...s.replace(/[\s\p{P}\p{S}]/gu, "")];
}

/** Độ dài dãy con chung dài nhất và các phần tử của a nằm trong dãy chung đó. */
function lcs<T>(a: readonly T[], b: readonly T[]): { length: number; inA: Set<number>; inB: Set<number> } {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const inA = new Set<number>();
  const inB = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      inA.add(i++);
      inB.add(j++);
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return { length: dp[0][0], inA, inB };
}

export function checkSentence(course: CourseCode, input: string, answers: readonly string[]): SentenceCheck {
  const tok = course === "zh" ? tokensZh : tokensEn;
  const typed = tok(input);
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, k) => x === b[k]);
  if (typed.length && answers.some((ans) => same(tok(ans), typed))) {
    return { correct: true, closest: answers.find((ans) => same(tok(ans), typed)) ?? answers[0], missing: [], extra: [] };
  }
  let best = { answer: answers[0] ?? "", score: -Infinity, missing: [] as string[], extra: [] as string[] };
  for (const ans of answers) {
    const want = tok(ans);
    const m = lcs(want, typed);
    // Điểm: phần chung trừ phần lệch, để ưu tiên đáp án cùng độ dài.
    const score = m.length * 2 - want.length - typed.length;
    if (score > best.score) {
      best = { answer: ans, score, missing: want.filter((_, k) => !m.inA.has(k)), extra: typed.filter((_, k) => !m.inB.has(k)) };
    }
  }
  return { correct: false, closest: best.answer, missing: best.missing, extra: best.extra };
}
