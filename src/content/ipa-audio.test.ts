import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { IPA_MAP, IPA_SOUNDS } from "./ipa";
import { commonsFileUrl, ipaAudioSrc, IPA_RECORDINGS } from "./ipa-audio";

describe("file ghi âm IPA", () => {
  it("mọi nguyên âm đơn và phụ âm có bản ghi; nguyên âm đôi thì không", () => {
    const withAudio = IPA_SOUNDS.filter((s) => ipaAudioSrc(s.id));
    expect(withAudio).toHaveLength(36);
    expect(withAudio.every((s) => s.group !== "diphthong")).toBe(true);
  });

  it("mỗi bản ghi trỏ đúng một âm có thật, không trùng, và có file mp3 trong public/", () => {
    const ids = IPA_RECORDINGS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(IPA_MAP[id], id).toBeDefined();
      expect(existsSync(join(process.cwd(), "public", ipaAudioSrc(id)!)), id).toBe(true);
    }
  });

  it("âm không có bản ghi → undefined (trang sẽ đọc từ ví dụ)", () => {
    expect(ipaAudioSrc("ei")).toBeUndefined();
    expect(ipaAudioSrc("i-long")).toBe("/audio/ipa/i-long.mp3");
  });

  it("link ghi nguồn đúng dạng trang file của Commons", () => {
    expect(commonsFileUrl("Voiced velar plosive 02.ogg")).toBe(
      "https://commons.wikimedia.org/wiki/File:Voiced_velar_plosive_02.ogg",
    );
  });
});
