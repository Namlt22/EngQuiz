import { describe, expect, it } from "vitest";
import { VI_BY_LEVEL, VI_LEVELS, vocabVi } from "./vocab-vi";
import { wordsIntroducedAt } from "./vocab";

describe("nghĩa tiếng Việt của từ vựng HSK", () => {
  it("mỗi cấp đã làm có nghĩa cho ĐỦ và ĐÚNG danh sách từ của cấp đó", () => {
    for (const lv of VI_LEVELS) {
      const words = wordsIntroducedAt(lv).map((w) => w.hanzi).sort();
      const data = Object.keys(VI_BY_LEVEL[lv] ?? {}).sort();
      expect(data).toEqual(words);
    }
  });

  it("nghĩa không trống; âm Hán-Việt (nếu có) có đúng số âm tiết bằng số chữ", () => {
    for (const lv of VI_LEVELS) {
      for (const w of wordsIntroducedAt(lv)) {
        const e = vocabVi(w.hanzi);
        expect(e, w.hanzi).toBeDefined();
        const [, vi, hv] = e!;
        expect(vi.trim().length, w.hanzi).toBeGreaterThan(0);
        if (hv) expect(hv.split(" ").length, `${w.hanzi} ${hv}`).toBe([...w.hanzi].length);
      }
    }
  });

  it("cùng một chữ thì cùng âm Hán-Việt ở mọi từ (bắt lỗi gõ nhầm)", () => {
    const seen = new Map<string, Set<string>>();
    for (const lv of VI_LEVELS) {
      for (const w of wordsIntroducedAt(lv)) {
        const hv = vocabVi(w.hanzi)?.[2];
        if (!hv) continue;
        [...w.hanzi].forEach((ch, i) => {
          if (!seen.has(ch)) seen.set(ch, new Set());
          seen.get(ch)!.add(hv.split(" ")[i]);
        });
      }
    }
    const conflicts = [...seen].filter(([, s]) => s.size > 1).map(([ch, s]) => `${ch}: ${[...s].join("/")}`);
    expect(conflicts).toEqual([]);
  });
});
