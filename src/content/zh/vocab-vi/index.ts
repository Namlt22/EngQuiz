/**
 * Nghĩa tiếng Việt của từ vựng HSK — mỗi cấp một file, thêm dần theo lộ trình (docs/PLAN-ZH.md mục 7).
 */
import type { HskLevel } from "../hsk-levels";
import { HSK1_VI } from "./hsk1";
import { HSK2_VI } from "./hsk2";
import { HSK3_VI } from "./hsk3";
import { HSK4_VI_A } from "./hsk4-a";
import { HSK4_VI_B } from "./hsk4-b";
import type { VocabEntry } from "./types";

export * from "./types";

const HSK4_VI: Record<string, VocabEntry> = { ...HSK4_VI_A, ...HSK4_VI_B };

/** Cấp đã có nghĩa tiếng Việt đầy đủ. */
export const VI_LEVELS: HskLevel[] = [1, 2, 3, 4];

const ALL: Record<string, VocabEntry> = { ...HSK1_VI, ...HSK2_VI, ...HSK3_VI, ...HSK4_VI };

/** Dữ liệu nghĩa của từng cấp (để test đối chiếu đúng danh sách từ). */
export const VI_BY_LEVEL: Partial<Record<HskLevel, Record<string, VocabEntry>>> = { 1: HSK1_VI, 2: HSK2_VI, 3: HSK3_VI, 4: HSK4_VI };

export const vocabVi = (hanzi: string): VocabEntry | undefined => ALL[hanzi];
