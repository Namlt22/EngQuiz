/**
 * Kiểu dữ liệu bài ngữ pháp tiếng Trung. Câu tiếng Trung luôn ở dạng tách từ (src/core/zh-sentence.ts).
 */
export interface ZhExample {
  /** Câu tách từ, vd "我 是 学生 。" */
  zh: string;
  vi: string;
}

export interface FormulaRow {
  label: string;
  /** Công thức, phần tiếng Trung để nguyên chữ Hán: "Chủ ngữ + 是 + Danh từ" */
  pattern: string;
  /** Câu ví dụ tách từ */
  example?: string;
}

export type ZhBlock =
  | { type: "summary"; text: string }
  | { type: "formula"; title?: string; rows: FormulaRow[] }
  | { type: "usage"; title: string; text?: string; examples: ZhExample[] }
  | { type: "mistakes"; items: { wrong: string; right: string; why: string }[] }
  | { type: "compare"; title: string; headers: string[]; rows: string[][] }
  | { type: "tip"; text: string };

interface QBase {
  id: string;
  explanation: string;
}

export type ZhQuestion =
  /** Trắc nghiệm. `prompt` có thể là câu tách từ chứa "___" (hiển thị kèm pinyin) hoặc câu hỏi tiếng Việt. */
  | (QBase & { type: "mcq"; prompt: string; zhPrompt?: boolean; options: string[]; answer: number })
  /** Sắp xếp thành câu: `answers` là các thứ tự đúng (câu tách từ); `vi` là nghĩa cần diễn đạt. */
  | (QBase & { type: "order"; vi: string; answers: string[] });

export interface ZhGrammarLesson {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  /** Các điểm ngữ pháp của chuẩn được dạy trong bài (tên tiếng Trung + tiếng Việt) */
  points: string[];
  intro: string;
  blocks: ZhBlock[];
  quiz: ZhQuestion[];
}
