/**
 * Kết hợp danh mục + nội dung + tiến độ để tính lộ trình học.
 * Hàm thuần — dùng được cả ở server và client.
 */
import { CATALOG, topicsByLevel } from "@/content/catalog";
import { dictationsForTopic } from "@/content/dictations";
import { TOPIC_CONTENT } from "@/content/topics";
import type { LevelCode, TopicMeta } from "@/content/types";
import { PASS_PERCENT, topicStatus, type ProgressState, type TopicStatus } from "./progress-calc";

export function isAvailable(slug: string): boolean {
  return slug in TOPIC_CONTENT;
}

export function hasDictation(slug: string): boolean {
  return dictationsForTopic(slug).length > 0;
}

export interface PathNode {
  meta: TopicMeta;
  available: boolean;
  status: TopicStatus;
  /** Khóa nhẹ: chưa học chủ điểm trước (vẫn mở được lý thuyết, có thể học vượt bằng quiz ≥ 80%). */
  locked: boolean;
  /** Chủ điểm nên học tiếp theo trong cấp này. */
  recommended: boolean;
}

/**
 * Khóa nhẹ (quyết định #2 trong PLAN.md):
 * chủ điểm có nội dung đầu tiên luôn mở; chủ điểm tiếp theo mở khi chủ điểm có nội dung
 * ngay trước đó hoàn thành, HOẶC người học đã đạt quiz ≥ 80% ở chính chủ điểm này (học vượt).
 */
export function buildLevelPath(level: LevelCode, progress: ProgressState): PathNode[] {
  const topics = topicsByLevel(level);
  let prevDone = true;
  let recommendedSet = false;
  return topics.map((meta) => {
    const available = isAvailable(meta.slug);
    const p = progress.topics[meta.slug];
    const status = available ? topicStatus(p, hasDictation(meta.slug)) : "new";
    const skipped = (p?.quizBest ?? 0) >= PASS_PERCENT;
    const locked = available && !prevDone && !skipped && status === "new";
    let recommended = false;
    if (available && !recommendedSet && status !== "done") {
      recommended = true;
      recommendedSet = true;
    }
    if (available) prevDone = status === "done";
    return { meta, available, status, locked, recommended };
  });
}

/** Chủ điểm nên học tiếp theo trên toàn bộ lộ trình. */
export function nextTopic(progress: ProgressState): TopicMeta | undefined {
  return CATALOG.find((t) => isAvailable(t.slug) && topicStatus(progress.topics[t.slug], hasDictation(t.slug)) !== "done");
}

export function levelStats(level: LevelCode, progress: ProgressState) {
  const topics = topicsByLevel(level);
  const available = topics.filter((t) => isAvailable(t.slug));
  const done = available.filter((t) => topicStatus(progress.topics[t.slug], hasDictation(t.slug)) === "done");
  return { total: topics.length, available: available.length, done: done.length };
}
