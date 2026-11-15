/**
 * Băm & kiểm tra mật khẩu bằng scrypt (có sẵn trong Node, không cần thư viện).
 * Định dạng lưu: scrypt$<salt base64url>$<hash base64url>.
 * Giới hạn số phép băm chạy cùng lúc: scrypt tốn CPU/RAM, không để một đợt đăng nhập dồn dập làm treo server.
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS: ScryptOptions = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const MAX_CONCURRENT = 2;
const MAX_WAITING = 50;

export class BusyError extends Error {}

let running = 0;
const waiting: Array<() => void> = [];

async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= MAX_CONCURRENT) {
    if (waiting.length >= MAX_WAITING) throw new BusyError("Máy chủ đang bận, hãy thử lại sau giây lát.");
    await new Promise<void>((resolve) => waiting.push(resolve));
  } else {
    running += 1;
  }
  try {
    return await fn();
  } finally {
    const next = waiting.shift();
    if (next) next(); // trao chỗ trực tiếp cho người chờ kế tiếp (running giữ nguyên)
    else running -= 1;
  }
}

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return withSlot(
    () =>
      new Promise<Buffer>((resolve, reject) =>
        scryptCb(password.normalize("NFKC"), salt, KEY_LENGTH, SCRYPT_OPTIONS, (err, key) => (err ? reject(err) : resolve(key))),
      ),
  );
}

/** Lỗi của mật khẩu mới (chuỗi rỗng = hợp lệ). Dùng chung cho server và form. */
export function passwordProblem(password: string, email = ""): string {
  if (password.length < PASSWORD_MIN) return `Mật khẩu tối thiểu ${PASSWORD_MIN} ký tự`;
  if (password.length > PASSWORD_MAX) return `Mật khẩu tối đa ${PASSWORD_MAX} ký tự`;
  if (email && password.trim().toLowerCase() === email.trim().toLowerCase()) return "Mật khẩu không được trùng email";
  return "";
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  const [scheme, saltText, hashText] = (stored ?? "").split("$");
  if (scheme !== "scrypt" || !saltText || !hashText) {
    // Vẫn băm một lần để thời gian phản hồi không lộ "tài khoản này có mật khẩu hay không".
    await derive(password, Buffer.alloc(16));
    return false;
  }
  const expected = Buffer.from(hashText, "base64url");
  const actual = await derive(password, Buffer.from(saltText, "base64url"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
