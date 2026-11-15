import { describe, expect, it } from "vitest";
import { averageScore, READ_ALOUD_PASS, scoreReadAloud, speechStats } from "./speaking";

describe("scoreReadAloud", () => {
  it("nói đúng cả câu → 100 điểm, đạt", () => {
    const r = scoreReadAloud("He goes to school by bike.", ["he goes to school by bike"]);
    expect(r.score).toBe(100);
    expect(r.passed).toBe(true);
  });

  it("lấy bản đoán khớp nhất, không phải bản đầu tiên", () => {
    const r = scoreReadAloud("I'm a student.", ["I am a student", "I'm a stew dent"].reverse());
    expect(r.heard).toBe("I am a student");
    expect(r.score).toBe(100);
  });

  it("đánh dấu từ máy nghe sai và từ bị thiếu", () => {
    const r = scoreReadAloud("Minh gets up at six o'clock.", ["Minh get up at"]);
    const status = Object.fromEntries(r.check.words.map((w) => [w.display, w.status]));
    expect(status.gets).toBe("wrong");
    expect(status["o'clock."]).toBe("missing");
    expect(r.passed).toBe(false);
    expect(r.score).toBeLessThan(READ_ALOUD_PASS);
  });

  it("chấp nhận số đọc thành chữ (máy hay trả về chữ số)", () => {
    expect(scoreReadAloud("I have two brothers.", ["I have 2 brothers"]).score).toBe(100);
  });

  it("không nghe được gì → 0 điểm", () => {
    expect(scoreReadAloud("Hello there.", []).score).toBe(0);
    expect(scoreReadAloud("Hello there.", ["   "]).score).toBe(0);
  });
});

describe("averageScore", () => {
  it("câu chưa nói tính 0; bộ rỗng → 0", () => {
    expect(averageScore([100, 80, undefined])).toBe(60);
    expect(averageScore([])).toBe(0);
  });
});

describe("speechStats", () => {
  it("đếm từ có chữ/số và tính số từ mỗi phút", () => {
    expect(speechStats("I like - reading books", 30_000)).toEqual({ words: 4, wordsPerMinute: 8, seconds: 30 });
  });

  it("thời gian 0 → không chia cho 0", () => {
    expect(speechStats("hello", 0).wordsPerMinute).toBe(0);
  });
});

describe("tên riêng Việt Nam khi đọc theo mẫu", () => {
  it("máy nghe tên Việt thành từ tiếng Anh khác → không bị trừ điểm", () => {
    const r = scoreReadAloud("I live in a small house in Hue.", ["I live in a small house in way"]);
    expect(r.score).toBe(100);
    expect(r.passed).toBe(true);
  });

  it("tên hai chữ bị nghe thành nhiều từ thừa vẫn đạt; từ tiếng Anh sai vẫn bị trừ", () => {
    expect(scoreReadAloud("We're flying to Da Nang on Friday.", ["we're flying to the non go on friday"]).passed).toBe(true);
    expect(scoreReadAloud("My name is Linh.", ["my game is lin"]).score).toBeLessThan(100);
  });
});
