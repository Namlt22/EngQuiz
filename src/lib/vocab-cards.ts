/**
 * Một từ của bộ từ chuẩn (tiếng Anh A1–B2, HSK) → thẻ ôn cho CardSession.
 * Dùng chung cho trang Từ vựng và Ôn thẻ hôm nay để hai nơi hiện cùng một mặt thẻ.
 */
import type { Card } from "@/components/vocab/CardSession";
import { EN_POS_LABEL, getEnWord } from "@/content/vocab-en";
import { getHskWord } from "@/content/zh/vocab";
import { POS_LABEL, vocabVi } from "@/content/zh/vocab-vi";
import { applySandhi } from "@/core/pinyin";
import { gradeWordPinyin } from "@/core/zh-vocab-quiz";
import { progressActions } from "@/lib/progress";

const gradeOf = (word: string): Card["grade"] => (g) => progressActions.reviewWord(word, g);

export function enVocabCard(word: string): Card | null {
  const w = getEnWord(word);
  if (!w) return null;
  const [term, pos, ipa, vi, example] = w;
  return {
    id: `v:${word}`,
    term,
    meaning: vi,
    reading: ipa,
    example,
    tag: EN_POS_LABEL[pos],
    save: { term, meaning: vi, reading: ipa, example, source: "vocab" },
    grade: gradeOf(word),
  };
}

export function zhVocabCard(word: string): Card | null {
  const w = getHskWord(word);
  const vi = vocabVi(word);
  if (!w || !vi) return null;
  const spoken = applySandhi(w.hanzi, w.pinyin);
  const notes = [...(spoken !== w.pinyin ? [`đọc là ${spoken}`] : []), ...(vi[2] ? [`Hán-Việt: ${vi[2]}`] : [])];
  return {
    id: `v:${word}`,
    term: w.hanzi,
    meaning: vi[1],
    reading: w.pinyin,
    tag: POS_LABEL[vi[0]],
    ...(notes.length ? { notes } : {}),
    save: { term: w.hanzi, meaning: vi[1], reading: w.pinyin, source: "vocab" },
    checkReading: (typed) => gradeWordPinyin(word, typed),
    grade: gradeOf(word),
  };
}

export const vocabCard = (word: string, course: "en" | "zh") => (course === "zh" ? zhVocabCard(word) : enVocabCard(word));
