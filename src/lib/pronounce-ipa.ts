/**
 * Bài luyện một âm IPA: xét ÂM ĐANG HỌC trong từ ví dụ (kết quả chấm từng âm, src/lib/pronounce.ts), và nối ngược
 * âm vị của bộ chấm (espeak Anh-Mỹ) về ký hiệu trong bài để chỉ ra "bạn đọc gần /ɪ/".
 */
import { IPA_SOUNDS, type IpaSound } from "@/content/ipa";
import type { PronounceResult, PronounceSound } from "./pronounce";

/** Ký hiệu trong bài (IPA Anh) → các âm vị espeak Anh-Mỹ tương ứng của bộ chấm. */
const ESPEAK_PHONES: Readonly<Record<string, readonly string[]>> = {
  e: ["ɛ", "e"],
  "ɜː": ["ɜː", "ɜ", "ɚ"],
  "ɔː": ["ɔː", "ɔ", "ɔːɹ", "oːɹ"],
  "ɑː": ["ɑː", "ɑ", "ɑːɹ"],
  "ɒ": ["ɑː", "ɑ", "ɔ", "ɒ"],
  "ɪə": ["ɪɹ", "iə"],
  "ʊə": ["ʊɹ"],
  "əʊ": ["oʊ", "əʊ"],
  "eə": ["ɛɹ", "eə"],
  "ɡ": ["ɡ", "g"],
  r: ["ɹ", "r"],
  "ə": ["ə", "ɚ"],
};

const espeakFor = (symbol: string) => ESPEAK_PHONES[symbol] ?? [symbol];

/** Âm vị espeak → âm trong bài (để mở bài / lấy mẹo của âm người học đọc nhầm sang). */
export function soundForPhone(phone: string): IpaSound | undefined {
  return IPA_SOUNDS.find((s) => espeakFor(s.symbol).includes(phone));
}

export interface TaughtSoundCheck {
  ok: boolean;
  /** Âm đang học trong từ, theo thứ tự (để tô màu); rỗng nếu không thấy từ. */
  sounds: PronounceSound[];
  /** Âm đang học bị đọc nhầm thành (khi sai). */
  heardAs?: IpaSound | null;
}

export function checkTaughtSound(result: PronounceResult, word: string, symbol: string): TaughtSoundCheck {
  const inWord = result.sounds.filter((s) => s.word.toLowerCase() === word.toLowerCase());
  if (!inWord.length) return { ok: false, sounds: [] };
  const want = espeakFor(symbol);
  const taught = inWord.filter((s) => want.includes(s.phone));
  // Không tìm ra âm đang học trong cách đọc chuẩn của từ → xét cả từ.
  const pool = taught.length ? taught : inWord;
  const wrong = pool.find((s) => s.status === "wrong");
  if (!wrong) return { ok: true, sounds: inWord };
  return { ok: false, sounds: inWord, heardAs: wrong.heard ? (soundForPhone(wrong.heard) ?? null) : null };
}
