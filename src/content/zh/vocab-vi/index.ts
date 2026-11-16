/**
 * Nghĩa tiếng Việt của từ vựng HSK — mỗi cấp một file, thêm dần theo lộ trình (docs/PLAN-ZH.md mục 7).
 */
import type { HskLevel } from "../hsk-levels";
import { HSK1_VI } from "./hsk1";
import type { VocabEntry } from "./types";

export * from "./types";

/** Cấp đã có nghĩa tiếng Việt đầy đủ. */
export const VI_LEVELS: HskLevel[] = [1];

const ALL: Record<string, VocabEntry> = { ...HSK1_VI };

export const vocabVi = (hanzi: string): VocabEntry | undefined => ALL[hanzi];
