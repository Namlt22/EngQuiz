import { describe, expect, it } from "vitest";
import { checkSentence } from "./sentence-practice";

describe("chấm đặt câu tiếng Anh", () => {
  it("đúng khi khớp một đáp án, bỏ qua hoa thường, dấu câu, khoảng trắng thừa", () => {
    expect(checkSentence("en", "  where does she LIVE ", ["Where does she live?"]).correct).toBe(true);
  });

  it("dạng rút gọn và dạng đầy đủ coi như nhau", () => {
    expect(checkSentence("en", "He doesn't like coffee.", ["He does not like coffee."]).correct).toBe(true);
    expect(checkSentence("en", "What is your name?", ["What's your name?"]).correct).toBe(true);
    expect(checkSentence("en", "I'm going to visit Hue.", ["I am going to visit Hue."]).correct).toBe(true);
  });

  it("sai thì chỉ ra từ thiếu / thừa so với đáp án gần nhất", () => {
    const r = checkSentence("en", "Where she lives?", ["Where does she live?", "Where is her home?"]);
    expect(r.correct).toBe(false);
    expect(r.closest).toBe("Where does she live?");
    expect(r.missing).toEqual(["does", "live"]);
    expect(r.extra).toEqual(["lives"]);
  });

  it("để trống → sai", () => {
    expect(checkSentence("en", "  ", ["Hi."]).correct).toBe(false);
  });
});

describe("chấm đặt câu tiếng Trung", () => {
  it("so theo chữ, bỏ khoảng trắng và dấu câu (cả dấu toàn khổ)", () => {
    expect(checkSentence("zh", "你 叫 什么 名字", ["你叫什么名字？"]).correct).toBe(true);
    expect(checkSentence("zh", "你叫什么名字?", ["你叫什么名字？"]).correct).toBe(true);
  });

  it("sai thì chỉ ra chữ thiếu / thừa", () => {
    const r = checkSentence("zh", "你是学生？", ["你是学生吗？"]);
    expect(r.correct).toBe(false);
    expect(r.missing).toEqual(["吗"]);
    expect(r.extra).toEqual([]);
  });
});
