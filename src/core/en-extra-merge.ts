/**
 * Gộp tiến độ các tính năng tiếng Anh mới (game, kiểm tra trình độ, khoá A1) giữa trình duyệt và tài khoản.
 * Không bao giờ làm mất thành tích: điểm lấy cao nhất; kết quả kiểm tra trình độ lấy lần làm sau cùng.
 * Giao hoán và idempotent (có test) để gộp lặp lại hay hai máy cùng gửi đều ra cùng kết quả.
 */
import type { LevelCode } from "@/content/types";

export interface EnExtraData {
  version: 1;
  games: Record<string, number>;
  placement?: { estimate: LevelCode | null; start: LevelCode; at: number };
  course: Record<string, Partial<Record<"words" | "grammar" | "listening" | "reading" | "writing" | "speaking", number>>>;
}

const maxRecord = <K extends string>(a: Partial<Record<K, number>>, b: Partial<Record<K, number>>) => {
  const out: Partial<Record<K, number>> = { ...a };
  for (const [k, v] of Object.entries(b) as [K, number][]) out[k] = Math.max(out[k] ?? 0, v);
  return out;
};

export function mergeEnExtra(a: EnExtraData | undefined, b: EnExtraData | undefined): EnExtraData | undefined {
  if (!a) return b;
  if (!b) return a;
  const course: EnExtraData["course"] = { ...a.course };
  for (const [day, parts] of Object.entries(b.course)) course[day] = maxRecord(course[day] ?? {}, parts);
  const placement =
    a.placement && b.placement
      ? a.placement.at > b.placement.at || (a.placement.at === b.placement.at && a.placement.start >= b.placement.start)
        ? a.placement
        : b.placement
      : (a.placement ?? b.placement);
  return { version: 1, games: maxRecord(a.games, b.games) as Record<string, number>, course, ...(placement ? { placement } : {}) };
}
