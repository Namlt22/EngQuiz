// Tạo file .env cho môi trường dev từ .env.example, sinh sẵn mật khẩu Postgres và AUTH_SECRET.
// Chạy: npm run setup:env   (không ghi đè nếu .env đã tồn tại)
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

if (existsSync(".env")) {
  console.log(".env đã tồn tại, không ghi đè.");
  process.exit(0);
}

const password = randomBytes(18).toString("base64url");
const secret = randomBytes(32).toString("base64");

const content = readFileSync(".env.example", "utf8")
  .replaceAll("doi-mat-khau-nay", password)
  .replace(/^AUTH_SECRET=.*$/m, `AUTH_SECRET=${secret}`);

writeFileSync(".env", content, { mode: 0o600 });
console.log("Đã tạo .env. Tiếp theo: docker compose up -d && npm run db:migrate");
