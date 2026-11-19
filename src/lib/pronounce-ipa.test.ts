import { describe, expect, it } from "vitest";
import type { PronounceResult } from "./pronounce";
import { checkTaughtSound } from "./pronounce-ipa";

const result = (phones: { expected: string; heard: string; confidence: number }[], word = "sheep"): PronounceResult => ({
  score: 80,
  transcript: "",
  errors: [],
  words: [{ word: "say", expected: [], heard: [], phones: [] }, { word, expected: phones.map((p) => p.expected), heard: [], phones }],
});

describe("chấm âm đang học trong từ ví dụ IPA", () => {
  it("nhầm âm đang học (sheep → ship) → chưa đạt, chỉ ra âm", () => {
    const r = result([{ expected: "ʃ", heard: "ʃ", confidence: 0 }, { expected: "i", heard: "ɪ", confidence: 0.38 }, { expected: "p", heard: "p", confidence: 0 }]);
    expect(checkTaughtSound(r, "sheep", "iː")).toEqual({ ok: false, expected: "i", heard: "ɪ" });
  });

  it("lỗi ở âm khác (t cuối thành âm vỗ) không làm hỏng bài của âm /ɒ/", () => {
    const r = result([{ expected: "p", heard: "p", confidence: 0 }, { expected: "ɑ", heard: "ɑ", confidence: 0 }, { expected: "t", heard: "ɾ", confidence: 0.63 }], "pot");
    expect(checkTaughtSound(r, "pot", "ɒ").ok).toBe(true);
    expect(checkTaughtSound(r, "pot", "t").ok).toBe(false);
  });

  it("độ tin cậy thấp → không báo; không thấy từ → chưa đạt", () => {
    const r = result([{ expected: "i", heard: "ɪ", confidence: 0.1 }]);
    expect(checkTaughtSound(r, "sheep", "iː").ok).toBe(true);
    expect(checkTaughtSound(r, "ship", "ɪ").ok).toBe(false);
  });
});
