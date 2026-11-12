/**
 * Đọc/ghi JSON trong localStorage an toàn cho các store phía client.
 * - Dữ liệu hỏng không bị ghi đè mất: bản gốc được chép sang `<key>:corrupt` để còn khôi phục.
 * - Dữ liệu đọc ra luôn qua hàm `sanitize` (localStorage là nguồn không tin cậy).
 */

export function readJson<T>(key: string, sanitize: (raw: unknown) => T, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return sanitize(JSON.parse(raw));
  } catch (e) {
    console.warn(`[storage] Dữ liệu "${key}" bị hỏng, đã sao lưu sang "${key}:corrupt".`, e);
    try {
      if (raw !== null) window.localStorage.setItem(`${key}:corrupt`, raw);
    } catch {
      /* không sao lưu được thì thôi — vẫn dùng bản trống */
    }
    return fallback;
  }
}

/** Trả về false nếu không ghi được (chế độ ẩn danh, bộ nhớ đầy). */
export function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[storage] Không ghi được "${key}" vào localStorage; dữ liệu chỉ còn trong phiên này.`, e);
    return false;
  }
}
