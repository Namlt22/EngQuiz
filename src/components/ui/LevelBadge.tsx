import { LEVEL_MAP } from "@/content/levels";
import type { LevelCode } from "@/content/types";

export function LevelBadge({ level, className = "" }: { level: LevelCode; className?: string }) {
  const info = LEVEL_MAP[level];
  return <span className={`chip ${info?.badge ?? ""} ${className}`}>{level}</span>;
}
