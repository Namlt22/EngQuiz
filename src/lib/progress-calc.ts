/** Kiểu dữ liệu & phép tính tiến độ (thuần, không phụ thuộc trình duyệt). */
import type { NotebookEntry } from "@/core/notebook";

export interface TopicProgress {
  theoryRead?: boolean;
  /** Điểm quiz cao nhất, 0–100 */
  quizBest?: number;
  /** Điểm nghe–chép cao nhất, 0–100 */
  dictationBest?: number;
}

export interface DictationProgress {
  best: number;
  /** Số câu đã hoàn thành ở lần làm gần nhất (để hiển thị tiến độ dở dang). */
  done: number;
  total: number;
}

/** Điểm đọc theo câu mẫu cao nhất của một bộ câu; cùng dạng với nghe chép. */
export type SpeakingProgress = DictationProgress;

export interface ProgressState {
  version: 1;
  topics: Record<string, TopicProgress>;
  dictations: Record<string, DictationProgress>;
  /** Luyện nói — đọc theo câu mẫu, theo id bộ câu (= id bài nghe chép). Bản cũ chưa có trường này. */
  speaking?: Record<string, SpeakingProgress>;
  /** Bài đọc: điểm câu hỏi đọc hiểu cao nhất, theo id bài. Bản cũ chưa có trường này. */
  reading?: Record<string, DictationProgress>;
  /** Bài hội thoại: điểm bài tập cao nhất, theo id bài. Bản cũ chưa có trường này. */
  dialogues?: Record<string, DictationProgress>;
  /** Luyện đặt câu: điểm cao nhất, theo id bộ câu. Bản cũ chưa có trường này. */
  sentences?: Record<string, DictationProgress>;
  /** Khoá tiếng Trung: các chữ Hán đã tự viết đúng ở bài tô chữ, nối thành một chuỗi (gọn hơn một record mỗi chữ). */
  hanzi?: string;
  /** Khoá tiếng Trung: trạng thái ôn từ vựng (hộp Leitner), dạng chuỗi gọn — xem src/core/srs.ts. */
  srs?: string;
  /** Sổ tay từ vựng người học tự thêm — xem src/core/notebook.ts. Bản cũ chưa có trường này. */
  notebook?: NotebookEntry[];
  xp: number;
  streak: number;
  /** yyyy-mm-dd theo giờ địa phương */
  lastActiveDate?: string;
  /** XP theo ngày, cho biểu đồ hoạt động */
  activity: Record<string, number>;
}

export const PASS_PERCENT = 80;

export type TopicStatus = "new" | "in-progress" | "done";

export function topicStatus(p: TopicProgress | undefined, hasDictation: boolean): TopicStatus {
  if (!p) return "new";
  const quizOk = (p.quizBest ?? 0) >= PASS_PERCENT;
  const dictOk = !hasDictation || (p.dictationBest ?? 0) >= PASS_PERCENT;
  if (p.theoryRead && quizOk && dictOk) return "done";
  if (p.theoryRead || p.quizBest !== undefined || p.dictationBest !== undefined) return "in-progress";
  return "new";
}

/** Mức thành thạo 0–100: trung bình 3 phần (đọc lý thuyết tính 100 hoặc 0). */
export function topicMastery(p: TopicProgress | undefined, hasDictation: boolean): number {
  if (!p) return 0;
  const parts = [p.theoryRead ? 100 : 0, p.quizBest ?? 0];
  if (hasDictation) parts.push(p.dictationBest ?? 0);
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
