/**
 * Chấm phần nói (logic thuần, không phụ thuộc trình duyệt).
 *
 * Đọc theo câu mẫu: trình nhận dạng giọng nói (Web Speech API) trả về vài bản đoán (alternatives) cho cùng một lần nói.
 * So từng bản với câu mẫu bằng cùng bộ chấm của Nghe & chép (căn chỉnh từng từ, chấp nhận don't = do not, 5 = five…)
 * rồi lấy bản khớp nhất: nếu máy nghe ra đúng câu ở bất kỳ bản đoán nào thì người học nhiều khả năng đã nói đúng.
 * Đây là chấm theo từ máy nghe được, không phải chấm từng âm. Tên riêng Việt Nam trong câu không bị chấm (xem forgiveVietnameseNames).
 */
import { VI_NAMES } from "@/lib/vi-names";
import { checkDictation, type DictationCheck } from "./dictation";

/** Từng chữ của tên riêng Việt Nam (Huế, Linh, Đà Nẵng…): máy nhận giọng tiếng Anh không nghe ra được → không chấm. */
const VI_NAME_WORDS = new Set(VI_NAMES.flatMap((n) => n.match.toLowerCase().split(" ")));
const bare = (w: string) => w.toLowerCase().replace(/'s$/, "").replace(/[^\p{L}]/gu, "");
/** Mỗi chữ của tên có thể bị nghe thành tới 2 từ tiếng Anh ("Huế" → "who a") — tha bấy nhiêu từ thừa. */
const EXTRAS_FORGIVEN_PER_NAME_WORD = 2;

/** Coi các chữ là tên riêng Việt Nam là đúng, tha từ thừa do máy nghe nhầm tên, tính lại độ chính xác. */
function forgiveVietnameseNames(check: DictationCheck): DictationCheck {
  const nameWords = check.words.filter((w) => VI_NAME_WORDS.has(bare(w.display)));
  if (!nameWords.length) return check;
  const gained = nameWords.reduce((sum, w) => sum + (w.status === "correct" ? 0 : w.status === "near" ? 0.5 : 1), 0);
  const extras = check.extras.slice(Math.min(check.extras.length, nameWords.length * EXTRAS_FORGIVEN_PER_NAME_WORD));
  const words = check.words.map((w) => (VI_NAME_WORDS.has(bare(w.display)) ? { ...w, status: "correct" as const } : w));
  const raw = check.totalTokens
    ? (check.correctTokens + 0.5 * check.nearTokens + gained - 0.5 * extras.length) / check.totalTokens
    : 0;
  const accuracy = Math.max(0, Math.min(1, raw));
  return { ...check, words, extras, accuracy, passed: extras.length === 0 && words.every((w) => w.status === "correct" || w.status === "near") };
}

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

  let best = { heard: heardList[0], check: forgiveVietnameseNames(checkDictation(target, heardList[0])) };
  for (const heard of heardList.slice(1)) {
    const check = forgiveVietnameseNames(checkDictation(target, heard));
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
