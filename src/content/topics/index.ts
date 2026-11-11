import type { TopicContent } from "../types";
import { conditionalType1 } from "./conditional-type-1";
import { conditionalType2 } from "./conditional-type-2";
import { conditionalType3 } from "./conditional-type-3";
import { passivePresentPast } from "./passive-present-past";
import { pastSimple } from "./past-simple";
import { presentContinuous } from "./present-continuous";
import { presentSimple } from "./present-simple";
import { toBe } from "./to-be";

/** Chủ điểm đã có nội dung đầy đủ. Thêm chủ điểm mới: tạo file và đăng ký ở đây. */
const ALL: TopicContent[] = [
  toBe,
  presentSimple,
  presentContinuous,
  pastSimple,
  conditionalType1,
  conditionalType2,
  passivePresentPast,
  conditionalType3,
];

export const TOPIC_CONTENT: Record<string, TopicContent> = Object.fromEntries(ALL.map((t) => [t.slug, t]));

export function getTopicContent(slug: string): TopicContent | undefined {
  return TOPIC_CONTENT[slug];
}
