/**
 * Canh ranh giới khu vực (docs/CODE-AREAS.md): các module tiếng Anh mới phải nằm trọn trong khu tiếng Anh.
 * - Khu tiếng Trung và khu dùng chung không được import tới chúng (nếu có, script tự xếp chúng vào "dùng chung").
 * - Chúng không được import gì từ khu tiếng Trung.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error: script Node thuần (.mjs), không có khai báo kiểu
import { buildClassifier } from "../../scripts/check-areas.mjs";

const ROOT = path.resolve(__dirname, "../..");
const EN_ONLY = [/^src\/(components|core|lib)\/en-/, /^src\/content\/en-course\//, /^src\/content\/en-level-test\.ts$/, /^src\/app\/(games|level-test|a1-course)\//];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== "generated") walk(p, out);
    } else if (/\.tsx?$/.test(name)) out.push(path.relative(ROOT, p).split(path.sep).join("/"));
  }
  return out;
}

const classify = buildClassifier() as (f: string) => "en" | "zh" | "shared" | "docs";
const files = walk(path.join(ROOT, "src"));
const enOnly = files.filter((f) => EN_ONLY.some((re) => re.test(f)));

describe("ranh giới khu tiếng Anh", () => {
  it("có module tiếng Anh mới để kiểm tra", () => {
    expect(enOnly.length).toBeGreaterThan(0);
  });

  it.each(enOnly)("%s thuộc khu tiếng Anh (khu tiếng Trung / dùng chung không dùng tới)", (f) => {
    expect(classify(f)).toBe("en");
  });

  it.each(enOnly)("%s không import gì từ khu tiếng Trung", (f) => {
    const text = readFileSync(path.join(ROOT, f), "utf8");
    const zhImports = [...text.matchAll(/from\s+["']@\/([^"']+)["']/g)]
      .map((m) => `src/${m[1]}`)
      .filter((p) => /^src\/(app\/zh|components\/zh|content\/zh|core\/(zh-|pinyin|hanzi)|lib\/zh-)/.test(p));
    expect(zhImports).toEqual([]);
  });
});
