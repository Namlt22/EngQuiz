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
  if (!req.body) return "";

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

/** Lấy IP client (sau reverse proxy) để giới hạn tần suất; không dùng cho mục đích bảo mật khác. */
export function clientIp(req: Request): string {
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
