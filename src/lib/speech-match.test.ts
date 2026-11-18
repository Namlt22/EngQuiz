import { describe, expect, it } from "vitest";
import { heardAll } from "./speech-match";

describe("đã nghe đủ câu cần đọc chưa (để dừng nghe sớm)", () => {
  it("tiếng Anh: đủ mọi từ theo thứ tự, bỏ qua hoa thường và dấu câu", () => {
    expect(heardAll("See", ["see"], "en")).toBe(true);
    expect(heardAll("i would like a coffee please", ["I'd like a coffee, please."], "en")).toBe(false);
    expect(heardAll("I would like a coffee please", ["I would like a coffee, please."], "en")).toBe(true);
    expect(heardAll("I would like a", ["I would like a coffee, please."], "en")).toBe(false);
  });

  it("tiếng Anh: khớp một trong các câu đích là đủ", () => {
    expect(heardAll("people", ["see", "eat", "people"], "en")).toBe(true);
  });

  it("tiếng Trung: so theo chữ, bỏ khoảng trắng và dấu câu", () => {
    expect(heardAll("你好", ["你好！"], "zh")).toBe(true);
    expect(heardAll("你", ["你好"], "zh")).toBe(false);
  });

  it("không có câu đích hoặc chưa nghe gì → chưa đủ", () => {
    expect(heardAll("hello", [], "en")).toBe(false);
    expect(heardAll("", ["hello"], "en")).toBe(false);
  });
});

describe("khoảng im lặng trước khi tự dừng", () => {
  it("một từ / chữ ngắn → ngắn; câu hoặc không có đích → dài", async () => {
    const { silenceFor, END_SILENCE_MS } = await import("./speech-recognition");
    expect(silenceFor(["see"])).toBe(END_SILENCE_MS.word);
    expect(silenceFor(["你好"])).toBe(END_SILENCE_MS.word);
    expect(silenceFor(["I would like a coffee, please."])).toBe(END_SILENCE_MS.sentence);
    expect(silenceFor(undefined)).toBe(END_SILENCE_MS.sentence);
  });
});
