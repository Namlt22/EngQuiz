/**
 * Kết quả nhận dạng lời nói trên máy chủ (POST /api/transcribe → scripts/voice/asr.py, Whisper chạy tại chỗ).
 * Dùng chung cho route (kiểm tra dữ liệu dịch vụ trả về) và hook micro phía trình duyệt.
 */
import { z } from "zod";

export const TRANSCRIBE_LIMITS = {
  /** Nói tự do tới 3 phút; webm/opus 32 kbps ≈ 720 KB. */
  maxBytes: 4 * 1024 * 1024,
  maxExpectedChars: 200,
} as const;

/** Các trường thừa (vd `seconds`) bị bỏ; bản đoán phụ giới hạn số lượng. */
export const transcribeResultSchema = z.object({
  transcript: z.string().max(5000),
  alternatives: z.array(z.string().max(5000)).max(5),
});

export type TranscribeResult = z.infer<typeof transcribeResultSchema>;
