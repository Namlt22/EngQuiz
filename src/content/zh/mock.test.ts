import { describe, expect, it } from "vitest";
import { outOfLevel } from "@/core/zh-sentence";
import { ZH_MOCKS } from "./mock/hsk1";

const HAN = /\p{Script=Han}/u;

describe("bài thi thử tiếng Trung", () => {
  for (const test of Object.values(ZH_MOCKS)) {
    it(`${test.id}: id không trùng, có cả phần nghe và đọc`, () => {
      const ids = test.items.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(test.items.some((q) => q.section === "listening")).toBe(true);
      expect(test.items.some((q) => q.section === "reading")).toBe(true);
    });

    it(`${test.id}: câu nghe có câu đọc lên; mọi câu tiếng Trung trong phạm vi cấp`, () => {
      for (const q of test.items) {
        if (q.section === "listening") expect(q.say, q.id).toBeTruthy();
        const zh = [q.say, q.text, q.zhPrompt ? q.prompt.replace(/___/g, "") : undefined, ...q.options.filter((o) => HAN.test(o))].filter((s): s is string => !!s);
        for (const s of zh) expect.soft(outOfLevel(s, test.level), `${q.id}: ${s}`).toEqual([]);
      }
    });

    it(`${test.id}: ít nhất 3 lựa chọn khác nhau`, () => {
      for (const q of test.items) {
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(3);
        expect(new Set(q.options).size, q.id).toBe(q.options.length);
      }
    });
  }
});
