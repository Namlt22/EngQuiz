import { describe, expect, it } from "vitest";
import { pickEnglishVoices } from "./speech";

const voice = (name: string, lang: string, localService: boolean) =>
  ({ name, lang, localService, voiceURI: name, default: false }) as SpeechSynthesisVoice;

describe("pickEnglishVoices", () => {
  it("chỉ dùng giọng Anh-Mỹ khi máy có; giọng offline trước giọng online", () => {
    const list = pickEnglishVoices([
      voice("Google UK English Female", "en-GB", false),
      voice("Google US English", "en-US", false),
      voice("Microsoft Zira", "en-US", true),
      voice("Microsoft Hazel", "en-GB", true),
      voice("Microsoft David", "en_US", true),
    ]);
    expect(list.map((v) => v.name)).toEqual(["Microsoft Zira", "Microsoft David", "Google US English"]);
  });

  it("không có giọng Mỹ → dùng giọng tiếng Anh khác; bỏ giọng không phải tiếng Anh; giọng chất lượng cao lên trước", () => {
    expect(pickEnglishVoices([voice("Microsoft An", "vi-VN", true), voice("Hazel", "en-GB", true)]).map((v) => v.name)).toEqual(["Hazel"]);
    const list = pickEnglishVoices([voice("Zira", "en-US", true), voice("Ava (Enhanced)", "en-US", true)]);
    expect(list.map((v) => v.name)).toEqual(["Ava (Enhanced)", "Zira"]);
  });
});
