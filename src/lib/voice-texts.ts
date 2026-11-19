/**
 * Danh sách câu tiếng Anh cần có giọng đọc mẫu tạo sẵn (Kokoro), theo thứ tự ưu tiên:
 * phát âm IPA → từ vựng → nghe chép / đọc theo → hội thoại (mỗi nhân vật một giọng) → bài đọc.
 * scripts/voice/export-texts xuất danh sách này ra JSON cho scripts/voice/generate_kokoro.py.
 */
import { DIALOGUES } from "@/content/dialogues";
import { DICTATIONS } from "@/content/dictations";
import { IPA_SOUNDS } from "@/content/ipa";
import { READINGS } from "@/content/readings";
import { EN_VOCAB_TOPICS } from "@/content/vocab-en";
import { ipaCarrier } from "./pronounce";
import { respellVietnameseNames } from "./vi-names";
import { DEFAULT_VOICE, SPEAKER_VOICES, normalizeVoiceText, voiceKey } from "./voice-key";

export interface VoiceText {
  key: string;
  /** Câu như app gọi speak(). */
  text: string;
  /** Câu đưa vào giọng đọc (tên riêng Việt Nam đã viết lại để giọng Anh đọc gần đúng). */
  say: string;
  voice: string;
  group: "ipa" | "vocab" | "dictation" | "dialogue" | "reading";
}

export function collectVoiceTexts(): VoiceText[] {
  const out: VoiceText[] = [];
  const seen = new Set<string>();
  const add = (raw: string, group: VoiceText["group"], voice: string = DEFAULT_VOICE) => {
    const text = normalizeVoiceText(raw);
    const key = voiceKey(text, voice);
    if (!text || seen.has(key)) return;
    seen.add(key);
    out.push({ key, text, say: respellVietnameseNames(text), voice, group });
  };

  for (const s of IPA_SOUNDS) {
    s.examples.forEach((e) => add(e.word, "ipa"));
    if (s.pair) {
      add(s.pair.a.word, "ipa");
      add(s.pair.b.word, "ipa");
    }
  }
  // Câu khung để chấm từng từ IPA (xem ipaCarrier) — cũng là câu mẫu để nghe.
  for (const s of IPA_SOUNDS) s.examples.forEach((e) => add(ipaCarrier(e.word), "ipa"));
  for (const t of EN_VOCAB_TOPICS) {
    for (const [word, , , , example] of t.words) {
      add(word, "vocab");
      add(example, "vocab");
    }
  }
  for (const d of DICTATIONS) d.sentences.forEach((s) => add(s.text, "dictation"));
  for (const d of DIALOGUES) {
    d.lines.forEach((l) => add(l.en, "dialogue", SPEAKER_VOICES[l.speaker]));
    d.phrases.forEach((p) => add(p.en, "dialogue"));
  }
  for (const r of READINGS) r.paragraphs.forEach((p) => add(p.en, "reading"));
  return out;
}
