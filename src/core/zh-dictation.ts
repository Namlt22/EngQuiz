/**
 * Chấm nghe chép tiếng Trung — hàm thuần.
 *  - Chế độ chữ Hán: so từng chữ (bỏ dấu câu, khoảng trắng).
 *  - Chế độ pinyin: so từng âm tiết; đúng âm + đúng thanh = 1 điểm, đúng âm sai/thiếu thanh = 0,5.
 *    Nhận cả kiểu số (ni3 hao3) và kiểu dấu (nǐ hǎo); v hoặc u: = ü. Âm tiết cách nhau bằng dấu cách hoặc số thanh.
 * Hai chuỗi được dóng hàng theo dãy con chung dài nhất (LCS) để thiếu/thừa một chữ không làm lệch cả câu.
 */
import { bareSyllable, toneOf, type Tone } from "./pinyin";
import { charSyllables } from "./zh-sentence";

export type DictationMode = "hanzi" | "pinyin";

export interface CharMark {
  char: string;
  syllable: string;
  /** 1 = đúng, 0.5 = đúng âm sai thanh, 0 = sai / thiếu */
  score: number;
}

export interface DictationResult {
  marks: CharMark[];
  percent: number;
}

/** Vị trí khớp theo LCS: trả về map chỉ số đích → chỉ số nguồn. */
function lcsMatch<T>(target: readonly T[], input: readonly T[], eq: (a: T, b: T) => boolean): Map<number, number> {
  const n = target.length;
  const m = input.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = eq(target[i], input[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = new Map<number, number>();
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (eq(target[i], input[j])) {
      out.set(i, j);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return out;
}

const percentOf = (marks: CharMark[]) => (marks.length ? Math.round((marks.reduce((s, m) => s + m.score, 0) / marks.length) * 100) : 0);

export function gradeHanzi(sentence: string, input: string): DictationResult {
  const target = charSyllables(sentence);
  const typed = [...input].filter((c) => /\p{Script=Han}/u.test(c));
  const match = lcsMatch(
    target.map((t) => t.char),
    typed,
    (a, b) => a === b,
  );
  const marks = target.map((t, i) => ({ ...t, score: match.has(i) ? 1 : 0 }));
  return { marks, percent: percentOf(marks) };
}

interface TypedSyllable {
  bare: string;
  /** null = người học không ghi thanh */
  tone: Tone | null;
}

const MARKED = "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ";

export function parsePinyinInput(input: string): TypedSyllable[] {
  const text = input.toLowerCase().replace(/u:/g, "ü").replace(/v/g, "ü");
  const re = new RegExp(`[a-zü${MARKED}]+[0-5]?`, "g");
  return (text.match(re) ?? []).map((tok) => {
    const digit = /[0-5]$/.exec(tok)?.[0];
    const body = digit ? tok.slice(0, -1) : tok;
    const marked = [...body].some((c) => MARKED.includes(c));
    const tone: Tone | null = digit ? ((digit === "0" ? 5 : Number(digit)) as Tone) : marked ? toneOf(body) : null;
    return { bare: bareSyllable(body), tone };
  });
}

export function gradePinyin(sentence: string, input: string): DictationResult {
  const target = charSyllables(sentence);
  const typed = parsePinyinInput(input);
  const targetBare = target.map((t) => bareSyllable(t.syllable));
  const match = lcsMatch(
    targetBare,
    typed.map((t) => t.bare),
    (a, b) => a === b,
  );
  const marks = target.map((t, i) => {
    const j = match.get(i);
    if (j === undefined) return { ...t, score: 0 };
    const want = toneOf(t.syllable);
    // Thanh nhẹ: không ghi thanh cũng tính đúng.
    const got = typed[j].tone ?? 5;
    return { ...t, score: got === want ? 1 : 0.5 };
  });
  return { marks, percent: percentOf(marks) };
}

export const gradeDictation = (mode: DictationMode, sentence: string, input: string) => (mode === "hanzi" ? gradeHanzi(sentence, input) : gradePinyin(sentence, input));
