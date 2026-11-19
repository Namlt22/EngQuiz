/**
 * Phiên đăng nhập dùng chung giữa Auth.js (Google) và đăng nhập bằng mật khẩu:
 * cả hai ghi vào bảng Session và đặt cùng một cookie, nên `auth()` / `useSession()` nhận ra như nhau.
 */
import { randomBytes } from "node:crypto";

export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** Auth.js thêm tiền tố __Secure- khi site chạy HTTPS (theo AUTH_URL) — phải đặt đúng tên đó. */
export function sessionCookieName(authUrl = process.env.AUTH_URL ?? ""): string {
  return authUrl.startsWith("https:") ? "__Secure-authjs.session-token" : "authjs.session-token";
}

export function sessionCookieOptions(authUrl = process.env.AUTH_URL ?? "") {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: authUrl.startsWith("https:"),
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export const newSessionToken = () => randomBytes(32).toString("base64url");
