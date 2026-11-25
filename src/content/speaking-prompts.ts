/**
 * Đề nói tự do, lấy từ các đơn vị của lộ trình (ROADMAP_UNITS[].prompts) để luyện nói và lộ trình dùng chung một bộ đề.
 * Server chỉ nhận id đề có trong danh sách này — không cho client gửi đề tùy ý lên AI.
 */
import { ROADMAP_UNITS, type RoadmapGoal } from "./roadmap-units";

export interface SpeakingPrompt {
  id: string;
  unitId: string;
  unitTitle: string;
  goal: RoadmapGoal;
  text: string;
}

export const GOAL_LABELS: Record<RoadmapGoal, string> = {
  daily: "Giao tiếp hằng ngày",
  work: "Công việc",
  travel: "Du lịch",
};

export const SPEAKING_PROMPTS: readonly SpeakingPrompt[] = ROADMAP_UNITS.flatMap((unit) =>
  (Object.entries(unit.prompts) as [RoadmapGoal, string[] | undefined][]).flatMap(([goal, texts]) =>
    (texts ?? []).map((text, i) => ({ id: `${unit.id}-${goal}-${i + 1}`, unitId: unit.id, unitTitle: unit.title, goal, text })),
  ),
);

const BY_ID: ReadonlyMap<string, SpeakingPrompt> = new Map(SPEAKING_PROMPTS.map((p) => [p.id, p]));

export function getSpeakingPrompt(id: string): SpeakingPrompt | undefined {
  return BY_ID.get(id);
}

/** Id đề theo đúng câu chữ (lộ trình hiển thị câu chữ, trang luyện nói cần id). */
export function promptIdByText(text: string, goal?: RoadmapGoal): string | undefined {
  return SPEAKING_PROMPTS.find((p) => p.text === text && (!goal || p.goal === goal))?.id ?? SPEAKING_PROMPTS.find((p) => p.text === text)?.id;
}
