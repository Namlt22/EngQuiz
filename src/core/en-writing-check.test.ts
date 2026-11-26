import { describe, expect, it } from "vitest";
import { checkSentence, writingScore } from "./en-writing-check";

describe("checkSentence", () => {
  it("accepts a well-formed sentence", () => {
    expect(checkSentence("My name is Lan.")).toEqual([]);
    expect(checkSentence("  Are you a student?  ")).toEqual([]);
    expect(checkSentence("I'm from Hue!")).toEqual([]);
  });

  it("flags each rule", () => {
    expect(checkSentence("")).toEqual(["empty"]);
    expect(checkSentence("my name is Lan.")).toEqual(["capital"]);
    expect(checkSentence("My name is Lan")).toEqual(["punctuation"]);
    expect(checkSentence("Yes, i am a student.")).toEqual(["lowercaseI"]);
    expect(checkSentence("Tom and i'm happy.")).toEqual(["lowercaseI"]);
    expect(checkSentence("Hello Lan.")).toEqual(["tooShort"]);
  });

  it("does not confuse words containing i with the pronoun", () => {
    expect(checkSentence("It is in the kitchen.")).toEqual([]);
    expect(checkSentence("My sister likes ice cream.")).toEqual([]);
  });
});

describe("writingScore", () => {
  it("is the share of correct sentences", () => {
    expect(writingScore(["My name is Lan.", "i am ten", "I like cats.", ""])).toBe(50);
  });
});
