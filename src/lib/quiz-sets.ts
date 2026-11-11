/**
 * Các bộ đề Quiz (PLAN.md mục 4.3).
 *  - topic:<slug>     : 1 chủ điểm
 *  - cat:<category>   : gộp mọi chủ điểm cùng danh mục (vd tất cả câu điều kiện)
 *  - level:<code>     : tổng hợp toàn bộ chủ điểm của 1 cấp
 */
import { CATALOG, getTopicMeta } from "@/content/catalog";
import { CATEGORY_LABELS } from "@/content/levels";
import { TOPIC_CONTENT } from "@/content/topics";
import type { Category, LevelCode, Question } from "@/content/types";

export type QuizSetKind = "topic" | "category" | "level";

export interface QuizItem {
  question: Question;
  topicSlug: string;
}

export interface QuizSet {
  id: string;
  kind: QuizSetKind;
  title: string;
  subtitle: string;
  level?: LevelCode;
  items: QuizItem[];
}

function itemsOf(slugs: string[]): QuizItem[] {
  return slugs.flatMap((slug) => (TOPIC_CONTENT[slug]?.questions ?? []).map((question) => ({ question, topicSlug: slug })));
}

/** Trộn đều theo chủ điểm (round-robin) để bộ tổng hợp không dồn 1 chủ điểm ở đầu. */
function interleave(slugs: string[], limit: number): QuizItem[] {
  const buckets = slugs.map((s) => itemsOf([s]));
  const out: QuizItem[] = [];
  for (let i = 0; out.length < limit && buckets.some((b) => i < b.length); i++) {
    for (const b of buckets) if (b[i] && out.length < limit) out.push(b[i]);
  }
  return out;
}

const availableSlugs = () => CATALOG.filter((t) => t.slug in TOPIC_CONTENT);

export function topicSetId(slug: string) {
  return `topic-${slug}`;
}

export function listQuizSets(): QuizSet[] {
  const sets: QuizSet[] = [];
  const avail = availableSlugs();

  for (const level of ["A1", "A2", "B1", "B2", "C1"] as LevelCode[]) {
    const slugs = avail.filter((t) => t.level === level).map((t) => t.slug);
    if (slugs.length >= 2) {
      sets.push({
        id: `level-${level.toLowerCase()}`,
        kind: "level",
        level,
        title: `Tổng hợp ${level}`,
        subtitle: `${slugs.length} chủ điểm`,
        items: interleave(slugs, 20),
      });
    }
  }

  const cats = [...new Set(avail.map((t) => t.category))] as Category[];
  for (const cat of cats) {
    const slugs = avail.filter((t) => t.category === cat).map((t) => t.slug);
    if (slugs.length >= 2) {
      sets.push({
        id: `cat-${cat.toLowerCase()}`,
        kind: "category",
        title: `Tất cả: ${CATEGORY_LABELS[cat]}`,
        subtitle: slugs.map((s) => getTopicMeta(s)!.titleEn).join(" · "),
        items: interleave(slugs, 20),
      });
    }
  }

  for (const t of avail) {
    sets.push({
      id: topicSetId(t.slug),
      kind: "topic",
      level: t.level,
      title: t.title,
      subtitle: t.titleEn,
      items: itemsOf([t.slug]),
    });
  }
  return sets;
}

export function getQuizSet(id: string): QuizSet | undefined {
  return listQuizSets().find((s) => s.id === id);
}
