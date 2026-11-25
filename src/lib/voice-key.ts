/**
 * Khoá của một câu đọc mẫu tạo sẵn (giọng Kokoro, public/audio/voice/en/<khoá>.mp3).
 * Phải trùng từng bit với scripts/voice/generate_kokoro.py (voice_key): chuẩn hoá khoảng trắng, rồi FNV-1a 32-bit
 * trên các byte UTF-8 của "<giọng>|<câu>", viết hex 8 ký tự.
 */

/** Giọng mặc định (Anh-Mỹ, nữ) và hai giọng cho hai nhân vật hội thoại. */
export const DEFAULT_VOICE = "af_heart";
export const SPEAKER_VOICES = ["af_heart", "am_michael"] as const;

export const normalizeVoiceText = (text: string) => text.replace(/\s+/g, " ").trim();

export function voiceKey(text: string, voice: string = DEFAULT_VOICE): string {
  const bytes = new TextEncoder().encode(`${voice}|${normalizeVoiceText(text)}`);
  let h = 0x811c9dc5;
  for (const b of bytes) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
