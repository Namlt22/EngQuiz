import { describe, expect, it } from "vitest";
import { charSyllables, outOfLevel } from "@/core/zh-sentence";
import { ZH_TEXTS } from "./texts";

describe("hội thoại và bài đọc tiếng Trung", () => {
  it("id không trùng (bài và câu hỏi)", () => {
    const ids = ZH_TEXTS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    const q = ZH_TEXTS.flatMap((t) => t.questions.map((x) => x.id));
    expect(new Set(q).size).toBe(q.length);
  });

  it("mọi câu chỉ dùng từ trong phạm vi cấp của bài", () => {
    for (const t of ZH_TEXTS) {
      for (const s of [t.zhTitle, ...t.lines.map((l) => l.zh)]) expect.soft(outOfLevel(s, t.level), `${t.id}: ${s}`).toEqual([]);
    }
  });

  it("mỗi chữ có âm tiết (để chấm nghe chép pinyin)", () => {
    for (const t of ZH_TEXTS) {
      for (const l of t.lines) for (const c of charSyllables(l.zh)) expect(c.syllable, `${t.id}: ${c.char}`).not.toBe("");
    }
  });

  it("hội thoại: mọi lượt lời có vai đã khai báo; bài đọc không có vai", () => {
    for (const t of ZH_TEXTS) {
      for (const l of t.lines) {
        if (t.kind === "dialogue") expect(t.speakers?.[l.speaker ?? ""], `${t.id}: ${l.zh}`).toBeDefined();
        else expect(l.speaker).toBeUndefined();
      }
    }
  });

  it("câu hỏi có ít nhất 3 lựa chọn khác nhau", () => {
    for (const t of ZH_TEXTS) {
      expect(t.questions.length, t.id).toBeGreaterThanOrEqual(3);
      for (const q of t.questions) {
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(3);
        expect(new Set(q.options).size, q.id).toBe(q.options.length);
      }
    }
  });
});
