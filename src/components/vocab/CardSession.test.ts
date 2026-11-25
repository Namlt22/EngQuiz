import { describe, expect, it } from "vitest";
import { sameTerm } from "./CardSession";

describe("chấm kiểu gõ của phiên ôn thẻ", () => {
  it("tiếng Anh: không phân biệt hoa thường, khoảng trắng thừa, dấu câu cuối", () => {
    expect(sameTerm(" Look  after. ", "look after", "en")).toBe(true);
    expect(sameTerm("don’t", "don't", "en")).toBe(true);
    expect(sameTerm("lookafter", "look after", "en")).toBe(false);
    expect(sameTerm("", "a", "en")).toBe(false);
  });
  it("tiếng Trung: bỏ khoảng trắng và dấu câu", () => {
    expect(sameTerm("你 好！", "你好", "zh")).toBe(true);
    expect(sameTerm("你", "你好", "zh")).toBe(false);
  });
});
