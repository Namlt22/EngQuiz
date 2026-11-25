import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CHAR_COUNT_BY_LEVEL, HANZI_CHARS, charCode, charFromCode, getHanziChar } from "./hanzi-chars";
import { charsUpTo } from "./vocab";

describe("chữ Hán theo cấp", () => {
  it("tổng số chữ khớp tập chữ của từ vựng HSK 1–4", () => {
    expect(HANZI_CHARS.length).toBe(charsUpTo(4).size);
    expect(Object.values(CHAR_COUNT_BY_LEVEL).reduce((a, b) => a + b, 0)).toBe(HANZI_CHARS.length);
  });

  it("cấp của chữ là cấp thấp nhất của từ chứa nó", () => {
    expect(getHanziChar("爱")?.level).toBe(1);
    for (const c of HANZI_CHARS) expect(Math.min(...c.words.map((w) => w.level))).toBe(c.level);
  });

  it("chữ đa âm giữ đủ cách đọc", () => {
    expect(new Set(getHanziChar("好")?.readings)).toEqual(new Set(["hǎo", "hào"]));
  });

  it("mã Unicode đổi qua lại, từ chối mã không hợp lệ", () => {
    expect(charCode("我")).toBe("6211");
    expect(charFromCode("6211")).toBe("我");
    expect(charFromCode("../x")).toBeUndefined();
  });

  it("mọi chữ đều có file dữ liệu nét trong public/hanzi (chạy scripts/build-hanzi-data.mjs nếu thiếu)", () => {
    const missing = HANZI_CHARS.filter((c) => !existsSync(join(process.cwd(), "public", "hanzi", `${charCode(c.char)}.json`)));
    expect(missing.map((c) => c.char)).toEqual([]);
  });
});
