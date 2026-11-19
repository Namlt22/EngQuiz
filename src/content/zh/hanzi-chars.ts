/**
 * Chữ Hán của khoá tiếng Trung, rút từ danh mục từ HSK 1–4.
 * Cấp của một chữ = cấp thấp nhất của từ chứa nó (chữ xuất hiện lần đầu ở cấp nào).
 * Bảng chữ chính thức (汉字表, GF 0025-2021) chưa có — khi có sẽ thay nguồn ở đây (src/content/zh/data/README.md).
 */
import { HSK_LEVELS, type HskLevel } from "./hsk-levels";
import { HSK_WORDS, type HskWord } from "./vocab";

export interface HanziChar {
  char: string;
  level: HskLevel;
  /** Cách đọc trong các từ HSK (có thanh), thanh nhẹ bỏ qua nếu chữ có cách đọc có thanh */
  readings: string[];
  /** Từ HSK chứa chữ này, cấp thấp trước */
  words: HskWord[];
}

/** Tên file dữ liệu nét trong public/hanzi (khớp scripts/build-hanzi-data.mjs). */
export const charCode = (ch: string) => ch.codePointAt(0)!.toString(16);
export const charFromCode = (code: string) => (/^[0-9a-f]{4,5}$/.test(code) ? String.fromCodePoint(parseInt(code, 16)) : undefined);
export const strokeDataUrl = (ch: string) => `/hanzi/${charCode(ch)}.json`;

function build(): HanziChar[] {
  const map = new Map<string, HanziChar>();
  for (const w of HSK_WORDS) {
    const syl = w.pinyin.split(" ");
    [...w.hanzi].forEach((ch, i) => {
      let c = map.get(ch);
      if (!c) {
        c = { char: ch, level: w.level, readings: [], words: [] };
        map.set(ch, c);
      }
      if (w.level < c.level) c.level = w.level;
      const r = syl[i].toLowerCase();
      if (!c.readings.includes(r)) c.readings.push(r);
      c.words.push(w);
    });
  }
  for (const c of map.values()) {
    const toned = c.readings.filter((r) => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(r));
    if (toned.length) c.readings = toned;
    c.words.sort((a, b) => a.level - b.level || a.hanzi.length - b.hanzi.length);
  }
  return [...map.values()];
}

export const HANZI_CHARS: HanziChar[] = build();
const BY_CHAR = new Map(HANZI_CHARS.map((c) => [c.char, c]));

export const getHanziChar = (ch: string) => BY_CHAR.get(ch);
export const charsAtLevel = (level: HskLevel) => HANZI_CHARS.filter((c) => c.level === level);

export const CHAR_COUNT_BY_LEVEL: Record<HskLevel, number> = Object.fromEntries(HSK_LEVELS.map((lv) => [lv, charsAtLevel(lv).length])) as Record<HskLevel, number>;
