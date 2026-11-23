import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { IPA_MAP, IPA_SOUNDS } from "./ipa";
import { commonsFileUrl, ipaAudioSrc, IPA_RECORDINGS, LICENSE_URL, recordingSourceUrl } from "./ipa-audio";

describe("file ghi âm IPA", () => {
  it("/ŋ/ ghi nguồn Kokoro, các âm khác trỏ về Commons", () => {
    const byId = new Map(IPA_RECORDINGS.map((r) => [r.id, r]));
    const ng = byId.get("ng")!;
    expect(ipaAudioSrc("ng")).toBe("/audio/ipa/ng-h4.mp3");
    expect(recordingSourceUrl(ng)).toBe("https://huggingface.co/hexgrad/Kokoro-82M");
    expect(LICENSE_URL[ng.license]).toBe("https://www.apache.org/licenses/LICENSE-2.0");
    expect(recordingSourceUrl(byId.get("l")!)).toBe(commonsFileUrl("En-us-hello.ogg"));
  });

  it("cả 44 âm đều có nguồn ghi âm và có file trong public/", () => {
    expect(IPA_RECORDINGS).toHaveLength(44);
    for (const s of IPA_SOUNDS) expect(existsSync(join(process.cwd(), "public", ipaAudioSrc(s.id)!)), s.id).toBe(true);
  });

  it("mỗi bản ghi trỏ đúng một âm có thật, không trùng, và có file mp3 trong public/", () => {
    const ids = IPA_RECORDINGS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(IPA_MAP[id], id).toBeDefined();
      expect(existsSync(join(process.cwd(), "public", ipaAudioSrc(id)!)), id).toBe(true);
    }
  });

  it("id không phải âm IPA → undefined; âm có file theo phiên bản giọng người", () => {
    expect(ipaAudioSrc("khong-co")).toBeUndefined();
    expect(ipaAudioSrc("i-long")).toBe("/audio/ipa/i-long-h2.mp3");
    expect(ipaAudioSrc("u-long")).toBe("/audio/ipa/u-long-h2.mp3");
    expect(ipaAudioSrc("p")).toBe("/audio/ipa/p-h4.mp3");
  });

  it("link ghi nguồn đúng dạng trang file của Commons", () => {
    expect(commonsFileUrl("Voiced velar plosive 02.ogg")).toBe(
      "https://commons.wikimedia.org/wiki/File:Voiced_velar_plosive_02.ogg",
    );
  });
});
