import { describe, expect, it } from "vitest";
import type { Question } from "@/content/types";
import { TOPIC_CONTENT } from "@/content/topics";
import { EN_VOCAB_TOPICS } from "@/content/vocab-en";
import { gradeQuestion } from "./grading";
import { availableGrammarModes, buildGrammarGame, deriveTrueFalse } from "./en-grammar-games";
import { buildVocabRound, checkWritten, fillable, findInSentence, pickDistractors, seededRng, topicWords, type GameWord } from "./en-vocab-games";

const w = (word: string, pos: GameWord["pos"] = "n", vi = word): GameWord => ({ id: word, word, pos, ipa: "/x/", vi, example: `I like the ${word}.` });

describe("findInSentence", () => {
  it("finds inflected forms and multi-word items, not parts of other words", () => {
    expect(findInSentence("Rabbits eat carrots.", "carrot")).toEqual({ start: 12, end: 19 });
    expect(findInSentence("The baby cries at night.", "cry")).not.toBeNull();
    expect(findInSentence("We planned a trip.", "plan")).not.toBeNull();
    expect(findInSentence("I get up at six.", "get up")).not.toBeNull();
    expect(findInSentence("The carpet is red.", "car")).toBeNull();
  });
});

describe("vocab rounds", () => {
  const pool = ["apple", "banana", "mango", "grape", "lemon", "orange", "pear"].map((x) => w(x));

  it("builds 4 unique options including the answer, reproducibly", () => {
    const round = buildVocabRound("choose", pool, 5, seededRng(1));
    expect(round).toHaveLength(5);
    for (const q of round) {
      if (q.mode !== "choose") throw new Error();
      expect(new Set(q.options.map((o) => o.id)).size).toBe(4);
      expect(q.options.some((o) => o.id === q.word.id)).toBe(true);
    }
    expect(buildVocabRound("listen", pool, 5, seededRng(7))).toEqual(buildVocabRound("listen", pool, 5, seededRng(7)));
  });

  it("splits the example around the word for gap fill", () => {
    for (const q of buildVocabRound("fill", pool, 5, seededRng(3))) {
      if (q.mode !== "fill") throw new Error();
      expect(q.before + q.gap + q.after).toBe(q.word.example);
    }
  });

  it("groups matching rounds by five and prefers same part of speech", () => {
    expect(buildVocabRound("match", pool, 10, seededRng(2))).toHaveLength(1);
    const mixed = [w("run", "v"), w("swim", "v"), w("jump", "v"), w("walk", "v"), w("red", "adj"), w("big", "adj")];
    expect(pickDistractors(mixed[0], mixed, 3, seededRng(3)).every((x) => x.pos === "v")).toBe(true);
  });

  it("accepts spelling variants when writing", () => {
    expect(checkWritten(" Colour ", w("colour"))).toBe(true);
    expect(checkWritten("color", w("colour"))).toBe(true);
    expect(checkWritten("aple", w("apple"))).toBe(false);
  });

  it("every vocab-en topic can be played in every mode", () => {
    for (const t of EN_VOCAB_TOPICS) {
      const words = topicWords(t);
      expect(fillable(words).length, `${t.id} fill`).toBeGreaterThanOrEqual(5);
      for (const mode of ["listen", "choose", "fill", "match", "write"] as const) {
        expect(buildVocabRound(mode, words, 10, seededRng(5)).length, `${t.id}/${mode}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("grammar games", () => {
  const mcq: Question = { id: "q1", type: "mcq", prompt: "She ___ happy.", options: ["are", "is"], answer: 1, explanation: "" };
  const verb: Question = { id: "q2", type: "verb_form", prompt: "He ___ TV.", base: "watch", answers: ["watches"], explanation: "" };
  const err: Question = {
    id: "q3",
    type: "error_id",
    segments: [{ text: "They " }, { text: "is", underline: true }, { text: " here." }],
    answer: 1,
    correction: "are",
    explanation: "",
  };

  it("derives balanced true/false statements with corrections", () => {
    const tf = deriveTrueFalse([mcq, verb, err]);
    expect(tf.map((q) => [q.statement, q.answer])).toEqual([
      ["She is happy.", true],
      ["He watch TV.", false],
      ["They are here.", true],
    ]);
    expect(tf[1].correction).toBe("He watches TV.");
  });

  it("produces valid, gradable questions for every grammar topic", () => {
    for (const [slug, content] of Object.entries(TOPIC_CONTENT)) {
      expect(availableGrammarModes(content.questions).length, slug).toBeGreaterThan(0);
      for (const q of buildGrammarGame("truefalse", content.questions)) {
        if (q.type !== "true_false") throw new Error();
        expect(q.statement).not.toContain("___");
        expect(gradeQuestion(q, { type: "true_false", value: q.answer })).toBe(true);
        if (!q.answer) expect(q.correction).not.toBe(q.statement);
      }
    }
  });
});
