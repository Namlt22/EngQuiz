import { describe, expect, it } from "vitest";
import { pickEnglishVoices } from "./speech";

const voice = (name: string, lang: string, localService: boolean) =>
  ({ name, lang, localService, voiceURI: name, default: false }) as SpeechSynthesisVoice;

describe("pickEnglishVoices", () => {
  it("giọng offline đứng trước giọng online (online phải chờ mạng mỗi câu)", () => {
    const list = pickEnglishVoices(
      [
        voice("Google UK English Female", "en-GB", false),
        voice("Microsoft Sonia Online (Natural)", "en-GB", false),
        voice("Microsoft David", "en-US", true),
        voice("Microsoft Hazel", "en-GB", true),
      ],
      "en-GB",
    );
    expect(list.map((v) => v.name)).toEqual([
      "Microsoft Hazel",
      "Microsoft David",
      "Google UK English Female",
      "Microsoft Sonia Online (Natural)",
    ]);
  });

  it("bỏ giọng không phải tiếng Anh; trong cùng nhóm, giọng chất lượng cao lên trước", () => {
    const list = pickEnglishVoices(
      [voice("Microsoft An", "vi-VN", true), voice("Zira", "en-US", true), voice("Ava (Enhanced)", "en-US", true)],
      "en-US",
    );
    expect(list.map((v) => v.name)).toEqual(["Ava (Enhanced)", "Zira"]);
  });
});
