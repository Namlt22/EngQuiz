export type LevelCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Category =
  | "TENSE"
  | "MODAL"
  | "COND"
  | "PASSIVE"
  | "REPORTED"
  | "RELATIVE"
  | "WORD"
  | "STRUCT"
  | "CLAUSE";

/** Một chủ điểm trong danh mục (có thể chưa có nội dung). */
export interface TopicMeta {
  slug: string;
  level: LevelCode;
  category: Category;
  title: string;
  titleEn: string;
}

/* ---------------- Khối lý thuyết ---------------- */

export type PartRole = "subject" | "aux" | "verb" | "object" | "other";
export interface FormulaPart {
  t: string;
  role: PartRole;
}
export interface FormulaRow {
  label: string;
  parts: FormulaPart[];
  example?: string;
}

export interface Example {
  en: string;
  vi: string;
}

export interface TimelineItem {
  /** point = một thời điểm, span = khoảng thời gian, repeat = lặp lại thường xuyên */
  kind: "point" | "span" | "repeat";
  /** Vị trí trên trục: -1 = quá khứ xa, 0 = hiện tại, 1 = tương lai xa */
  at: number;
  to?: number;
  label?: string;
}

export type TheoryBlock =
  | { type: "summary"; text: string }
  | { type: "formula"; title?: string; rows: FormulaRow[]; note?: string }
  | { type: "usage"; title: string; text?: string; examples: Example[] }
  | { type: "signals"; title?: string; words: string[] }
  | { type: "timeline"; caption?: string; items: TimelineItem[] }
  | { type: "mistakes"; items: { wrong: string; right: string; why: string }[] }
  | { type: "compare"; title: string; headers: string[]; rows: string[][] }
  | { type: "tip"; text: string }
  | { type: "table"; title?: string; headers: string[]; rows: string[][] };

/* ---------------- Câu hỏi Quiz ---------------- */

interface QBase {
  id: string;
  /** Giải thích bằng tiếng Việt: vì sao đúng / vì sao sai. */
  explanation: string;
}

export type Question =
  | (QBase & { type: "mcq"; prompt: string; options: string[]; answer: number })
  | (QBase & {
      /** Chia động từ trong ngoặc. Prompt chứa ___ ; base là động từ gốc. */
      type: "verb_form";
      prompt: string;
      base: string;
      answers: string[];
    })
  | (QBase & { type: "gap_fill"; prompt: string; answers: string[]; hint?: string })
  | (QBase & {
      /** Tìm lỗi sai: các đoạn có underline=true là lựa chọn. */
      type: "error_id";
      segments: { text: string; underline?: boolean }[];
      answer: number;
      correction: string;
    })
  | (QBase & {
      type: "transform";
      prompt: string;
      /** Phần mở đầu gợi ý cho câu viết lại, vd "If I". */
      starter?: string;
      answers: string[];
    })
  | (QBase & {
      type: "word_order";
      /** Các từ đã xáo trộn sẵn. */
      words: string[];
      answers: string[];
    })
  | (QBase & {
      type: "matching";
      prompt: string;
      left: string[];
      right: string[];
      /** pairs[i] = chỉ số của right ghép với left[i] */
      pairs: number[];
    });

export type QuestionType = Question["type"];

/* ---------------- Nghe & chép ---------------- */

export interface DictationSentence {
  text: string;
  vi: string;
}

export type DictationKind = "grammar" | "story" | "conversation";

export interface DictationExercise {
  id: string;
  title: string;
  level: LevelCode;
  kind: DictationKind;
  description: string;
  /** Gắn với chủ điểm ngữ pháp nào (nếu có). */
  topicSlug?: string;
  /** Tốc độ đọc mặc định (1 = bình thường). */
  rate: number;
  sentences: DictationSentence[];
}

/* ---------------- Chủ điểm đầy đủ ---------------- */

export interface TopicContent {
  slug: string;
  /** Tóm tắt ngắn hiển thị ở thẻ chủ điểm. */
  intro: string;
  theory: TheoryBlock[];
  questions: Question[];
}
