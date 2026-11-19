/**
 * Xuất danh sách câu cần giọng đọc mẫu ra JSON cho generate_kokoro.py.
 *   npx vitest run --config scripts/voice/vitest.config.ts
 * Mặc định ghi ra ../voice-runtime/texts.json (ngoài repo); đổi bằng biến VOICE_TEXTS_OUT.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { collectVoiceTexts } from "@/lib/voice-texts";

it("xuất danh sách câu", () => {
  const texts = collectVoiceTexts();
  const out = process.env.VOICE_TEXTS_OUT ?? path.resolve(__dirname, "../../../voice-runtime/texts.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(texts));
  const byGroup = texts.reduce<Record<string, number>>((m, t) => ({ ...m, [t.group]: (m[t.group] ?? 0) + 1 }), {});
  console.log(out, texts.length, byGroup);
  expect(texts.length).toBeGreaterThan(0);
});
