/**
 * Danh mục từ HSK 1–4 theo đề cương thi HSK mới (11/2025).
 * Dữ liệu gốc và giấy phép (CC BY-SA 4.0): src/content/zh/data/README.md.
 */
import raw from "./data/hsk-vocab.json";
import type { HskLevel } from "./hsk-levels";

export interface HskWord {
  /** Chữ giản thể */
  hanzi: string;
  /** Pinyin có dấu thanh, các âm tiết cách nhau bằng dấu cách (chưa áp dụng biến điệu) */
  pinyin: string;
  /** Cấp đưa từ này vào lần đầu */
  level: HskLevel;
}

type Row = [hanzi: string, pinyin: string, level: number];

export const HSK_WORDS: HskWord[] = (raw as Row[]).map(([hanzi, pinyin, level]) => ({ hanzi, pinyin, level: level as HskLevel }));

const BY_HANZI = new Map(HSK_WORDS.map((w) => [w.hanzi, w]));

export const getHskWord = (hanzi: string) => BY_HANZI.get(hanzi);

/** Từ mới của đúng một cấp. */
export const wordsIntroducedAt = (level: HskLevel) => HSK_WORDS.filter((w) => w.level === level);

/** Toàn bộ từ cần biết đến hết cấp (cộng dồn). */
export const wordsUpTo = (level: HskLevel) => HSK_WORDS.filter((w) => w.level <= level);

/** Từ có thuộc phạm vi cấp ≤ level không — dùng để kiểm tra bài học không dùng từ vượt cấp. */
export function isWithinLevel(hanzi: string, level: HskLevel): boolean {
  const w = BY_HANZI.get(hanzi);
  return !!w && w.level <= level;
}

/** Tập chữ Hán xuất hiện trong từ vựng đến hết cấp. */
export function charsUpTo(level: HskLevel): Set<string> {
  return new Set(wordsUpTo(level).flatMap((w) => [...w.hanzi]));
}

let readingsCache: Map<string, Set<string>> | null = null;
/** Các cách đọc (có thanh, chữ thường) của từng chữ Hán, lấy từ danh mục từ. Thanh nhẹ cũng được tính. */
export function charReadings(): Map<string, Set<string>> {
  if (readingsCache) return readingsCache;
  const map = new Map<string, Set<string>>();
  for (const w of HSK_WORDS) {
    const syl = w.pinyin.split(" ");
    [...w.hanzi].forEach((ch, i) => {
      if (!map.has(ch)) map.set(ch, new Set());
      map.get(ch)!.add(syl[i].toLowerCase());
    });
  }
  readingsCache = map;
  return map;
}
