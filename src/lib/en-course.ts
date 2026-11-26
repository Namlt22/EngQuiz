/**
 * Khoá A1 20 ngày (khoá tiếng Anh): ghép nội dung một ngày từ các nguồn có sẵn.
 * - Từ vựng: từ trong src/content/vocab-en.
 * - Ngữ pháp: lý thuyết rút gọn + câu luyện lấy từ chủ điểm ngữ pháp tương ứng.
 * Logic thuần để test được; tiến độ lưu ở src/lib/en-extra-store.ts.
 */
import { EN_COURSE_DAYS, type CourseDay } from "@/content/en-course";
import { getTopicMeta } from "@/content/catalog";
import { TOPIC_CONTENT } from "@/content/topics";
import type { Question, TheoryBlock } from "@/content/types";
import { getEnWord } from "@/content/vocab-en";
import { toGameWord, type GameWord } from "@/core/en-vocab-games";
import { EN_COURSE_PARTS, type EnCoursePart, type EnExtraState } from "./en-extra-store";

/** Dạng câu gọn, hợp làm nhanh trong buổi học (bỏ viết lại câu, nối). */
const PRACTICE_TYPES = new Set<Question["type"]>(["mcq", "gap_fill", "verb_form", "error_id", "word_order"]);
export const LESSON_QUESTIONS = 5;

export function dayWords(day: CourseDay): GameWord[] {
  return day.words.flatMap((w) => {
    const e = getEnWord(w);
    return e ? [toGameWord(e)] : [];
  });
}

export interface DayGrammar {
  topics: { slug: string; title: string; titleEn: string }[];
  /** Lý thuyết rút gọn (ngày ôn tập: rỗng, chỉ dẫn link về từng chủ điểm). */
  blocks: TheoryBlock[];
  questions: Question[];
}

const practiceQuestions = (slug: string) => (TOPIC_CONTENT[slug]?.questions ?? []).filter((q) => PRACTICE_TYPES.has(q.type));

export function dayGrammar(day: CourseDay): DayGrammar {
  const topics = day.grammar.map((slug) => {
    const m = getTopicMeta(slug)!;
    return { slug, title: m.title, titleEn: m.titleEn };
  });
  if (!day.review) {
    const slug = day.grammar[0];
    const theory = TOPIC_CONTENT[slug]?.theory ?? [];
    const pick = (types: TheoryBlock["type"][]) => theory.find((b) => types.includes(b.type));
    const blocks = [pick(["summary"]), pick(["formula", "table"]), pick(["usage"])].filter((b): b is TheoryBlock => Boolean(b));
    return { topics, blocks, questions: practiceQuestions(slug).slice(0, LESSON_QUESTIONS) };
  }
  // Ôn tập: 2 câu mỗi chủ điểm, ưu tiên câu chưa dùng trong ngày học chủ điểm đó.
  const questions = day.grammar.flatMap((slug) => {
    const all = practiceQuestions(slug);
    return [...all.slice(LESSON_QUESTIONS), ...all].slice(0, 2);
  });
  return { topics, blocks: [], questions };
}

/* ---------------- Tiến độ & mở khoá ---------------- */

export const isDayDone = (s: EnExtraState, dayId: string) => EN_COURSE_PARTS.every((k) => s.course[dayId]?.[k] !== undefined);
export const partsDone = (s: EnExtraState, dayId: string): EnCoursePart[] => EN_COURSE_PARTS.filter((k) => s.course[dayId]?.[k] !== undefined);

/** Ngày 1 luôn mở; ngày sau mở khi ngày trước đã xong cả 6 phần. */
export const isDayUnlocked = (s: EnExtraState, day: number) => day <= 1 || isDayDone(s, `A1-${day - 1}`);

/** Ngày nên học tiếp: ngày đầu tiên chưa xong. */
export const nextDay = (s: EnExtraState): CourseDay => EN_COURSE_DAYS.find((d) => !isDayDone(s, d.id)) ?? EN_COURSE_DAYS[EN_COURSE_DAYS.length - 1];
