import { describe, expect, it } from "vitest";
import { charSyllables, joinSyllables, outOfLevel, plainText, sameOrder, sentencePinyin, tokenize } from "./zh-sentence";

describe("câu tách từ", () => {
  it("lấy pinyin từ danh mục, viết liền trong từ", () => {
    expect(sentencePinyin("我 是 学生 。")).toBe("wǒ shì xuésheng.");
    expect(plainText("我 是 学生 。")).toBe("我是学生。");
  });

  it("tên riêng ghi kèm pinyin; số ghép theo chữ số", () => {
    const [name, , num] = tokenize("王|Wáng 老师 二十五 岁");
    expect(name).toMatchObject({ text: "王", pinyin: "Wáng", kind: "name" });
    expect(num).toMatchObject({ text: "二十五", pinyin: "èrshíwǔ", kind: "number", syllables: ["èr", "shí", "wǔ"] });
    expect(tokenize("越南|Yuè-nán")[0]).toMatchObject({ pinyin: "Yuènán", syllables: ["Yuè", "nán"] });
  });

  it("dấu ' trước âm tiết bắt đầu bằng nguyên âm", () => {
    expect(joinSyllables("xī ān")).toBe("xī'ān");
    expect(joinSyllables("nǚ ér")).toBe("nǚ'ér");
  });

  it("báo từ vượt cấp và từ không nhận ra", () => {
    expect(outOfLevel("我 爱 你 。", 1)).toEqual([]);
    expect(outOfLevel("我 爱情 。", 1)).toEqual(["爱情"]);
    expect(outOfLevel("我 叫 小明 。", 1)).toEqual(["小明"]);
  });

  it("so thứ tự câu sắp xếp, bỏ qua dấu câu", () => {
    expect(sameOrder(["我", "是", "学生"], "我 是 学生 。")).toBe(true);
    expect(sameOrder(["是", "我", "学生"], "我 是 学生 。")).toBe(false);
  });
});

describe("âm tiết theo từng chữ", () => {
  it("bỏ dấu câu, giữ thanh nhẹ", () => {
    expect(charSyllables("我 是 学生 。")).toEqual([
      { char: "我", syllable: "wǒ" },
      { char: "是", syllable: "shì" },
      { char: "学", syllable: "xué" },
      { char: "生", syllable: "sheng" },
    ]);
  });
});
