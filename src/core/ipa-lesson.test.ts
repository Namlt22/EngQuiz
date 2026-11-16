import { describe, expect, it } from "vitest";
import { IPA_MAP, IPA_SOUNDS } from "@/content/ipa";
import { LISTEN_ROUNDS, MAX_WORD_TRIES, buildListenRounds, contrastSound, listenPercent, wordDone } from "./ipa-lesson";

/** rng cố định để test lặp lại được. */
const seq = (...xs: number[]) => {
  let i = 0;
  return () => xs[i++ % xs.length];
};

describe("buildListenRounds", () => {
  it("âm có cặp tối thiểu: mọi vòng dùng đúng cặp đó (sheep / ship)", () => {
    const rounds = buildListenRounds(IPA_MAP["i-long"], seq(0.9, 0.1));
    expect(rounds).toHaveLength(LISTEN_ROUNDS);
    for (const r of rounds) expect(r.options.map((o) => o.word).sort()).toEqual(["sheep", "ship"]);
  });

  it("từ được đọc lên chia đều: nửa có âm đang học, nửa của âm dễ nhầm", () => {
    const rounds = buildListenRounds(IPA_MAP["i-long"], seq(0.2, 0.7, 0.4));
    const targets = rounds.map((r) => r.options[r.answer].word);
    expect(targets.filter((w) => w === "sheep")).toHaveLength(LISTEN_ROUNDS / 2);
  });

  it("mọi âm trong bảng đều dựng được bài: hai lựa chọn khác nhau, đáp án hợp lệ", () => {
    for (const s of IPA_SOUNDS) {
      for (const r of buildListenRounds(s, seq(0.3, 0.8))) {
        expect(r.options[0].word, s.id).not.toBe(r.options[1].word);
        expect([0, 1]).toContain(r.answer);
      }
    }
  });

  it("âm không có cặp: so với một âm khác cùng nhóm", () => {
    const lonely = IPA_SOUNDS.find((s) => !s.pair)!;
    const other = contrastSound(lonely, seq(0.5));
    expect(other.id).not.toBe(lonely.id);
    expect(other.group).toBe(lonely.group);
  });
});

describe("tiêu chí xong", () => {
  it("từ đọc đạt, hoặc đã thử đủ số lần, thì xong", () => {
    expect(wordDone(undefined, 80)).toBe(false);
    expect(wordDone({ best: 85, tries: 1 }, 80)).toBe(true);
    expect(wordDone({ best: 40, tries: MAX_WORD_TRIES - 1 }, 80)).toBe(false);
    expect(wordDone({ best: 40, tries: MAX_WORD_TRIES }, 80)).toBe(true);
  });

  it("listenPercent làm tròn, không chia cho 0", () => {
    expect(listenPercent(5, 6)).toBe(83);
    expect(listenPercent(0, 0)).toBe(0);
  });
});
