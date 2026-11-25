import { describe, expect, it } from "vitest";
import { DIALOGUES, getDialogue } from "./dialogues";
import { expectSelfGrading, expectWellFormed } from "./question-checks";
import { getReading, READINGS } from "./readings";
import { TOPIC_CONTENT } from "./topics";

const topicQuestionIds = Object.values(TOPIC_CONTENT).flatMap((t) => t.questions.map((q) => q.id));

describe("readings", () => {
  it("id bài không trùng và tra cứu được", () => {
    expect(new Set(READINGS.map((r) => r.id)).size).toBe(READINGS.length);
    for (const r of READINGS) expect(getReading(r.id)).toBe(r);
  });

  for (const r of READINGS) {
    describe(r.id, () => {
      it("có ít nhất 3 đoạn, mỗi đoạn có bản dịch, có từ vựng", () => {
        expect(r.paragraphs.length).toBeGreaterThanOrEqual(3);
        for (const p of r.paragraphs) expect(p.vi.length, p.en).toBeGreaterThan(5);
        expect(r.glossary.length).toBeGreaterThanOrEqual(4);
      });

      it("có ít nhất 5 câu hỏi hợp lệ, tự chấm đúng", () => {
        expect(r.questions.length).toBeGreaterThanOrEqual(5);
        r.questions.forEach(expectWellFormed);
        r.questions.forEach(expectSelfGrading);
      });

      it("từ vựng chú thích có xuất hiện trong bài", () => {
        const text = r.paragraphs.map((p) => p.en.toLowerCase()).join(" ");
        for (const g of r.glossary) {
          // "mistake A for B" là mẫu cấu trúc: kiểm tra từ đầu tiên.
          const head = g.word.toLowerCase().split(" ")[0];
          expect(text.includes(head), g.word).toBe(true);
        }
      });
    });
  }
});

describe("dialogues", () => {
  it("id bài không trùng và tra cứu được", () => {
    expect(new Set(DIALOGUES.map((d) => d.id)).size).toBe(DIALOGUES.length);
    for (const d of DIALOGUES) expect(getDialogue(d.id)).toBe(d);
  });

  for (const d of DIALOGUES) {
    describe(d.id, () => {
      it("cả hai nhân vật đều có lời, mỗi lời có bản dịch", () => {
        expect(d.lines.length).toBeGreaterThanOrEqual(6);
        expect(new Set(d.lines.map((l) => l.speaker)).size).toBe(2);
        for (const l of d.lines) expect(l.vi.length, l.en).toBeGreaterThan(2);
      });

      it("có mẫu câu và ít nhất 5 bài tập hợp lệ, tự chấm đúng", () => {
        expect(d.phrases.length).toBeGreaterThanOrEqual(3);
        expect(d.questions.length).toBeGreaterThanOrEqual(5);
        d.questions.forEach(expectWellFormed);
        d.questions.forEach(expectSelfGrading);
      });
    });
  }
});

describe("id câu hỏi", () => {
  it("không trùng giữa ngữ pháp, bài đọc và hội thoại", () => {
    const ids = [...topicQuestionIds, ...READINGS.flatMap((r) => r.questions.map((q) => q.id)), ...DIALOGUES.flatMap((d) => d.questions.map((q) => q.id))];
    expect(new Set(ids).size).toBe(ids.length);
  });
});
