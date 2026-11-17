/** Bài hội thoại / bài đọc tiếng Trung. Câu ở dạng tách từ (src/core/zh-sentence.ts). */
export interface ZhLine {
  /** Khoá vai trong `speakers` (hội thoại); bỏ trống với bài đọc */
  speaker?: string;
  zh: string;
  vi: string;
}

export interface ZhTextQuestion {
  id: string;
  prompt: string;
  /** Lựa chọn; đáp án đúng luôn là options[0] — giao diện tự xáo thứ tự */
  options: string[];
  explanation: string;
}

export interface ZhTextLesson {
  id: string;
  kind: "dialogue" | "reading";
  level: 1 | 2 | 3 | 4;
  title: string;
  /** Tiêu đề tiếng Trung (tách từ) */
  zhTitle: string;
  /** Bối cảnh / mục tiêu giao tiếp */
  scene: string;
  /** Tên hiển thị của từng vai (hội thoại) */
  speakers?: Record<string, string>;
  lines: ZhLine[];
  questions: ZhTextQuestion[];
}
