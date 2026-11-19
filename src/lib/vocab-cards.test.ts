import { describe, expect, it } from "vitest";
import { EN_VOCAB_TOPICS } from "@/content/vocab-en";
import { enVocabCard, zhVocabCard } from "./vocab-cards";

describe("thẻ ôn từ bộ từ chuẩn", () => {
  it("tiếng Anh: từ, IPA, nghĩa, ví dụ, từ loại và mục lưu Sổ tay", () => {
    const word = EN_VOCAB_TOPICS[0].words[0][0];
    const card = enVocabCard(word)!;
    expect(card.term).toBe(word);
    expect(card.reading).toBeTruthy();
    expect(card.meaning).toBeTruthy();
    expect(card.tag).toBeTruthy();
    expect(card.save).toMatchObject({ term: word, source: "vocab" });
    expect(card.checkReading).toBeUndefined();
  });

  it("tiếng Trung: pinyin, ghi chú biến điệu, chấm gõ pinyin", () => {
    const card = zhVocabCard("你好")!;
    expect(card.reading).toBe("nǐ hǎo");
    expect(card.notes?.some((n) => n.startsWith("đọc là"))).toBe(true);
    expect(card.checkReading!("ni3 hao3").correct).toBe(true);
    expect(card.checkReading!("ni3 hao4").correct).toBe(false);
  });

  it("từ không có trong bộ từ → không có thẻ", () => {
    expect(enVocabCard("zzz-not-a-word")).toBeNull();
    expect(zhVocabCard("龘")).toBeNull();
  });
});
