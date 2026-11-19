import { describe, expect, it } from "vitest";
import { outOfLevel, tokenize } from "@/core/zh-sentence";
import { ZH_GRAMMAR, type ZhGrammarLesson } from "./grammar";

const HAN = /\p{Script=Han}/u;

/** Mọi câu tiếng Trung (tách từ) xuất hiện trong bài. */
function sentences(l: ZhGrammarLesson): string[] {
  const out: string[] = [];
  for (const b of l.blocks) {
    if (b.type === "formula") b.rows.forEach((r) => r.example && out.push(r.example));
    if (b.type === "usage") b.examples.forEach((e) => out.push(e.zh));
    if (b.type === "mistakes") b.items.forEach((m) => out.push(m.wrong, m.right));
  }
  for (const q of l.quiz) {
    if (q.type === "order") out.push(...q.answers);
    else {
      if (q.zhPrompt) out.push(q.prompt.replace(/___/g, ""));
      q.options.filter((o) => HAN.test(o)).forEach((o) => out.push(o));
    }
  }
  return out;
}

describe("ngữ pháp tiếng Trung", () => {
  it("id bài và id câu hỏi không trùng", () => {
    const ids = ZH_GRAMMAR.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    const qids = ZH_GRAMMAR.flatMap((l) => l.quiz.map((q) => q.id));
    expect(new Set(qids).size).toBe(qids.length);
  });

  it("mọi câu chỉ dùng từ trong phạm vi cấp của bài (hoặc tên riêng ghi kèm pinyin)", () => {
    for (const l of ZH_GRAMMAR) {
      for (const s of sentences(l)) expect.soft(outOfLevel(s, l.level), `${l.id}: ${s}`).toEqual([]);
    }
  });

  it("câu sai và câu đúng trong mục lỗi thường gặp phải khác nhau khi hiển thị", () => {
    for (const l of ZH_GRAMMAR) {
      for (const b of l.blocks) {
        if (b.type !== "mistakes") continue;
        for (const m of b.items) {
          const show = (s: string) => tokenize(s).map((t) => t.text).join("");
          expect(show(m.wrong), `${l.id}: ${m.wrong}`).not.toBe(show(m.right));
        }
      }
    }
  });

  it("trắc nghiệm: đáp án hợp lệ, lựa chọn không trùng; câu sắp xếp có đáp án", () => {
    for (const l of ZH_GRAMMAR) {
      expect(l.quiz.length, l.id).toBeGreaterThanOrEqual(5);
      for (const q of l.quiz) {
        if (q.type === "mcq") {
          expect(q.answer, q.id).toBeLessThan(q.options.length);
          expect(new Set(q.options).size, q.id).toBe(q.options.length);
          if (q.zhPrompt) expect(q.prompt, q.id).toContain("___");
        } else {
          expect(q.answers.length, q.id).toBeGreaterThan(0);
          // Mọi đáp án sắp xếp phải dùng cùng bộ từ (người học sắp xếp từ cùng một bộ thẻ).
          const bag = (s: string) => tokenize(s).filter((t) => t.kind !== "punct").map((t) => t.text).sort().join(" ");
          const first = bag(q.answers[0]);
          for (const a of q.answers) if (bag(a) !== first) expect.soft(bag(a), `${q.id}: đáp án khác bộ từ`).toBe(first);
        }
      }
    }
  });

  it("HSK 1 có 12 bài", () => {
    expect(ZH_GRAMMAR.filter((l) => l.level === 1)).toHaveLength(12);
  });
});
