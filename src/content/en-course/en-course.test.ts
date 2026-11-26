import { describe, expect, it } from "vitest";
import { EN_COURSE_DAYS, EN_COURSE_UNITS } from "./index";
import { getEnWord } from "../vocab-en";
import { TOPIC_CONTENT } from "../topics";
import { CATALOG } from "../catalog";
import { dayGrammar, dayWords, isDayUnlocked, nextDay } from "@/lib/en-course";
import type { EnExtraState } from "@/lib/en-extra-store";

describe("khoá A1 20 ngày", () => {
  it("4 chủ đề × 5 ngày, đánh số 1–20, ôn tập mỗi ngày thứ 5", () => {
    expect(EN_COURSE_UNITS).toHaveLength(4);
    expect(EN_COURSE_DAYS.map((d) => d.day)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    for (const d of EN_COURSE_DAYS) expect(d.id).toBe(`A1-${d.day}`);
    expect(EN_COURSE_DAYS.filter((d) => d.review).map((d) => d.day)).toEqual([5, 10, 15, 20]);
  });

  it("dạy mỗi chủ điểm ngữ pháp A1 đúng một lần", () => {
    const taught = EN_COURSE_DAYS.filter((d) => !d.review).map((d) => d.grammar[0]);
    const a1 = CATALOG.filter((t) => t.level === "A1" && TOPIC_CONTENT[t.slug]).map((t) => t.slug);
    expect([...taught].sort()).toEqual([...a1].sort());
  });

  it.each(EN_COURSE_DAYS.map((d) => [d.id, d] as const))("%s đủ 7 phần và hợp lệ", (_id, d) => {
    expect(d.words).toHaveLength(8);
    for (const w of d.words) expect(getEnWord(w), `từ "${w}" phải có trong vocab-en`).toBeDefined();
    expect(dayWords(d)).toHaveLength(8);
    for (const slug of d.grammar) expect(TOPIC_CONTENT[slug], slug).toBeDefined();

    const g = dayGrammar(d);
    expect(g.questions.length).toBeGreaterThanOrEqual(5);
    if (!d.review) expect(g.blocks.length).toBeGreaterThan(0);

    expect(d.listening.lines.length).toBeGreaterThanOrEqual(5);
    for (const [speaker, text] of d.listening.lines) {
      expect(speaker.length).toBeGreaterThan(0);
      expect(text).toMatch(/[.!?]$/);
    }
    for (const q of [...d.listening.questions, ...d.reading.questions]) {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
    expect(d.listening.questions.length).toBeGreaterThanOrEqual(4);
    expect(d.reading.questions.length).toBeGreaterThanOrEqual(3);
    expect(d.reading.text.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    expect(d.writing).toHaveLength(6);
    expect(d.speaking).toHaveLength(5);
    for (const w of [...d.writing, ...d.speaking]) expect(w.example).toMatch(/^[A-Z].*[.!?]$/);
  });
});

describe("mở khoá ngày học", () => {
  it("ngày 1 luôn mở; ngày sau mở khi ngày trước xong cả 6 phần", () => {
    const s: EnExtraState = { version: 1, games: {}, course: {} };
    expect(isDayUnlocked(s, 1)).toBe(true);
    expect(isDayUnlocked(s, 2)).toBe(false);
    s.course["A1-1"] = { words: 80, grammar: 60, listening: 100, reading: 100, writing: 100 };
    expect(isDayUnlocked(s, 2)).toBe(false);
    s.course["A1-1"].speaking = 100;
    expect(isDayUnlocked(s, 2)).toBe(true);
    expect(nextDay(s).day).toBe(2);
  });
});
