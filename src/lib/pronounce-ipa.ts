/**
 * Bài luyện một âm IPA: chỉ xét ÂM ĐANG HỌC trong từ ví dụ (kết quả chấm từng âm, src/lib/pronounce.ts).
 *
 * Vì sao không xét cả từ: giọng Mỹ chuẩn cũng bị báo lỗi ở âm khác (t cuối thành âm vỗ trước nguyên âm, k bật hơi…);
 * còn OpenPronounce lại không báo một âm sai đơn lẻ (ship ↔ sheep). Thử trên các cặp từ tối thiểu của app
 * (scripts/voice, giọng Kokoro đọc đúng / đọc nhầm): xét riêng âm đang học vừa ít báo nhầm hơn, vừa bắt được nhầm âm.
 */
import type { PronounceResult } from "./pronounce";

/** Ký hiệu trong bài (IPA Anh) → âm vị espeak Anh-Mỹ mà bộ chấm dùng (đã bỏ dấu dài ː). */
const ESPEAK_PHONES: Readonly<Record<string, readonly string[]>> = {
  "iː": ["i"],
  "uː": ["u"],
  e: ["ɛ", "e"],
  "ɜː": ["ɜ", "ɜɹ", "ɚ"],
  "ɔː": ["ɔ", "oɹ", "ɔɹ"],
  "ɑː": ["ɑ", "ɑɹ"],
  "ɒ": ["ɑ", "ɔ", "ɒ"],
  "ɪə": ["ɪɹ", "ɪə", "iə"],
  "ʊə": ["ʊɹ", "ʊə"],
  "əʊ": ["oʊ", "əʊ"],
  "eə": ["ɛɹ", "eə"],
  "ɡ": ["ɡ", "g"],
  r: ["ɹ", "r"],
};

/** Độ tin cậy (0–1) tối thiểu để coi âm đang học là sai — chọn theo kết quả thử ở scripts/voice. */
export const TAUGHT_SOUND_THRESHOLD = 0.3;

export interface TaughtSoundCheck {
  ok: boolean;
  /** Âm đúng → âm nghe được, khi sai. */
  expected?: string;
  heard?: string;
}

export function checkTaughtSound(result: PronounceResult, word: string, symbol: string): TaughtSoundCheck {
  const w = result.words.find((x) => x.word.toLowerCase() === word.toLowerCase());
  // Không thấy từ trong bản chấm (đọc từ khác hẳn / không rõ): coi là chưa đạt.
  if (!w) return { ok: false };
  const want = ESPEAK_PHONES[symbol] ?? [symbol];
  const taught = w.phones.filter((p) => p.expected && want.includes(p.expected));
  // Không tìm ra âm đang học trong cách đọc chuẩn của từ → xét cả từ.
  const pool = taught.length ? taught : w.phones;
  const worst = pool.reduce<(typeof pool)[number] | null>((m, p) => ((p.confidence ?? 0) > (m?.confidence ?? 0) ? p : m), null);
  if (!worst || (worst.confidence ?? 0) < TAUGHT_SOUND_THRESHOLD) return { ok: true };
  return { ok: false, expected: worst.expected ?? undefined, heard: worst.heard ?? undefined };
}
