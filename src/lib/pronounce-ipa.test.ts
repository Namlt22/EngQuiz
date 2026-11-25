import { describe, expect, it } from "vitest";
import { pronounceScore, soundsByWord, wordStatus, type PronounceResult, type PronounceSound } from "./pronounce";
import { checkTaughtSound, soundForPhone } from "./pronounce-ipa";

const snd = (word: string, wordIndex: number, phone: string, status: PronounceSound["status"], heard = ""): PronounceSound => ({
  word,
  wordIndex,
  phone,
  lpr: status === "right" ? 4 : status === "unsure" ? 0 : -4,
  heard,
  status,
  scored: true,
});

const sheep = (vowel: PronounceSound["status"], tail: PronounceSound["status"] = "right"): PronounceResult => ({
  score: 80,
  sounds: [snd("Say", 0, "s", "right"), snd("sheep", 1, "ʃ", "right"), snd("sheep", 1, "iː", vowel, "ɪ"), snd("sheep", 1, "p", tail), snd("now", 2, "n", "right")],
});

describe("chấm âm đang học trong từ ví dụ IPA", () => {
  it("nhầm âm đang học (sheep → ship) → chưa đạt, chỉ ra âm bị đọc nhầm sang", () => {
    const r = checkTaughtSound(sheep("wrong"), "sheep", "iː");
    expect(r.ok).toBe(false);
    expect(r.heardAs?.symbol).toBe("ɪ");
    expect(r.sounds.map((s) => s.phone)).toEqual(["ʃ", "iː", "p"]);
  });

  it("lỗi ở âm khác không làm hỏng bài của âm đang học; âm chưa rõ vẫn đạt", () => {
    expect(checkTaughtSound(sheep("right", "wrong"), "sheep", "iː").ok).toBe(true);
    expect(checkTaughtSound(sheep("unsure"), "sheep", "iː").ok).toBe(true);
    expect(checkTaughtSound(sheep("right", "wrong"), "sheep", "p").ok).toBe(false);
  });

  it("không thấy từ → chưa đạt; âm vị espeak nối về ký hiệu trong bài", () => {
    expect(checkTaughtSound(sheep("right"), "ship", "ɪ").ok).toBe(false);
    expect(soundForPhone("ɪɹ")?.symbol).toBe("ɪə");
    expect(soundForPhone("oʊ")?.symbol).toBe("əʊ");
    expect(soundForPhone("θ")?.symbol).toBe("θ");
  });
});

describe("gom âm theo từ, điểm", () => {
  it("trạng thái từ = âm tệ nhất; còn âm sai thì dưới mức đạt", () => {
    const r = sheep("wrong");
    const words = soundsByWord(r);
    expect(words.map((w) => w.word)).toEqual(["Say", "sheep", "now"]);
    expect(wordStatus(words[1].sounds)).toBe("wrong");
    expect(wordStatus(words[0].sounds)).toBe("right");
    expect(pronounceScore({ ...r, score: 95 }, 80)).toBe(79);
    expect(pronounceScore({ ...sheep("unsure"), score: 70 }, 80)).toBe(80);
  });
});

describe("tên riêng Việt Nam không bị chấm", () => {
  it("lấy đúng các từ của tên", async () => {
    const { vietnameseNamesIn } = await import("./vi-names");
    expect(vietnameseNamesIn("My name is Linh. I live in Da Nang.")).toEqual(["Linh", "Da", "Nang"]);
    expect(vietnameseNamesIn("An apple a day.")).toEqual([]);
  });
});
