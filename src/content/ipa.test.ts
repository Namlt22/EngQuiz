import { describe, expect, it } from "vitest";
import { ENDING_RULES, IPA_CHART, IPA_MAP, IPA_SOUNDS } from "./ipa";

describe("IPA", () => {
  it("đủ 44 âm: 12 nguyên âm đơn, 8 nguyên âm đôi, 24 phụ âm", () => {
    expect(IPA_SOUNDS).toHaveLength(44);
    expect(IPA_SOUNDS.filter((s) => s.group === "short" || s.group === "long")).toHaveLength(12);
    expect(IPA_SOUNDS.filter((s) => s.group === "diphthong")).toHaveLength(8);
    expect(IPA_SOUNDS.filter((s) => s.group === "voiced" || s.group === "voiceless")).toHaveLength(24);
  });

  it("id và ký hiệu không trùng", () => {
    expect(new Set(IPA_SOUNDS.map((s) => s.id)).size).toBe(44);
    expect(new Set(IPA_SOUNDS.map((s) => s.symbol)).size).toBe(44);
  });

  it("bảng hiển thị chứa đúng mỗi âm một lần", () => {
    const ids = [...IPA_CHART.monophthongs, ...IPA_CHART.diphthongs, ...IPA_CHART.consonants].flat();
    expect(ids.sort()).toEqual(IPA_SOUNDS.map((s) => s.id).sort());
  });

  it("mỗi âm có 3 ví dụ và phiên âm ví dụ chứa đúng ký hiệu đó", () => {
    for (const s of IPA_SOUNDS) {
      expect(s.examples, s.id).toHaveLength(3);
      for (const e of s.examples) {
        expect(e.ipa, `${s.id}: ${e.word}`).toMatch(/^\/.+\/$/);
        expect(e.ipa.includes(s.symbol), `${s.id}: ${e.word} ${e.ipa}`).toBe(true);
      }
    }
  });

  it("cặp so sánh tham chiếu đúng âm và mỗi từ chứa âm tương ứng", () => {
    for (const s of IPA_SOUNDS) {
      if (!s.pair) continue;
      const other = IPA_MAP[s.pair.with];
      expect(other, s.id).toBeDefined();
      expect(s.pair.a.ipa.includes(s.symbol), `${s.id} a`).toBe(true);
      expect(s.pair.b.ipa.includes(other.symbol), `${s.id} b`).toBe(true);
    }
  });

  it("phiên âm dùng ký hiệu IPA ɡ (U+0261), không dùng chữ g thường", () => {
    const all = [
      ...IPA_SOUNDS.flatMap((s) => [s.symbol, ...s.examples.map((e) => e.ipa), s.pair?.a.ipa ?? "", s.pair?.b.ipa ?? ""]),
      ...[...ENDING_RULES.s.rows, ...ENDING_RULES.ed.rows].map((r) => r[2].replace(/[a-z]+ (?=\/)/g, "")),
    ];
    for (const t of all) expect(t.includes("g"), t).toBe(false);
  });
});
