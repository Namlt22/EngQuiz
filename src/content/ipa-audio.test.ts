import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { IPA_MAP, IPA_SOUNDS } from "./ipa";
import { commonsFileUrl, ipaAudioSrc, IPA_RECORDINGS, SYNTHESIZED_DIPHTHONGS } from "./ipa-audio";

describe("file ghi âm IPA", () => {
  it("cả 44 âm đều có file đứng riêng: 36 bản ghi Commons + 8 nguyên âm đôi tạo bằng giọng đọc máy", () => {
    expect(IPA_SOUNDS.filter((s) => ipaAudioSrc(s.id))).toHaveLength(44);
    const diphthongs = IPA_SOUNDS.filter((s) => s.group === "diphthong").map((s) => s.id);
    expect([...SYNTHESIZED_DIPHTHONGS].sort()).toEqual(diphthongs.sort());
    for (const id of SYNTHESIZED_DIPHTHONGS) expect(existsSync(join(process.cwd(), "public", ipaAudioSrc(id)!)), id).toBe(true);
  });

  it("mỗi bản ghi trỏ đúng một âm có thật, không trùng, và có file mp3 trong public/", () => {
    const ids = IPA_RECORDINGS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(IPA_MAP[id], id).toBeDefined();
      expect(existsSync(join(process.cwd(), "public", ipaAudioSrc(id)!)), id).toBe(true);
    }
  });

  it("id không phải âm IPA → undefined; nguyên âm đôi có file riêng", () => {
    expect(ipaAudioSrc("khong-co")).toBeUndefined();
    expect(ipaAudioSrc("ei")).toBe("/audio/ipa/ei.mp3");
    expect(ipaAudioSrc("i-long")).toBe("/audio/ipa/i-long.mp3");
  });

  it("link ghi nguồn đúng dạng trang file của Commons", () => {
    expect(commonsFileUrl("Voiced velar plosive 02.ogg")).toBe(
      "https://commons.wikimedia.org/wiki/File:Voiced_velar_plosive_02.ogg",
    );
  });
});
