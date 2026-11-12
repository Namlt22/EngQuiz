// Chạy `next dev` qua HTTPS cho mạng LAN, dùng chứng chỉ do `npm run setup:lan` tạo và cổng lấy từ AUTH_URL.
// Chạy: npm run dev:lan
import "dotenv/config";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const CERT_FILE = "certificates/lan-cert.pem";
const KEY_FILE = "certificates/lan-key.pem";
const HOST_FILE = "certificates/lan-host.txt";

function fail(message) {
  console.error(message);
  process.exit(1);
}

let authUrl;
try {
  authUrl = new URL(process.env.AUTH_URL ?? "");
} catch {
  fail("AUTH_URL trong .env không hợp lệ. Chạy: npm run setup:lan");
}
if (authUrl.protocol !== "https:" || !existsSync(CERT_FILE) || !existsSync(KEY_FILE)) {
  fail("Chưa cấu hình HTTPS cho mạng LAN. Chạy: npm run setup:lan");
}
const certHost = existsSync(HOST_FILE) ? readFileSync(HOST_FILE, "utf8").trim() : "";
if (certHost !== authUrl.hostname) {
  fail(`Chứng chỉ được tạo cho "${certHost || "?"}" nhưng AUTH_URL là ${authUrl.hostname}. Chạy lại: npm run setup:lan`);
}

// Chạy thẳng file JS của Next bằng Node (không qua shell) → không phụ thuộc PATH, không có nguy cơ chèn lệnh.
const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
const port = authUrl.port || "443";
const args = [nextBin, "dev", "-p", port, "--experimental-https", "--experimental-https-key", KEY_FILE, "--experimental-https-cert", CERT_FILE];
const child = spawn(process.execPath, args, { stdio: "inherit" });
child.on("error", (e) => fail(`Không chạy được Next.js: ${e.message}`));
child.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
