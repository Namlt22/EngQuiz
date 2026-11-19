import { describe, expect, it } from "vitest";
import { BASIC_STROKES, COMMON_RADICALS, STROKE_RULES } from "./hanzi-basics";
import { charsUpTo } from "./vocab";

const HSK_CHARS = charsUpTo(4);
const chars = (s: string) => s.split(" ");

describe("kiến thức nền chữ Hán", () => {
  it("đủ 8 nét cơ bản, 7 quy tắc thứ tự nét", () => {
    expect(BASIC_STROKES).toHaveLength(8);
    expect(STROKE_RULES).toHaveLength(7);
  });

  it("bộ thủ không trùng, mỗi bộ có chữ ví dụ", () => {
    const forms = COMMON_RADICALS.map((r) => r.form);
    expect(new Set(forms).size).toBe(forms.length);
    for (const r of COMMON_RADICALS) expect(chars(r.examples).length, r.form).toBeGreaterThanOrEqual(1);
  });

  it("mọi chữ ví dụ là một chữ Hán thuộc phạm vi HSK 1–4", () => {
    const all = [
      ...BASIC_STROKES.flatMap((s) => chars(s.examples)),
      ...STROKE_RULES.map((r) => r.example),
      ...COMMON_RADICALS.flatMap((r) => chars(r.examples)),
    ];
    for (const ch of all) {
      expect(ch, ch).toMatch(/^\p{Script=Han}$/u);
      expect(HSK_CHARS.has(ch), `${ch} ngoài HSK 1–4`).toBe(true);
    }
  });

  it("mỗi quy tắc thứ tự nét có chữ ví dụ riêng", () => {
    const ex = STROKE_RULES.map((r) => r.example);
    expect(new Set(ex).size).toBe(ex.length);
  });
});
