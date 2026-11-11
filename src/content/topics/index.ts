import type { TopicContent } from "../types";
import { A1_STRUCTURE_TOPICS } from "./a1-structures";
import { A1_WORD_TOPICS } from "./a1-words";
import { A2_STRUCTURE_TOPICS } from "./a2-structures";
import { A2_TENSE_TOPICS } from "./a2-tenses";
import { conditionalType1 } from "./conditional-type-1";
import { conditionalType2 } from "./conditional-type-2";
import { conditionalType3 } from "./conditional-type-3";
import { passivePresentPast } from "./passive-present-past";
import { pastSimple } from "./past-simple";
import { presentContinuous } from "./present-continuous";
import { presentSimple } from "./present-simple";
import { toBe } from "./to-be";

/**
 * Chủ điểm đã có nội dung đầy đủ. Thêm chủ điểm mới: tạo file (một chủ điểm hoặc một nhóm)
 * và đăng ký ở đây. Thứ tự hiển thị lấy theo catalog.ts, không theo mảng này.
 */
const ALL: TopicContent[] = [
  toBe,
  presentSimple,
  presentContinuous,
  pastSimple,
  conditionalType1,
  conditionalType2,
  passivePresentPast,
  conditionalType3,
  ...A1_WORD_TOPICS,
  ...A1_STRUCTURE_TOPICS,
  ...A2_TENSE_TOPICS,
  ...A2_STRUCTURE_TOPICS,
];

export const TOPIC_CONTENT: Record<string, TopicContent> = Object.fromEntries(ALL.map((t) => [t.slug, t]));

export function getTopicContent(slug: string): TopicContent | undefined {
  return TOPIC_CONTENT[slug];
}
