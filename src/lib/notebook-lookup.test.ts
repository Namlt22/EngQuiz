import { describe, expect, it } from "vitest";
import { lookupWord, sentenceWith } from "./notebook-lookup";

describe("tìm câu chứa từ (làm ví dụ khi lưu vào Sổ tay)", () => {
  it("tiếng Anh: câu đầu tiên chứa từ, không phân biệt hoa thường, nguyên từ", () => {
    const text = "I like tea. Staff work hard. My staff are kind!";
    expect(sentenceWith(text, "staff", "en")).toBe("Staff work hard.");
    expect(sentenceWith(text, "art", "en")).toBeUndefined();
  });
  it("tiếng Trung: tách câu theo 。！？", () => {
    expect(sentenceWith("我是学生。你好吗？", "你好", "zh")).toBe("你好吗？");
  });
});

describe("tra nghĩa từ đã chọn", () => {
  it("tiếng Anh: từ có trong bộ từ vựng → nghĩa + IPA", () => {
    expect(lookupWord("Apple", "en")).toMatchObject({ meaning: "quả táo", reading: "/ˈæpl/" });
    expect(lookupWord("xyzzy", "en")).toEqual({});
  });
  it("tiếng Trung: từ HSK → nghĩa + pinyin", () => {
    expect(lookupWord("你好", "zh").reading).toBe("nǐ hǎo");
    expect(lookupWord("你好", "zh").meaning).toBeTruthy();
  });
});
