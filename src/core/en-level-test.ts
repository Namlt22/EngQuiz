/**
 * Chấm bài kiểm tra trình độ.
 * - Mỗi cấp 4 câu; đúng ≥ 3 là "qua" cấp đó.
 * - Trượt một cấp thì dừng bài (không bắt người mới làm câu C1).
 * - Trình độ ước tính = cấp cao nhất qua liên tiếp từ A1; nên bắt đầu học ở cấp ngay sau đó.
 */
import type { LevelCode } from "@/content/types";

export type TestLevel = Exclude<LevelCode, "C2">;
export const TEST_LEVELS: TestLevel[] = ["A1", "A2", "B1", "B2", "C1"];
export const PASS_PER_LEVEL = 3;

export interface LevelAnswer {
  level: TestLevel;
  correct: boolean;
}

export interface Placement {
  /** Cấp đã nắm được; null = chưa đạt A1 (người mới bắt đầu). */
  estimate: TestLevel | null;
  /** Cấp nên học tiếp. */
  start: TestLevel;
  /** Số câu đúng / đã làm theo từng cấp. */
  byLevel: Partial<Record<TestLevel, { correct: number; total: number }>>;
}

function tally(answers: readonly LevelAnswer[]) {
  const by: Placement["byLevel"] = {};
  for (const a of answers) {
    const t = (by[a.level] ??= { correct: 0, total: 0 });
    t.total++;
    if (a.correct) t.correct++;
  }
  return by;
}

/** Dừng khi vừa làm xong trọn một cấp mà không qua. */
export function shouldStop(answers: readonly LevelAnswer[], perLevel = 4): boolean {
  if (!answers.length) return false;
  const last = answers[answers.length - 1].level;
  const t = tally(answers)[last]!;
  return t.total >= perLevel && t.correct < PASS_PER_LEVEL;
}

export function placement(answers: readonly LevelAnswer[]): Placement {
  const byLevel = tally(answers);
  let estimate: TestLevel | null = null;
  for (const lv of TEST_LEVELS) {
    const t = byLevel[lv];
    if (t && t.correct >= PASS_PER_LEVEL) estimate = lv;
    else break;
  }
  const i = estimate ? TEST_LEVELS.indexOf(estimate) : -1;
  const start = TEST_LEVELS[Math.min(i + 1, TEST_LEVELS.length - 1)];
  return { estimate, start, byLevel };
}
