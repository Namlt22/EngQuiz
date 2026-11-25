/** Tiện ích đọc request an toàn cho route handler. */

export class BodyTooLargeError extends Error {}

/**
 * Đọc body dạng text nhưng dừng ngay khi vượt `maxBytes` (đếm theo byte, kể cả khi
 * không có hoặc khai báo sai Content-Length) — tránh bị đẩy body khổng lồ làm đầy bộ nhớ.
 */
export async function readBodyWithLimit(req: Request, maxBytes: number): Promise<string> {
  const declared = req.headers.get("content-length");
  if (declared !== null) {
    const n = Number(declared);
    if (!Number.isFinite(n) || n < 0 || n > maxBytes) throw new BodyTooLargeError();
  }
  const bytes = await readBytesWithLimit(req, maxBytes);
  if (!bytes) throw new BodyTooLargeError();
  return new TextDecoder().decode(bytes);
}

/** Đọc thân yêu cầu, dừng ngay khi vượt `max` byte (trả null). */
export async function readBytesWithLimit(req: Request, max: number): Promise<Uint8Array | null> {
  if (!req.body) return new Uint8Array();
  const reader = req.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    parts.push(value);
  }
  return concatBytes(parts, size);
}

function concatBytes(parts: readonly Uint8Array[], size: number): Uint8Array {
  const out = new Uint8Array(size);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.byteLength;
  }
  return out;
}

/** Lấy IP client (sau reverse proxy) để giới hạn tần suất; không dùng cho mục đích bảo mật khác. */
export function clientIp(req: Request): string {
  // Sau Cloudflare Tunnel: CF-Connecting-IP là IP thật của người dùng (server chỉ nghe 127.0.0.1 nên chỉ cloudflared gửi được header này).
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Chặn request ghi đến từ trang web khác (CSRF): Origin phải trùng host của server.
 * Sau reverse proxy, so với x-forwarded-host nếu có.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;
  try {
    const originHost = new URL(origin).host;
    const host = req.headers.get("x-forwarded-host") ?? new URL(req.url).host;
    return originHost === host;
  } catch {
    return false;
  }
}
