/**
 * Chấm kiểu ôn "Gõ pinyin" của thẻ từ vựng HSK — hàm thuần.
 * Dựa trên gradePinyin của nghe chép (nhận dấu thanh hoặc số, ü = v), thêm điều kiện chặt cho một từ:
 * mọi âm tiết đúng cả thanh VÀ không gõ thừa âm tiết.
 */
import { gradePinyin, parsePinyinInput, type CharMark } from "./zh-dictation";

export interface WordPinyinResult {
  marks: CharMark[];
  correct: boolean;
}

export function gradeWordPinyin(hanzi: string, input: string): WordPinyinResult {
  const { marks, percent } = gradePinyin(hanzi, input);
  const typedCount = parsePinyinInput(input).length;
  return { marks, correct: percent === 100 && typedCount === marks.length };
}
