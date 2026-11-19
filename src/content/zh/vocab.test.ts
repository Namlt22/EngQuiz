import { describe, expect, it } from "vitest";
import { HSK_INFO, HSK_LEVELS } from "./hsk-levels";
import { HSK_WORDS, charsUpTo, getHskWord, isWithinLevel, wordsIntroducedAt, wordsUpTo } from "./vocab";

/** Số từ mới mỗi cấp trong dữ liệu nguồn (src/content/zh/data/README.md). */
const INTRODUCED = { 1: 300, 2: 197, 3: 493, 4: 990 } as const;
/** Một âm tiết pinyin có dấu thanh (hoặc thanh nhẹ không dấu); tên riêng viết hoa chữ đầu. */
const SYLLABLE = /^[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/;

describe("danh mục từ HSK 3.0", () => {
  it("số từ mới mỗi cấp khớp nguồn", () => {
    for (const lv of HSK_LEVELS) expect(wordsIntroducedAt(lv)).toHaveLength(INTRODUCED[lv]);
  });

  it("cộng dồn không vượt quá số từ của đề cương (từng cấp)", () => {
    for (const lv of HSK_LEVELS) {
      // Nguồn gộp các mục lặp nên luôn ≤ con số công bố, và lệch không quá 2%.
      expect(wordsUpTo(lv).length).toBeLessThanOrEqual(HSK_INFO[lv].words);
      expect(wordsUpTo(lv).length).toBeGreaterThanOrEqual(HSK_INFO[lv].words * 0.98);
    }
  });

  it("không có từ trùng, chỉ gồm chữ Hán", () => {
    expect(new Set(HSK_WORDS.map((w) => w.hanzi)).size).toBe(HSK_WORDS.length);
    for (const w of HSK_WORDS) expect(w.hanzi).toMatch(/^\p{Script=Han}+$/u);
  });

  it("mỗi chữ Hán ứng với đúng một âm tiết pinyin hợp lệ", () => {
    for (const w of HSK_WORDS) {
      const syllables = w.pinyin.split(" ");
      expect(syllables, w.hanzi).toHaveLength([...w.hanzi].length);
      for (const s of syllables) expect(s, w.hanzi).toMatch(SYLLABLE);
    }
  });

  it("tra cứu và kiểm tra phạm vi cấp", () => {
    expect(getHskWord("爱")).toEqual({ hanzi: "爱", pinyin: "ài", level: 1 });
    expect(isWithinLevel("爱情", 3)).toBe(false);
    expect(isWithinLevel("爱情", 4)).toBe(true);
    expect(isWithinLevel("không-có", 4)).toBe(false);
  });

  it("tập chữ tăng dần theo cấp", () => {
    const sizes = HSK_LEVELS.map((lv) => charsUpTo(lv).size);
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
    expect(charsUpTo(1).has("爱")).toBe(true);
  });
});
