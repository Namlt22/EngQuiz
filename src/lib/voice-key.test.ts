import { describe, expect, it } from "vitest";
import { collectVoiceTexts } from "./voice-texts";
import { normalizeVoiceText, voiceKey } from "./voice-key";

describe("khoá giọng đọc mẫu", () => {
  it("cố định (phải trùng bản Python trong scripts/voice/generate_kokoro.py)", () => {
    expect(voiceKey("ship")).toBe(voiceKey("  ship "));
    expect(voiceKey("ship")).not.toBe(voiceKey("ship", "am_michael"));
    expect(voiceKey("hello")).toMatch(/^[0-9a-f]{8}$/);
    // Giá trị chuẩn — đổi thuật toán phải đổi cả bản Python.
    expect(voiceKey("hello", "af_heart")).toBe("f369754d");
  });

  it("chuẩn hoá khoảng trắng", () => {
    expect(normalizeVoiceText(" a \n b ")).toBe("a b");
  });

  it("danh sách câu không trùng khoá", () => {
    const texts = collectVoiceTexts();
    expect(new Set(texts.map((t) => t.key)).size).toBe(texts.length);
    expect(texts[0].group).toBe("ipa");
  });
});
