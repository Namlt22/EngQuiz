import { describe, expect, it } from "vitest";
import { PINYIN_LESSON_MAP } from "@/content/zh/pinyin-lessons";
import { MAX_TRIES, PAIR_ROUNDS, TONE_ROUNDS, buildDrill, drillPercent, itemDone, scoreSpoken } from "./pinyin-lesson";

/** RNG cố định để test lặp lại được. */
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const READINGS = new Map([
  ["妈", new Set(["mā", "ma"])],
  ["麻", new Set(["má"])],
  ["马", new Set(["mǎ"])],
  ["码", new Set(["mǎ"])],
  ["你", new Set(["nǐ"])],
  ["好", new Set(["hǎo", "hào"])],
]);

describe("bài luyện tai", () => {
  it("cặp dễ nhầm: đủ số vòng, đáp án chỉ đúng âm được đọc", () => {
    const rounds = buildDrill(PINYIN_LESSON_MAP["initials-zh-ch-sh-r"], seeded());
    expect(rounds).toHaveLength(PAIR_ROUNDS);
    for (const r of rounds) {
      expect(r.options).toHaveLength(2);
      expect(r.explain).toContain(r.say!);
      expect(r.explain).toContain(r.options[r.answer]);
    }
  });

  it("thanh điệu: mỗi thanh xuất hiện đều, 4 lựa chọn theo thứ tự thanh 1–4", () => {
    const rounds = buildDrill(PINYIN_LESSON_MAP.tones, seeded(7));
    expect(rounds).toHaveLength(TONE_ROUNDS);
    const counts = [0, 0, 0, 0];
    rounds.forEach((r) => counts[r.answer]++);
    expect(counts).toEqual([2, 2, 2, 2]);
  });

  it("trắc nghiệm soạn sẵn giữ đủ câu", () => {
    const lesson = PINYIN_LESSON_MAP.sandhi;
    expect(buildDrill(lesson, seeded())).toHaveLength(lesson.drill.kind === "mcq" ? lesson.drill.rounds.length : 0);
  });

  it("tính phần trăm", () => {
    expect(drillPercent(5, 6)).toBe(83);
    expect(drillPercent(0, 0)).toBe(0);
  });
});

describe("chấm đọc theo", () => {
  const ma3 = { pinyin: "mǎ", hanzi: "马", vi: "ngựa" };

  it("đúng chữ mẫu → 100", () => {
    expect(scoreSpoken(ma3, ["马"], READINGS)).toBe(100);
  });

  it("chữ khác nhưng cùng âm và thanh (đồng âm) → 100", () => {
    expect(scoreSpoken(ma3, ["码"], READINGS)).toBe(100);
  });

  it("đúng âm sai thanh → 50, sai hẳn → 0", () => {
    expect(scoreSpoken(ma3, ["麻"], READINGS)).toBe(50);
    expect(scoreSpoken(ma3, ["你"], READINGS)).toBe(0);
  });

  it("từ hai âm tiết chấm từng âm", () => {
    const nihao = { pinyin: "nǐ hǎo", hanzi: "你好", vi: "xin chào" };
    expect(scoreSpoken(nihao, ["你好啊"], READINGS)).toBe(100);
    expect(scoreSpoken(nihao, ["你码"], READINGS)).toBe(50);
  });

  it("một âm xong khi đạt hoặc đã thử đủ số lần", () => {
    expect(itemDone(undefined)).toBe(false);
    expect(itemDone({ best: 80, tries: 1 })).toBe(true);
    expect(itemDone({ best: 50, tries: MAX_TRIES })).toBe(true);
    expect(itemDone({ best: 50, tries: 1 })).toBe(false);
  });
});
