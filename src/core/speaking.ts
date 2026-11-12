/**
 * Chấm phần nói (logic thuần, không phụ thuộc trình duyệt).
 *
 * Đọc theo câu mẫu: trình nhận dạng giọng nói (Web Speech API) trả về vài bản đoán (alternatives) cho cùng một lần nói.
 * So từng bản với câu mẫu bằng cùng bộ chấm của Nghe & chép (căn chỉnh từng từ, chấp nhận don't = do not, 5 = five…)
 * rồi lấy bản khớp nhất: nếu máy nghe ra đúng câu ở bất kỳ bản đoán nào thì người học nhiều khả năng đã nói đúng.
 * Đây là chấm theo từ máy nghe được, không phải chấm từng âm.
 */
import { checkDictation, type DictationCheck } from "./dictation";

/** Đạt khi máy nghe đúng ít nhất 80% câu (giống ngưỡng qua bài của quiz/nghe chép). */
export const READ_ALOUD_PASS = 80;
/** Chỉ xét vài bản đoán đầu — các bản sau thường là biến thể vô nghĩa. */
export const MAX_ALTERNATIVES = 5;

export interface ReadAloudResult {
  /** Bản đoán được dùng để chấm (khớp câu mẫu nhất). */
  heard: string;
  check: DictationCheck;
  /** 0–100 */
  score: number;
  passed: boolean;
}

export function scoreReadAloud(target: string, alternatives: readonly string[]): ReadAloudResult {
  const candidates = alternatives
    .map((a) => a.trim())
    .filter(Boolean)
    .slice(0, MAX_ALTERNATIVES);
  const heardList = candidates.length ? candidates : [""];

  let best = { heard: heardList[0], check: checkDictation(target, heardList[0]) };
  for (const heard of heardList.slice(1)) {
    const check = checkDictation(target, heard);
    if (check.accuracy > best.check.accuracy) best = { heard, check };
  }
  const score = Math.round(best.check.accuracy * 100);
  return { ...best, score, passed: score >= READ_ALOUD_PASS };
}

/** Điểm trung bình của một bộ câu (câu chưa nói tính 0). */
export function averageScore(scores: readonly (number | undefined)[]): number {
  if (!scores.length) return 0;
  return Math.round(scores.reduce<number>((sum, s) => sum + (s ?? 0), 0) / scores.length);
}

export interface SpeechStats {
  words: number;
  /** Số từ mỗi phút; 0 nếu không đo được thời gian. */
  wordsPerMinute: number;
  seconds: number;
}

/** Thống kê độ trôi chảy đơn giản cho phần nói tự do. */
export function speechStats(transcript: string, durationMs: number): SpeechStats {
  const words = transcript.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
  const seconds = Math.max(0, Math.round(durationMs / 1000));
  const wordsPerMinute = seconds > 0 ? Math.round((words / seconds) * 60) : 0;
  return { words, wordsPerMinute, seconds };
}
