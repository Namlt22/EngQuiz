/**
 * Chép dữ liệu nét chữ (hanzi-writer-data, nguồn Make Me a Hanzi / Arphic) của các chữ khoá tiếng Trung cần
 * vào public/hanzi/<mã Unicode hex>.json để app tự phục vụ, không phụ thuộc CDN.
 *
 * Chữ cần = mọi chữ trong danh mục từ HSK 1–4 + mọi chữ Hán xuất hiện trong nội dung src/content/zh/*.ts.
 * Giấy phép Arphic yêu cầu giữ nguyên ARPHICPL.TXT đi kèm mọi bản sao → chép file đó vào cùng thư mục.
 *
 * Chạy: node scripts/build-hanzi-data.mjs   (chạy lại khi thêm từ vựng / nội dung mới)
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const dataDir = dirname(require.resolve("hanzi-writer-data/package.json"));
const outDir = join(root, "public", "hanzi");
const HAN = /\p{Script=Han}/u;

function neededChars() {
  const chars = new Set();
  const vocab = JSON.parse(readFileSync(join(root, "src/content/zh/data/hsk-vocab.json"), "utf8"));
  for (const [hanzi] of vocab) for (const ch of hanzi) chars.add(ch);
  const contentDir = join(root, "src/content/zh");
  for (const f of readdirSync(contentDir)) {
    if (!f.endsWith(".ts") || f.endsWith(".test.ts")) continue;
    for (const ch of readFileSync(join(contentDir, f), "utf8")) if (HAN.test(ch)) chars.add(ch);
  }
  return [...chars].sort();
}

export const fileName = (ch) => `${ch.codePointAt(0).toString(16)}.json`;

function main() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const missing = [];
  let bytes = 0;
  let count = 0;
  for (const ch of neededChars()) {
    const src = join(dataDir, `${ch}.json`);
    if (!existsSync(src)) {
      missing.push(ch);
      continue;
    }
    // Bản sao nguyên văn (Arphic PL mục 1): không sửa nội dung file.
    const data = readFileSync(src);
    writeFileSync(join(outDir, fileName(ch)), data);
    bytes += data.length;
    count++;
  }
  copyFileSync(join(dataDir, "ARPHICPL.TXT"), join(outDir, "ARPHICPL.TXT"));
  writeFileSync(
    join(outDir, "README.txt"),
    [
      "Stroke data for Chinese characters, copied verbatim from the npm package hanzi-writer-data 2.0.1",
      "(https://github.com/chanind/hanzi-writer-data), which comes from Make Me a Hanzi (https://github.com/skishore/makemeahanzi).",
      "The glyph data is derived from fonts by Arphic Technology Co., Ltd. and is distributed under the Arphic Public License (ARPHICPL.TXT).",
      "File name = Unicode code point of the character in hex.",
      "",
    ].join("\n"),
  );
  console.log(`Đã chép ${count} chữ (${(bytes / 1024 / 1024).toFixed(2)} MB) vào public/hanzi.`);
  if (missing.length) console.log(`Không có dữ liệu nét cho ${missing.length} ký tự: ${missing.join(" ")}`);
}

main();
