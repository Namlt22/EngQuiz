import { describe, expect, it } from "vitest";
import { sameSpelling } from "./EnFlashcardSession";

describe("chấm kiểu Gõ từ", () => {
  it("không phân biệt hoa thường, bỏ khoảng trắng thừa, nhận ’ thay cho '", () => {
    expect(sameSpelling("  Look  After ", "look after")).toBe(true);
    expect(sameSpelling("T-Shirt", "t-shirt")).toBe(true);
    expect(sameSpelling("don’t", "don't")).toBe(true);
  });
  it("sai chính tả thì không chấp nhận", () => {
    expect(sameSpelling("recieve", "receive")).toBe(false);
    expect(sameSpelling("lookafter", "look after")).toBe(false);
    expect(sameSpelling("", "apple")).toBe(false);
  });
});
