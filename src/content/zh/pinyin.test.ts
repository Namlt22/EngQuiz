import { describe, expect, it } from "vitest";
import { applySandhi, bareSyllable, syllables, toneOf } from "@/core/pinyin";
import { INITIAL_CHART, PINYIN_LESSONS, type PinyinItem } from "./pinyin-lessons";
import { HSK_WORDS } from "./vocab";

/** Cách đọc có thanh (bỏ thanh nhẹ) của từng chữ trong danh mục từ HSK. */
const READINGS = new Map<string, Set<string>>();
for (const w of HSK_WORDS) {
  syllables(w.pinyin).forEach((s, i) => {
    if (toneOf(s) === 5) return;
    const ch = [...w.hanzi][i];
    if (!READINGS.has(ch)) READINGS.set(ch, new Set());
    READINGS.get(ch)!.add(s.toLowerCase());
  });
}

const SYLLABLE = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/;

function allItems(): PinyinItem[] {
  const out: PinyinItem[] = [];
  for (const l of PINYIN_LESSONS) {
    out.push(...l.items);
    if (l.drill.kind === "pairs") l.drill.pairs.forEach((p) => out.push(...p));
    if (l.drill.kind === "tones") l.drill.sets.forEach((s) => out.push(...s));
  }
  INITIAL_CHART.forEach((g) => g.cells.forEach((c) => out.push(c.sample)));
  return out;
}

describe("bài pinyin", () => {
  it("id bài không trùng", () => {
    const ids = PINYIN_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mỗi chữ mẫu có đúng một âm tiết pinyin hợp lệ", () => {
    for (const item of allItems()) {
      const syl = syllables(item.pinyin);
      expect(syl, item.hanzi).toHaveLength([...item.hanzi].length);
      for (const s of syl) expect(s, item.hanzi).toMatch(SYLLABLE);
    }
  });

  it("pinyin của chữ mẫu khớp danh mục HSK, và chữ đơn không phải chữ đa âm (giọng máy đọc sai)", () => {
    for (const item of allItems()) {
      [...item.hanzi].forEach((ch, i) => {
        const known = READINGS.get(ch);
        const syl = syllables(item.pinyin)[i];
        if (!known || toneOf(syl) === 5) return; // chữ ngoài danh mục HSK 1–4: kiểm tra bằng tay khi soạn
        expect([...known], `${ch} ${item.pinyin}`).toContain(syl);
        if ([...item.hanzi].length === 1) expect(known.size, `${ch} có nhiều cách đọc: ${[...known]}`).toBe(1);
      });
    }
  });

  it("âm cần chú ý có mặt trong âm tiết", () => {
    for (const item of allItems()) {
      if (!item.focus) continue;
      const bare = syllables(item.pinyin).map(bareSyllable).join("");
      // ü viết thành u sau j/q/x/y (yú, xué, yuǎn).
      expect(bare.includes(item.focus) || bare.includes(item.focus.replace("ü", "u")), `${item.pinyin} / ${item.focus}`).toBe(true);
    }
  });

  it("bộ 4 thanh: cùng một âm ở đủ 4 thanh, theo thứ tự", () => {
    for (const l of PINYIN_LESSONS) {
      if (l.drill.kind !== "tones") continue;
      for (const set of l.drill.sets) {
        expect(set.map((x) => toneOf(x.pinyin))).toEqual([1, 2, 3, 4]);
        expect(new Set(set.map((x) => bareSyllable(x.pinyin))).size).toBe(1);
      }
    }
  });

  it("cặp dễ nhầm: hai âm khác nhau, chung thanh điệu (chỉ khác âm đang luyện)", () => {
    for (const l of PINYIN_LESSONS) {
      if (l.drill.kind !== "pairs") continue;
      for (const [a, b] of l.drill.pairs) {
        expect(a.pinyin, l.id).not.toBe(b.pinyin);
        // Bài phân biệt thanh 2/3 thì khác thanh; các bài khác phải cùng thanh để chỉ luyện phần âm.
        if (l.id !== "tone-2-3") expect(toneOf(a.pinyin), `${l.id}: ${a.pinyin}/${b.pinyin}`).toBe(toneOf(b.pinyin));
      }
    }
  });

  it("câu hỏi trắc nghiệm có đáp án hợp lệ; câu biến điệu khớp applySandhi", () => {
    for (const l of PINYIN_LESSONS) {
      if (l.drill.kind !== "mcq") continue;
      for (const r of l.drill.rounds) {
        expect(r.answer).toBeGreaterThanOrEqual(0);
        expect(r.answer).toBeLessThan(r.options.length);
        expect(new Set(r.options).size).toBe(r.options.length);
        const base = /\(([^)]+)\)/.exec(r.prompt)?.[1];
        if (l.id === "sandhi" && r.say && base) expect(r.options[r.answer], r.prompt).toBe(applySandhi(r.say, base));
      }
    }
  });

  it("bảng thanh mẫu đủ 21 âm, không trùng", () => {
    const symbols = INITIAL_CHART.flatMap((g) => g.cells.map((c) => c.symbol));
    expect(symbols).toHaveLength(21);
    expect(new Set(symbols).size).toBe(21);
  });
});
