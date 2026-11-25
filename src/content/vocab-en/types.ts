/** Từ vựng tiếng Anh theo chủ đề (thẻ ôn lặp lại ngắt quãng). EngQuiz tự soạn. */
import type { LevelCode } from "../types";

export type EnPos = "n" | "v" | "adj" | "adv" | "prep" | "pron" | "conj" | "phrase";

export const EN_POS_LABEL: Record<EnPos, string> = {
  n: "danh từ",
  v: "động từ",
  adj: "tính từ",
  adv: "trạng từ",
  prep: "giới từ",
  pron: "đại từ",
  conj: "liên từ",
  phrase: "cụm từ",
};

/**
 * [từ, từ loại, phiên âm IPA (giọng Anh, trong dấu /…/), nghĩa tiếng Việt, câu ví dụ].
 * Từ viết thường (là khoá lưu tiến độ ôn — src/core/srs.ts), trừ khi bắt buộc viết hoa thì không đưa vào danh sách.
 */
export type EnWord = [word: string, pos: EnPos, ipa: string, vi: string, example: string];

export interface EnVocabTopic {
  id: string;
  level: LevelCode;
  title: string;
  emoji: string;
  words: EnWord[];
}
