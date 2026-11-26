import { describe, expect, it } from "vitest";
import { isValidSrs } from "@/core/srs";
import { EN_POS_LABEL, EN_VOCAB_TOPICS } from "./index";

const allWords = EN_VOCAB_TOPICS.flatMap((t) => t.words.map((w) => ({ topic: t.id, w })));

describe("từ vựng tiếng Anh theo chủ đề", () => {
  it("hơn 1 000 từ, mỗi chủ đề 14–33 từ, id chủ đề không trùng", () => {
    expect(allWords.length).toBeGreaterThan(1000);
    for (const t of EN_VOCAB_TOPICS) {
      expect(t.words.length, t.id).toBeGreaterThanOrEqual(14);
      expect(t.words.length, t.id).toBeLessThanOrEqual(33);
    }
    const ids = EN_VOCAB_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mỗi từ chỉ xuất hiện một lần (từ là khoá lưu tiến độ ôn)", () => {
    const seen = new Map<string, string>();
    const dup: string[] = [];
    for (const { topic, w } of allWords) {
      if (seen.has(w[0])) dup.push(`${w[0]} (${seen.get(w[0])} / ${topic})`);
      seen.set(w[0], topic);
    }
    expect(dup).toEqual([]);
  });

  it("từ là khoá hợp lệ của bộ lưu ôn tập; IPA trong /…/; có từ loại, nghĩa, câu ví dụ", () => {
    for (const { w } of allWords) {
      const [word, pos, ipa, vi, example] = w;
      expect(isValidSrs(`${word},1,1`), word).toBe(true);
      expect(EN_POS_LABEL[pos], word).toBeDefined();
      expect(ipa, word).toMatch(/^\/[^/]+\/$/);
      expect(vi.trim().length, word).toBeGreaterThan(1);
      expect(example, word).toMatch(/^[A-Z].*[.?!]$/);
    }
  });

  it("câu ví dụ có chứa từ (hoặc dạng biến đổi của từ)", () => {
    const missing: string[] = [];
    for (const { w } of allWords) {
      const [word, , , , example] = w;
      const ex = example.toLowerCase();
      // Mỗi từ của cụm: lấy 3–4 chữ đầu để chấp nhận dạng biến đổi (go → goes, child → children, teeth…).
      // "be" trong cụm (be good at) thường được chia thành am / is / are / 'm nên bỏ qua.
      const ok = word.split(" ").filter((part) => part !== "be").every((part) => ex.includes(part.slice(0, Math.min(4, Math.max(3, part.length - 2)))));
      if (!ok) missing.push(`${word}: ${example}`);
    }
    expect(missing).toEqual([]);
  });
});
