#!/usr/bin/env node
/**
 * Phân loại file của dự án vào 3 khu vực (xem docs/CODE-AREAS.md) và kiểm tra một nhánh chỉ sửa đúng khu vực.
 *
 *   node scripts/check-areas.mjs                      → in thống kê mỗi khu vực
 *   node scripts/check-areas.mjs --file src/lib/x.ts  → khu vực của một file
 *   node scripts/check-areas.mjs --diff <base> [--allow zh,shared]
 *        → liệt kê file đã đổi so với <base> theo khu vực; báo lỗi (exit 1) nếu có file
 *          ngoài khu tiếng Anh bị thay đổi (trừ khu được --allow).
 *
 * Quy tắc phân loại (tự tính từ import thật, không phải danh sách cứng):
 *   zh     : src/app/zh, src/components/zh, src/content/zh, src/core/{zh-*,pinyin*,hanzi*}, src/lib/zh-*
 *   shared : nền tảng (đăng nhập, admin, gói AI/thanh toán, pháp lý, API, server, layout, cấu hình)
 *            + MỌI file code mà khu zh hoặc nền tảng import tới (trực tiếp hay gián tiếp) → lõi học tập dùng chung
 *   en     : phần còn lại trong src/ — trang và code chỉ khoá tiếng Anh dùng, và dữ liệu tiếng Anh trong src/content
 * Dữ liệu trong src/content (trừ content/zh, content/legal) luôn là tiếng Anh: sửa dữ liệu tiếng Anh không đổi hành vi
 * của khoá tiếng Trung, kể cả khi một màn hình dùng chung đọc nó.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

const ZH_PATTERNS = [/^src\/app\/zh\//, /^src\/components\/zh\//, /^src\/content\/zh\//, /^src\/core\/(zh-|pinyin|hanzi)/, /^src\/lib\/zh-/, /^scripts\/build-hanzi-data/];

/** Nền tảng dùng chung cho cả web. */
const PLATFORM_PATTERNS = [
  /^src\/app\/(api|admin|billing|credits|pricing|signin|register|forgot|legal)\//,
  /^src\/app\/(layout\.tsx|not-found\.tsx|globals\.css|icon\.svg)$/,
  /^src\/auth\.ts$/,
  /^src\/server\//,
  /^src\/generated\//,
  /^src\/components\/(admin|auth|billing|legal|layout)\//,
  /^src\/content\/legal\//,
  /^prisma\//,
  /^public\//,
  /^scripts\/(?!check-areas)/,
  /^[^/]+$/, // file cấu hình ở thư mục gốc: package.json, next.config.ts, .env.example...
  /^\.(claude|github)\//,
];

/** Tài liệu: không thuộc khu nào, không chặn. */
const DOC_PATTERNS = [/^docs\//, /^design\//, /^scripts\/check-areas\.mjs$/];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== "node_modules" && name !== "generated") walk(p, out);
    } else if (/\.(tsx?|mjs|css)$/.test(name)) out.push(p);
  }
  return out;
}

/** "@/x" (gốc src) hoặc "./x", "../x" (tương đối với file đang đọc). */
function resolveImport(spec, fromFile) {
  const base = spec.startsWith("@/") ? path.join(ROOT, "src", spec.slice(2)) : path.resolve(path.dirname(fromFile), spec);
  for (const c of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (existsSync(c) && statSync(c).isFile()) return rel(c);
  }
  return null;
}

/** Đồ thị import ("@/..." và đường dẫn tương đối) của mọi file trong src/. */
function importGraph() {
  const graph = new Map();
  for (const f of walk(path.join(ROOT, "src"))) {
    const text = readFileSync(f, "utf8");
    const deps = new Set();
    for (const m of text.matchAll(/(?:from|import)\s*\(?\s*["'](@\/[^"']+|\.{1,2}\/[^"']+)["']/g)) {
      const r = resolveImport(m[1], f);
      if (r) deps.add(r);
    }
    graph.set(rel(f), deps);
  }
  return graph;
}

const isEnglishData = (f) => f.startsWith("src/content/") && !/^src\/content\/(zh|legal)\//.test(f);

export function buildClassifier() {
  const graph = importGraph();
  const files = [...graph.keys()];
  const shared = new Set();
  const isZh = (f) => ZH_PATTERNS.some((re) => re.test(f));
  const isPlatform = (f) => PLATFORM_PATTERNS.some((re) => re.test(f));

  // Lan theo import từ khu zh và nền tảng: mọi file code chạm tới đều là dùng chung.
  const queue = files.filter((f) => isZh(f) || isPlatform(f));
  const seen = new Set(queue);
  while (queue.length) {
    const f = queue.pop();
    for (const d of graph.get(f) ?? []) {
      if (seen.has(d)) continue;
      seen.add(d);
      if (isZh(d)) continue;
      if (isEnglishData(d)) continue; // dữ liệu tiếng Anh giữ ở khu en (xem chú thích đầu file)
      shared.add(d);
      queue.push(d);
    }
  }

  return function classify(file) {
    if (DOC_PATTERNS.some((re) => re.test(file))) return "docs";
    if (isZh(file)) return "zh";
    if (isPlatform(file) || shared.has(file)) return "shared";
    if (file.startsWith("src/")) return "en";
    return "shared";
  };
}

function main() {
  const args = process.argv.slice(2);
  const classify = buildClassifier();

  const fileArg = args.indexOf("--file");
  if (fileArg >= 0) {
    console.log(classify(args[fileArg + 1]));
    return;
  }

  const diffArg = args.indexOf("--diff");
  if (diffArg >= 0) {
    const base = args[diffArg + 1];
    const allowArg = args.indexOf("--allow");
    const allow = new Set(allowArg >= 0 ? args[allowArg + 1].split(",") : []);
    const changed = execSync(`git diff --name-only ${base}...HEAD`, { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
    const groups = { en: [], zh: [], shared: [], docs: [] };
    for (const f of changed) groups[classify(f)].push(f);
    for (const [area, list] of Object.entries(groups)) {
      console.log(`\n${area.toUpperCase()} (${list.length})`);
      for (const f of list) console.log(`  ${f}`);
    }
    const bad = [...groups.zh, ...groups.shared].filter((f) => !allow.has(classify(f)));
    if (bad.length) {
      console.error(`\n✗ ${bad.length} file ngoài khu tiếng Anh bị thay đổi.`);
      process.exit(1);
    }
    console.log("\n✓ Chỉ khu tiếng Anh (và tài liệu) thay đổi.");
    return;
  }

  const counts = { en: 0, zh: 0, shared: 0, docs: 0 };
  for (const f of walk(path.join(ROOT, "src"))) counts[classify(rel(f))]++;
  console.log(counts);
}

if (process.argv[1] && rel(process.argv[1]) === "scripts/check-areas.mjs") main();
