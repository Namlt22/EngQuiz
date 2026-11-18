/** Từ vựng tiếng Anh theo chủ đề A1–B2 (600 từ). Test: src/content/vocab-en/vocab-en.test.ts. */
import { EN_VOCAB_A1 } from "./a1";
import { EN_VOCAB_A2 } from "./a2";
import { EN_VOCAB_B1 } from "./b1";
import { EN_VOCAB_B2 } from "./b2";
import type { EnVocabTopic, EnWord } from "./types";

export * from "./types";

export const EN_VOCAB_TOPICS: EnVocabTopic[] = [...EN_VOCAB_A1, ...EN_VOCAB_A2, ...EN_VOCAB_B1, ...EN_VOCAB_B2];

/** Các cấp có từ vựng. */
export const EN_VOCAB_LEVELS = [...new Set(EN_VOCAB_TOPICS.map((t) => t.level))];

const BY_WORD = new Map<string, EnWord>(EN_VOCAB_TOPICS.flatMap((t) => t.words.map((w) => [w[0], w] as const)));
export const getEnWord = (word: string) => BY_WORD.get(word);
export const getEnTopic = (id: string) => EN_VOCAB_TOPICS.find((t) => t.id === id);
