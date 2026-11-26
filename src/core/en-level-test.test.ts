import { describe, expect, it } from "vitest";
import { LEVEL_TEST } from "@/content/en-level-test";
import { placement, shouldStop, TEST_LEVELS, type LevelAnswer } from "./en-level-test";

const run = (pattern: Record<string, number>) =>
  TEST_LEVELS.flatMap((lv) => Array.from({ length: 4 }, (_, i): LevelAnswer => ({ level: lv, correct: i < (pattern[lv] ?? 0) })));

describe("level test content", () => {
  it("has 4 well-formed questions per level, in order", () => {
    expect(LEVEL_TEST.map((q) => q.level)).toEqual(TEST_LEVELS.flatMap((l) => [l, l, l, l]));
    for (const q of LEVEL_TEST) {
      expect(q.prompt).toContain("___");
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
    expect(new Set(LEVEL_TEST.map((q) => q.id)).size).toBe(LEVEL_TEST.length);
  });
});

describe("placement", () => {
  it("places a beginner at A1", () => {
    expect(placement(run({ A1: 1 }).slice(0, 4))).toMatchObject({ estimate: null, start: "A1" });
  });

  it("uses the highest level passed in a row", () => {
    expect(placement(run({ A1: 4, A2: 3, B1: 2 }).slice(0, 12))).toMatchObject({ estimate: "A2", start: "B1" });
    // Qua B1 nhưng trượt A2 → vẫn chỉ tính tới A1.
    expect(placement(run({ A1: 4, A2: 2, B1: 4 }))).toMatchObject({ estimate: "A1", start: "A2" });
  });

  it("caps the start level at C1", () => {
    expect(placement(run({ A1: 4, A2: 4, B1: 4, B2: 4, C1: 4 }))).toMatchObject({ estimate: "C1", start: "C1" });
  });

  it("stops right after a failed level", () => {
    const answers = run({ A1: 4, A2: 2 });
    expect(shouldStop(answers.slice(0, 4))).toBe(false);
    expect(shouldStop(answers.slice(0, 7))).toBe(false); // A2 chưa làm xong
    expect(shouldStop(answers.slice(0, 8))).toBe(true);
  });
});
