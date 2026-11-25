import { describe, expect, it } from "vitest";
import { respellVietnameseNames, splitVietnameseNames } from "./vi-names";

describe("tên riêng Việt Nam trong câu tiếng Anh", () => {
  it("tách tên ra đoạn giọng Việt, có dấu; phần còn lại giọng Anh", () => {
    expect(splitVietnameseNames("Hue is not as big as Hanoi.")).toEqual([
      { text: "Huế", lang: "vi" },
      { text: " is not as big as Hanoi.", lang: "en" },
    ]);
    expect(splitVietnameseNames("The Tale of Kieu was written by Nguyen Du.")).toEqual([
      { text: "The Tale of ", lang: "en" },
      { text: "Kiều", lang: "vi" },
      { text: " was written by ", lang: "en" },
      { text: "Nguyễn Du", lang: "vi" },
      { text: ".", lang: "en" },
    ]);
  });

  it("cụm hai chữ được nhận trọn (Đà Nẵng, Hội An), sở hữu 's giữ ở đoạn tiếng Anh", () => {
    expect(splitVietnameseNames("We visited Hoi An last summer.").map((s) => s.text)).toEqual(["We visited ", "Hội An", " last summer."]);
    expect(splitVietnameseNames("We're flying to Da Nang on Friday.")[1]).toEqual({ text: "Đà Nẵng", lang: "vi" });
    expect(splitVietnameseNames("This is Lan's bag.").map((s) => s.text)).toEqual(["This is ", "Lan", "'s bag."]);
  });

  it("không nhầm từ tiếng Anh: 'An apple', 'Hanoi', 'Vietnam', 'name', 'huge', 'Lane'", () => {
    for (const s of ["An apple a day.", "I'm from Hanoi.", "I'm from Vietnam.", "My name is Tom.", "A huge dog.", "Penny Lane."]) {
      expect(splitVietnameseNames(s), s).toEqual([{ text: s, lang: "en" }]);
    }
    expect(splitVietnameseNames("Hello, my name is An.").map((s) => s.lang)).toEqual(["en", "vi", "en"]);
  });

  it("không có giọng Việt → phiên âm cho giọng Anh", () => {
    expect(respellVietnameseNames("Last summer, my family went to Da Nang.")).toBe("Last summer, my family went to Dah Nahng.");
    expect(respellVietnameseNames("Hue is not as big as Hanoi.")).toBe("Hway is not as big as Hanoi.");
  });
});
