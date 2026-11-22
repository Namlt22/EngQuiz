/**
 * Kết quả chấm phát âm tới từng âm (dịch vụ cục bộ scripts/voice/pronounce_service.py, gọi qua POST /api/pronounce).
 * Mỗi âm vị của câu đúng có một biên GOP (lpr): âm đúng khớp bản ghi hơn âm người Việt hay đọc nhầm bao nhiêu.
 * Dùng chung cho route (kiểm tra dữ liệu dịch vụ trả về) và giao diện.
 */
import { z } from "zod";

export const PRONOUNCE_LIMITS = {
  /** Kích thước tối đa của bản ghi gửi lên (webm/opus ~15 giây ≈ 120 KB). */
  maxBytes: 2 * 1024 * 1024,
  maxTextChars: 200,
} as const;

export const soundSchema = z.object({
  word: z.string(),
  wordIndex: z.number().int().min(0),
  /** Âm vị espeak Anh-Mỹ (vd "iː", "θ", "ɪɹ"). */
  phone: z.string(),
  lpr: z.number().nullable(),
  /** Âm nhầm khớp nhất ("" = bỏ âm). */
  heard: z.string(),
  status: z.enum(["right", "unsure", "wrong"]),
  /** false = âm chỉ hiển thị, không chấm (nguyên âm của từ chức năng, tên riêng Việt Nam). */
  scored: z.boolean().catch(true),
});

export const pronounceResultSchema = z.object({
  score: z.number().min(0).max(100),
  sounds: z.array(soundSchema),
});

export type PronounceResult = z.infer<typeof pronounceResultSchema>;
export type PronounceSound = z.infer<typeof soundSchema>;
export type SoundStatus = PronounceSound["status"];

/** Các âm theo từng từ (giữ thứ tự câu). */
export function soundsByWord(r: PronounceResult): { word: string; wordIndex: number; sounds: PronounceSound[] }[] {
  const out: { word: string; wordIndex: number; sounds: PronounceSound[] }[] = [];
  for (const s of r.sounds) {
    const last = out[out.length - 1];
    if (last && last.wordIndex === s.wordIndex) last.sounds.push(s);
    else out.push({ word: s.word, wordIndex: s.wordIndex, sounds: [s] });
  }
  return out;
}

/** Trạng thái một từ = âm tệ nhất của nó. */
export function wordStatus(sounds: readonly PronounceSound[]): SoundStatus {
  if (sounds.some((s) => s.status === "wrong")) return "wrong";
  return sounds.some((s) => s.status === "unsure") ? "unsure" : "right";
}

/** Điểm cùng thang với READ_ALOUD_PASS của cách chấm cũ: còn âm sai → dưới mức đạt. */
export function pronounceScore(r: PronounceResult, pass: number): number {
  const score = Math.round(r.score);
  return r.sounds.some((s) => s.status === "wrong") ? Math.min(score, pass - 1) : Math.max(score, pass);
}

/**
 * Câu khung khi chấm một từ IPA. Thử trên 30 cặp từ tối thiểu của app, giọng Kokoro đọc đúng / đọc nhầm (scripts/voice):
 * đọc trơ một từ báo nhầm 6–10/60 với mọi cách chấm (mô hình cần ngữ cảnh); trong "Say … now." báo nhầm 0/60, bắt 56/60.
 * ("Say … again." kém hơn: phụ âm cuối nối vào nguyên âm sau, t thành âm vỗ.)
 */
export const ipaCarrier = (word: string) => `Say ${word} now.`;
