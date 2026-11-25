/**
 * Gọi dịch vụ giọng nói chạy trên chính máy chủ (127.0.0.1, scripts/voice/pronounce_service.py):
 * /score (chấm phát âm) và /transcribe (Whisper). Dùng chung cho /api/pronounce và /api/transcribe.
 */

export const VOICE_SERVICE_URL = process.env.ENGQUIZ_PRONOUNCE_URL ?? "http://127.0.0.1:8765";

/** Phần đầu form (ranh giới, tên trường, câu) cộng thêm vào kích thước file. */
export const FORM_OVERHEAD = 4 * 1024;

/** Tên file gửi dịch vụ theo loại bản ghi của trình duyệt (ffmpeg đoán định dạng theo đuôi). */
export function recordingFileName(mimeType: string): string {
  if (mimeType.includes("ogg")) return "rec.ogg";
  if (mimeType.includes("mp4")) return "rec.m4a";
  return "rec.webm";
}

/** Gửi form tới dịch vụ; trả null nếu không kết nối được hoặc quá giờ. */
export async function postToVoiceService(path: "/score" | "/transcribe", body: FormData, timeoutMs: number): Promise<Response | null> {
  try {
    return await fetch(`${VOICE_SERVICE_URL}${path}`, { method: "POST", body, signal: AbortSignal.timeout(timeoutMs) });
  } catch {
    return null;
  }
}
