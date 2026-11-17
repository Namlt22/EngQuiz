/** Bài thi thử của khoá tiếng Trung, theo id (hsk1, hsk2…). */
import { HSK1_MOCK } from "./hsk1";
import { HSK2_MOCK } from "./hsk2";
import type { MockTest } from "./hsk1";

export type { MockItem, MockTest } from "./hsk1";

export const ZH_MOCKS: Record<string, MockTest> = { hsk1: HSK1_MOCK, hsk2: HSK2_MOCK };
