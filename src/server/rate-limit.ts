/**
 * Giới hạn tần suất đơn giản theo cửa sổ cố định, lưu trong bộ nhớ của tiến trình.
 * Đủ cho một server Node; khi chạy nhiều instance/serverless cần chuyển sang Redis (vd Upstash).
 */
interface Window {
  count: number;
  resetAt: number;
}

const MAX_TRACKED_KEYS = 10_000;

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>();

  function prune(now: number) {
    for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
  }

  return {
    /** true nếu còn được phép; false nếu vượt giới hạn trong cửa sổ hiện tại. */
    check(key: string, now = Date.now()): boolean {
      if (windows.size > MAX_TRACKED_KEYS) prune(now);
      const w = windows.get(key);
      if (!w || w.resetAt <= now) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (w.count >= limit) return false;
      windows.set(key, { count: w.count + 1, resetAt: w.resetAt });
      return true;
    },
    /** Trả lại một lượt đã tính (vd khi yêu cầu thất bại không do người dùng). */
    refund(key: string, now = Date.now()): void {
      const w = windows.get(key);
      if (w && w.resetAt > now && w.count > 0) windows.set(key, { count: w.count - 1, resetAt: w.resetAt });
    },
  };
}
