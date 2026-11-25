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

export type RateLimiter = ReturnType<typeof createRateLimiter>;

/** Một bộ đếm cần lấy lượt: khoá (người dùng / IP / "all") và thông báo khi hết lượt. */
export interface LimitStep {
  limiter: RateLimiter;
  key: string;
  message: string;
}

/**
 * Lấy một lượt ở mọi bộ đếm theo thứ tự; bộ nào hết thì trả lại các lượt đã lấy trước đó
 * và trả thông báo của bộ đó. Trả null nếu lấy đủ.
 */
export function takeAll(steps: readonly LimitStep[], now = Date.now()): string | null {
  for (let i = 0; i < steps.length; i++) {
    const { limiter, key, message } = steps[i];
    if (!limiter.check(key, now)) {
      refundAll(steps.slice(0, i), now);
      return message;
    }
  }
  return null;
}

/** Trả lại lượt ở mọi bộ đếm (yêu cầu thất bại không do người dùng). */
export function refundAll(steps: readonly Pick<LimitStep, "limiter" | "key">[], now = Date.now()): void {
  for (const { limiter, key } of steps) limiter.refund(key, now);
}
