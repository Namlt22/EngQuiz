import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("chặn lượt thứ limit+1 trong cùng cửa sổ, mở lại khi hết cửa sổ", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.check("u", 0)).toBe(true);
    expect(rl.check("u", 10)).toBe(true);
    expect(rl.check("u", 20)).toBe(false);
    expect(rl.check("u", 1000)).toBe(true);
  });

  it("mỗi khóa đếm riêng", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(rl.check("a", 0)).toBe(true);
    expect(rl.check("b", 0)).toBe(true);
    expect(rl.check("a", 1)).toBe(false);
  });

  it("dọn khóa hết hạn khi số khóa quá lớn nhưng giữ khóa còn hiệu lực", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 100 });
    for (let i = 0; i <= 10_001; i++) rl.check(`old-${i}`, 0);
    rl.check("live", 150);
    expect(rl.check("live", 160)).toBe(false);
    expect(rl.check("old-1", 200)).toBe(true);
  });
});
