/** Hội thoại và bài đọc khoá tiếng Trung; mỗi bài cũng là một bài nghe chép. */
import { HSK1_DIALOGUES } from "./hsk1-dialogues";
import { HSK1_READINGS } from "./hsk1-readings";
import { HSK2_DIALOGUES, HSK2_READINGS } from "./hsk2-texts";
import { HSK3_DIALOGUES, HSK3_READINGS } from "./hsk3-texts";
import type { ZhTextLesson } from "./types";

export * from "./types";

export const ZH_DIALOGUES: ZhTextLesson[] = [...HSK1_DIALOGUES, ...HSK2_DIALOGUES, ...HSK3_DIALOGUES];
export const ZH_READINGS: ZhTextLesson[] = [...HSK1_READINGS, ...HSK2_READINGS, ...HSK3_READINGS];
export const ZH_TEXTS: ZhTextLesson[] = [...ZH_DIALOGUES, ...ZH_READINGS];
export const ZH_TEXT_MAP: Record<string, ZhTextLesson> = Object.fromEntries(ZH_TEXTS.map((t) => [t.id, t]));
