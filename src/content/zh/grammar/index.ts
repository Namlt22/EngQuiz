/** Ngữ pháp khoá tiếng Trung, theo cấp. */
import { HSK1_GRAMMAR_A } from "./hsk1-a";
import { HSK1_GRAMMAR_B } from "./hsk1-b";
import type { ZhGrammarLesson } from "./types";

export * from "./types";

export const ZH_GRAMMAR: ZhGrammarLesson[] = [...HSK1_GRAMMAR_A, ...HSK1_GRAMMAR_B];
export const ZH_GRAMMAR_MAP: Record<string, ZhGrammarLesson> = Object.fromEntries(ZH_GRAMMAR.map((l) => [l.id, l]));
export const grammarAtLevel = (level: number) => ZH_GRAMMAR.filter((l) => l.level === level);
