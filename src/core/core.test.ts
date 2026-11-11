import { describe, expect, it } from "vitest";
import { checkDictation, classifyToken, maskSentence, maskWord } from "./dictation";
import { gradeQuestion } from "./grading";
import { isEquivalent, normalizeSentence, tokenize } from "./normalize";
import type { Question } from "@/content/types";

describe("normalize", () => {
  it("bỏ qua hoa/thường, dấu câu, khoảng trắng thừa", () => {
    expect(normalizeSentence("  Hello,   WORLD!! ")).toBe("hello world");
  });

  it("đồng nhất dấu nháy cong và mở rộng n't", () => {
    expect(tokenize("I don’t know")).toEqual(["i", "do", "not", "know"]);
    expect(isEquivalent("She doesn't like it.", "she does not like it")).toBe(true);
  });

  it("xử lý won't / can't / cannot", () => {
    expect(isEquivalent("I won't go", "I will not go")).toBe(true);
    expect(isEquivalent("I can't swim", "I cannot swim")).toBe(true);
  });

  it("giữ nguyên 's và 'd vì mơ hồ", () => {
    expect(tokenize("He's John's friend")).toEqual(["he's", "john's", "friend"]);
    expect(tokenize("I'd go")).toEqual(["i'd", "go"]);
  });

  it("mở rộng 'm 're 'll 've", () => {
    expect(tokenize("I'm sure we've seen they're ok, you'll see")).toEqual([
      "i", "am", "sure", "we", "have", "seen", "they", "are", "ok", "you", "will", "see",
    ]);
  });

  it("số và chữ số tương đương, chính tả Anh–Mỹ", () => {
    expect(isEquivalent("I have 5 cats", "I have five cats")).toBe(true);
    expect(isEquivalent("my favourite colour", "my favorite color")).toBe(true);
  });

  it("gạch nối được tách như khoảng trắng", () => {
    expect(isEquivalent("a well-known writer", "a well known writer")).toBe(true);
  });
});

describe("classifyToken", () => {
  it("lỗi gõ 1 ký tự ở từ dài là gần đúng", () => {
    expect(classifyToken("receive", "recieve")).toBe("wrong"); // hoán vị = 2 phép sửa
    expect(classifyToken("because", "becuse")).toBe("near");
    expect(classifyToken("house", "hous")).toBe("near");
  });
  it("từ ngắn phải đúng tuyệt đối", () => {
    expect(classifyToken("cat", "cap")).toBe("wrong");
  });
  it("sai đuôi ngữ pháp không được coi là lỗi gõ", () => {
    expect(classifyToken("walked", "walk")).toBe("wrong");
    expect(classifyToken("plays", "play")).toBe("wrong");
    expect(classifyToken("watches", "watched")).toBe("wrong");
  });
});

describe("checkDictation", () => {
  const sentence = "She doesn't like coffee, but she loves tea.";

  it("câu gõ đúng hoàn toàn (khác dấu câu, hoa/thường) → passed", () => {
    const r = checkDictation(sentence, "she does not like coffee but she loves tea");
    expect(r.passed).toBe(true);
    expect(r.accuracy).toBe(1);
    expect(r.words.every((w) => w.status === "correct")).toBe(true);
  });

  it("đánh dấu từ thiếu và từ sai đúng vị trí", () => {
    const r = checkDictation(sentence, "she doesn't like coffee she love tea");
    expect(r.passed).toBe(false);
    const statuses = r.words.map((w) => `${w.display}:${w.status}`);
    expect(statuses).toContain("but:missing");
    expect(statuses).toContain("loves:wrong");
    expect(statuses).toContain("coffee,:correct");
  });

  it("phát hiện từ gõ thừa", () => {
    const r = checkDictation("I like tea.", "I really like tea");
    expect(r.extras).toEqual(["really"]);
    expect(r.passed).toBe(false);
  });

  it("lỗi gõ nhỏ vẫn qua nhưng chỉ được nửa điểm cho từ đó", () => {
    const r = checkDictation("I stayed at home because it rained.", "I stayed at home becuse it rained");
    expect(r.passed).toBe(true);
    expect(r.nearTokens).toBe(1);
    expect(r.accuracy).toBeCloseTo((6 + 0.5) / 7);
  });

  it("từ viết tắt trong câu gốc khớp khi người học gõ dạng đầy đủ", () => {
    const r = checkDictation("I'm not hungry.", "I am not hungry");
    expect(r.passed).toBe(true);
  });

  it("bài trống → 0 điểm, mọi từ bị thiếu", () => {
    const r = checkDictation("Good morning.", "");
    expect(r.accuracy).toBe(0);
    expect(r.words.map((w) => w.status)).toEqual(["missing", "missing"]);
  });

  it("từ lặp lại được căn chỉnh đúng", () => {
    const r = checkDictation("I think that that is true.", "I think that is true");
    expect(r.words.filter((w) => w.status === "missing")).toHaveLength(1);
  });
});

describe("mask", () => {
  it("che chữ, giữ dấu câu", () => {
    expect(maskWord("time,")).toBe("****,");
    expect(maskWord("don't")).toBe("***'*");
    expect(maskSentence("Hi, Tom!")).toBe("**, ***!");
  });
});

describe("gradeQuestion", () => {
  const verb: Question = {
    id: "q1", type: "verb_form", prompt: "If I ___ rich, I would travel.", base: "be",
    answers: ["were", "was"], explanation: "",
  };
  it("verb_form chấp nhận nhiều đáp án", () => {
    expect(gradeQuestion(verb, { type: "verb_form", text: " Were " })).toBe(true);
    expect(gradeQuestion(verb, { type: "verb_form", text: "was" })).toBe(true);
    expect(gradeQuestion(verb, { type: "verb_form", text: "am" })).toBe(false);
  });

  it("transform bỏ qua dấu câu và viết tắt", () => {
    const q: Question = {
      id: "q2", type: "transform", prompt: "", answers: ["If I had a car, I could drive to work."],
      explanation: "",
    };
    expect(gradeQuestion(q, { type: "transform", text: "if i had a car i could drive to work" })).toBe(true);
  });

  it("word_order so sánh câu ghép lại", () => {
    const q: Question = {
      id: "q3", type: "word_order", words: ["been", "I", "have", "never", "to", "Paris"],
      answers: ["I have never been to Paris"], explanation: "",
    };
    expect(gradeQuestion(q, { type: "word_order", order: ["I", "have", "never", "been", "to", "Paris"] })).toBe(true);
    expect(gradeQuestion(q, { type: "word_order", order: ["I", "never", "have", "been", "to", "Paris"] })).toBe(false);
  });

  it("matching phải đúng toàn bộ cặp", () => {
    const q: Question = {
      id: "q4", type: "matching", prompt: "", left: ["a", "b"], right: ["x", "y"], pairs: [1, 0],
      explanation: "",
    };
    expect(gradeQuestion(q, { type: "matching", pairs: [1, 0] })).toBe(true);
    expect(gradeQuestion(q, { type: "matching", pairs: [0, 1] })).toBe(false);
  });
});
