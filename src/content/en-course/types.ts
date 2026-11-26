import type { LevelCode } from "../types";

/** Câu trắc nghiệm gọn cho phần Nghe / Đọc. `answer` = chỉ số đáp án đúng. */
export interface CourseMcq {
  q: string;
  options: string[];
  answer: number;
}

export interface CoursePrompt {
  /** Câu hỏi / đề bài (tiếng Anh). */
  prompt: string;
  /** Câu trả lời mẫu. */
  example: string;
}

export interface CourseDay {
  /** vd "A1-3" (dùng cho tiến độ: KHÔNG đổi sau khi phát hành). */
  id: string;
  level: LevelCode;
  /** Số thứ tự ngày trong cấp (1–20). */
  day: number;
  unit: number;
  title: { vi: string; en: string };
  /** Ngày ôn tập cuối chủ đề. */
  review?: boolean;
  /** 8 từ trong src/content/vocab-en (khoá = chính từ, viết thường). */
  words: string[];
  /** Chủ điểm ngữ pháp (slug); ngày ôn tập có nhiều chủ điểm. */
  grammar: string[];
  listening: {
    title: string;
    /** [người nói, câu]. Hai người nói được đọc bằng hai giọng khác nhau nếu máy có. */
    lines: [string, string][];
    questions: CourseMcq[];
  };
  reading: { title: string; text: string; questions: CourseMcq[] };
  /** 6 câu: mỗi câu trả lời bằng một câu hoàn chỉnh. */
  writing: CoursePrompt[];
  /** 5 câu hỏi để nói. */
  speaking: CoursePrompt[];
}

export interface CourseUnit {
  level: LevelCode;
  unit: number;
  title: { vi: string; en: string };
  days: CourseDay[];
}
