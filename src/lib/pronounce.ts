/**
 * Kết quả chấm phát âm tới từng âm (dịch vụ OpenPronounce cục bộ — scripts/voice/pronounce_service.py,
 * gọi qua POST /api/pronounce). Dùng chung cho route (kiểm tra dữ liệu dịch vụ trả về) và giao diện.
 */
import { z } from "zod";

export const PRONOUNCE_LIMITS = {
  /** Kích thước tối đa của bản ghi gửi lên (webm/opus ~15 giây ≈ 120 KB). */
  maxBytes: 2 * 1024 * 1024,
  maxTextChars: 200,
} as const;

const phoneSchema = z.object({
  expected: z.string().nullable().optional(),
  heard: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
});

export const pronounceResultSchema = z.object({
  score: z.number().min(0).max(100),
  transcript: z.string().catch(""),
  phoneErrorRate: z.number().nullable().optional(),
  wordErrorRate: z.number().nullable().optional(),
  errors: z
    .array(
      z.object({
        word: z.string().nullable().optional(),
        expected: z.string().nullable().optional(),
        heard: z.string().nullable().optional(),
        confidence: z.number().nullable().optional(),
        phones: z.array(phoneSchema).catch([]),
      }),
    )
    .catch([]),
  /** Từng âm của mọi từ (kể cả từ không bị báo lỗi) — để bài IPA xét riêng từ đang luyện. */
  words: z
    .array(
      z.object({
        word: z.string(),
        expected: z.array(z.string()).catch([]),
        heard: z.array(z.string()).catch([]),
        phones: z.array(phoneSchema).catch([]),
      }),
    )
    .catch([]),
});

export type PronounceResult = z.infer<typeof pronounceResultSchema>;
export type PronounceError = PronounceResult["errors"][number];

/** Lỗi đủ chắc để báo cho người học (OpenPronounce gắn độ tin cậy 0–1 cho mỗi từ sai). */
export const CONFIDENT_ERROR = 0.5;

export const confidentErrors = (r: PronounceResult) => r.errors.filter((e) => (e.confidence ?? 1) >= CONFIDENT_ERROR);

/**
 * Điểm hiển thị cho một lượt đọc (0–100), cùng thang với READ_ALOUD_PASS (80) của chấm cũ:
 * không có âm sai đáng tin → ít nhất mức đạt; còn âm sai → dưới mức đạt, dù điểm âm học cao.
 */
export function pronounceScore(r: PronounceResult, pass: number): number {
  const score = Math.round(r.score);
  return confidentErrors(r).length ? Math.min(score, pass - 1) : Math.max(score, pass);
}

/**
 * Câu khung khi chấm một từ IPA. Thử trên 30 cặp từ tối thiểu của app, giọng Kokoro đọc đúng / đọc nhầm (scripts/voice):
 *  - đọc trơ một từ: báo nhầm 4/16 lần đọc đúng (bộ nhận dạng âm cần ngữ cảnh);
 *  - "Say … again.": phụ âm cuối nối vào nguyên âm sau (t thành âm vỗ) → báo nhầm 3/60, bắt được 44/60;
 *  - "Say … now.": báo nhầm 2/60, bắt được 49/60 (xét riêng âm đang học, ngưỡng 0,3).
 */
export const ipaCarrier = (word: string) => `Say ${word} now.`;
