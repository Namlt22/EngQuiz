import { describe, expect, it } from "vitest";
import { CATALOG, getTopicMeta } from "./catalog";
import { DICTATIONS } from "./dictations";
import { TOPIC_CONTENT } from "./topics";
import { gradeQuestion } from "@/core/grading";
import { checkDictation } from "@/core/dictation";

describe("catalog", () => {
  it("có 81 chủ điểm, slug không trùng", () => {
    expect(CATALOG).toHaveLength(81);
    expect(new Set(CATALOG.map((t) => t.slug)).size).toBe(81);
  });
});

describe("topic content", () => {
  const topics = Object.values(TOPIC_CONTENT);

  it("mọi chủ điểm có nội dung đều nằm trong danh mục", () => {
    for (const t of topics) expect(getTopicMeta(t.slug), t.slug).toBeDefined();
  });

  it("id câu hỏi không trùng trên toàn bộ ngân hàng", () => {
    const ids = topics.flatMap((t) => t.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const t of topics) {
    describe(t.slug, () => {
      it("có ít nhất 8 câu hỏi và mỗi câu có giải thích", () => {
        expect(t.questions.length).toBeGreaterThanOrEqual(8);
        for (const q of t.questions) expect(q.explanation.length, q.id).toBeGreaterThan(5);
      });

      it("có bài nghe chép đi kèm", () => {
        expect(DICTATIONS.some((d) => d.topicSlug === t.slug), t.slug).toBe(true);
      });

      it("điền từ / chia động từ có đúng một chỗ trống; trắc nghiệm không trùng phương án", () => {
        for (const q of t.questions) {
          if (q.type === "verb_form" || q.type === "gap_fill") {
            expect(q.prompt.split("___").length - 1, q.id).toBe(1);
          }
          if (q.type === "mcq") expect(new Set(q.options).size, q.id).toBe(q.options.length);
          if (q.type === "error_id") expect(q.segments.filter((s) => s.underline).length, q.id).toBeGreaterThanOrEqual(2);
        }
      });

      it("đáp án hợp lệ và tự chấm đúng chính nó", () => {
        for (const q of t.questions) {
          switch (q.type) {
            case "mcq":
              expect(q.answer, q.id).toBeLessThan(q.options.length);
              expect(gradeQuestion(q, { type: "mcq", choice: q.answer })).toBe(true);
              break;
            case "error_id":
              expect(q.segments[q.answer]?.underline, q.id).toBe(true);
              break;
            case "word_order": {
              // Các từ trong đáp án phải đúng bằng các từ đã cho.
              const given = [...q.words].map((w) => w.toLowerCase()).sort();
              const used = q.answers[0].replace(/[?.!]$/, " $&").split(/\s+/).filter(Boolean);
              const joinedGiven = q.words.join(" ").toLowerCase().split(/\s+/).sort();
              expect(used.map((w) => w.toLowerCase()).sort(), q.id).toEqual(joinedGiven);
              expect(given.length).toBe(q.words.length);
              break;
            }
            case "matching":
              expect([...q.pairs].sort(), q.id).toEqual(q.right.map((_, i) => i));
              expect(q.pairs.length).toBe(q.left.length);
              break;
            default:
              expect(q.answers.length, q.id).toBeGreaterThan(0);
              for (const a of q.answers) expect(gradeQuestion(q, { type: q.type, text: a } as never), `${q.id}: ${a}`).toBe(true);
          }
        }
      });
    });
  }
});

describe("dictations", () => {
  it("id không trùng, chủ điểm liên kết tồn tại", () => {
    expect(new Set(DICTATIONS.map((d) => d.id)).size).toBe(DICTATIONS.length);
    for (const d of DICTATIONS) if (d.topicSlug) expect(TOPIC_CONTENT[d.topicSlug], d.id).toBeDefined();
  });

  it("chép lại đúng nguyên câu thì được 100%", () => {
    for (const d of DICTATIONS) {
      for (const s of d.sentences) {
        const r = checkDictation(s.text, s.text);
        expect(r.passed, s.text).toBe(true);
        expect(r.accuracy).toBe(1);
      }
    }
  });
});
