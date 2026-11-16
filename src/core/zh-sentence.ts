/**
 * Câu tiếng Trung trong nội dung bài học — hàm thuần.
 *
 * Câu được soạn ở dạng TÁCH TỪ, các từ cách nhau bằng dấu cách: "我 是 学生 。".
 *  - Từ thường phải có trong danh mục HSK → pinyin lấy từ danh mục (không gõ tay, tránh sai).
 *  - Tên riêng / từ ngoài danh mục ghi kèm pinyin: "王|Wáng", "越南|Yuènán".
 *  - Số viết bằng chữ Hán (二十五) được ghép pinyin theo từng chữ số.
 *  - Dấu câu toàn khổ là một token riêng.
 * Nhờ vậy test kiểm tra được mọi câu chỉ dùng từ trong phạm vi cấp đang học.
 */
import { getHskWord } from "@/content/zh/vocab";

export interface ZhToken {
  text: string;
  /** Pinyin viết liền trong một từ (xuéshēng); rỗng với dấu câu */
  pinyin: string;
  kind: "word" | "name" | "number" | "punct";
  /** Cấp HSK của từ (chỉ với kind = word) */
  level?: number;
}

const PUNCT = /^[。，？！、：；“”…—（）]$/u; // — dùng ngăn hai lượt lời trong câu hỏi đáp
const NUMBER = /^[零一二三四五六七八九十百千两]+$/u;
const NUMBER_PINYIN: Record<string, string> = {
  零: "líng", 一: "yī", 二: "èr", 三: "sān", 四: "sì", 五: "wǔ", 六: "liù", 七: "qī", 八: "bā", 九: "jiǔ", 十: "shí", 百: "bǎi", 千: "qiān", 两: "liǎng",
};

/** Pinyin trong một từ viết liền, theo quy tắc chính tả: thêm ' trước âm tiết bắt đầu bằng a/o/e (Xī'ān). */
export function joinSyllables(pinyin: string): string {
  return pinyin
    .split(" ")
    .map((s, i) => (i > 0 && /^[aoeāáǎàōóǒòēéěè]/i.test(s) ? `'${s}` : s))
    .join("");
}

export function parseToken(raw: string): ZhToken {
  const [text, override] = raw.split("|");
  if (override !== undefined) return { text, pinyin: override, kind: "name" };
  if (PUNCT.test(text)) return { text, pinyin: "", kind: "punct" };
  const w = getHskWord(text);
  if (w) return { text, pinyin: joinSyllables(w.pinyin), kind: "word", level: w.level };
  if (NUMBER.test(text)) return { text, pinyin: [...text].map((c) => NUMBER_PINYIN[c]).join(""), kind: "number" };
  // Không nhận ra: vẫn hiển thị, test nội dung sẽ báo lỗi.
  return { text, pinyin: "?", kind: "word" };
}

export const tokenize = (sentence: string): ZhToken[] => sentence.trim().split(/\s+/).filter(Boolean).map(parseToken);

/** Câu hiển thị (bỏ dấu cách giữa các từ). */
export const plainText = (sentence: string) => tokenize(sentence).map((t) => t.text).join("");

/** Pinyin cả câu: từ cách nhau bằng dấu cách, dấu câu dính liền từ trước. */
export function sentencePinyin(sentence: string): string {
  let out = "";
  for (const t of tokenize(sentence)) {
    if (t.kind === "punct") out += t.text === "，" ? "," : t.text === "？" ? "?" : t.text === "！" ? "!" : t.text === "。" ? "." : "";
    else out += (out ? " " : "") + t.pinyin;
  }
  return out;
}

/** Các token vượt cấp hoặc không nhận ra được (để test nội dung). */
export function outOfLevel(sentence: string, maxLevel: number): string[] {
  return tokenize(sentence)
    .filter((t) => (t.kind === "word" && (t.pinyin === "?" || (t.level ?? 99) > maxLevel)))
    .map((t) => t.text);
}

/** So câu người học sắp xếp với các đáp án (bỏ qua dấu câu). */
export function sameOrder(answer: readonly string[], expected: string): boolean {
  const norm = (arr: readonly string[]) => arr.filter((t) => !PUNCT.test(t)).join(" ");
  return norm(answer) === norm(expected.trim().split(/\s+/).map((t) => t.split("|")[0]));
}
