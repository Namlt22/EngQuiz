/** Ngữ pháp khoá tiếng Trung, theo cấp. */
import { HSK1_GRAMMAR_A } from "./hsk1-a";
import { HSK1_GRAMMAR_B } from "./hsk1-b";
import { HSK2_GRAMMAR_A } from "./hsk2-a";
import { HSK2_GRAMMAR_B } from "./hsk2-b";
import { HSK3_GRAMMAR_A } from "./hsk3-a";
import { HSK3_GRAMMAR_B } from "./hsk3-b";
import { HSK4_GRAMMAR_A } from "./hsk4-a";
import { HSK4_GRAMMAR_B } from "./hsk4-b";
import type { ZhGrammarLesson } from "./types";

export * from "./types";

export const ZH_GRAMMAR: ZhGrammarLesson[] = [
  ...HSK1_GRAMMAR_A,
  ...HSK1_GRAMMAR_B,
  ...HSK2_GRAMMAR_A,
  ...HSK2_GRAMMAR_B,
  ...HSK3_GRAMMAR_A,
  ...HSK3_GRAMMAR_B,
  ...HSK4_GRAMMAR_A,
  ...HSK4_GRAMMAR_B,
];
export const ZH_GRAMMAR_MAP: Record<string, ZhGrammarLesson> = Object.fromEntries(ZH_GRAMMAR.map((l) => [l.id, l]));
export const grammarAtLevel = (level: number) => ZH_GRAMMAR.filter((l) => l.level === level);
