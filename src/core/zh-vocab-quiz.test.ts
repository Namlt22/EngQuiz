import { describe, expect, it } from "vitest";
import { gradeWordPinyin } from "./zh-vocab-quiz";

describe("chấm gõ pinyin cho thẻ từ vựng", () => {
  it("đúng âm và thanh (dấu hoặc số) → đúng", () => {
    expect(gradeWordPinyin("你好", "nǐ hǎo").correct).toBe(true);
    expect(gradeWordPinyin("你好", "ni3hao3").correct).toBe(true);
    expect(gradeWordPinyin("学生", "xue2 sheng").correct).toBe(true); // thanh nhẹ không cần ghi
  });

  it("sai thanh → chưa đúng, âm tiết đó được nửa điểm", () => {
    const r = gradeWordPinyin("你好", "ni2 hao3");
    expect(r.correct).toBe(false);
    expect(r.marks.map((m) => m.score)).toEqual([0.5, 1]);
  });

  it("thiếu thanh với âm có thanh → chưa đúng", () => {
    expect(gradeWordPinyin("谢谢", "xie xie").correct).toBe(false);
  });

  it("gõ thừa âm tiết → chưa đúng dù các âm cần có đều đúng", () => {
    expect(gradeWordPinyin("你好", "ni3 hao3 ma").correct).toBe(false);
  });

  it("để trống → sai hết", () => {
    const r = gradeWordPinyin("你好", "");
    expect(r.correct).toBe(false);
    expect(r.marks.every((m) => m.score === 0)).toBe(true);
  });
});
