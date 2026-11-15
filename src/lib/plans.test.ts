import { describe, expect, it } from "vitest";
import { addMonths, extendPremium, getPlan, perMonth, PLANS, savingPercent, vnDay } from "./plans";

describe("các gói AI", () => {
  it("4 gói 1/3/6/12 tháng, gói dài rẻ hơn mỗi tháng", () => {
    expect(PLANS.map((p) => p.months)).toEqual([1, 3, 6, 12]);
    const monthly = PLANS.map(perMonth);
    expect([...monthly].sort((a, b) => b - a)).toEqual(monthly);
    expect(PLANS.map(savingPercent)).toEqual([0, 16, 24, 33]);
  });

  it("getPlan chỉ nhận mã gói có thật", () => {
    expect(getPlan("3m")?.price).toBe(249_000);
    expect(getPlan("99m")).toBeUndefined();
    expect(getPlan({ id: "1m" })).toBeUndefined();
  });
});

describe("cộng tháng & gia hạn", () => {
  it("cuối tháng không tràn sang tháng sau", () => {
    expect(addMonths(new Date("2026-01-31T10:00:00Z"), 1).toISOString()).toBe("2026-02-28T10:00:00.000Z");
    expect(addMonths(new Date("2028-01-31T10:00:00Z"), 1).toISOString()).toBe("2028-02-29T10:00:00.000Z");
    expect(addMonths(new Date("2026-11-15T00:00:00Z"), 12).toISOString()).toBe("2027-11-15T00:00:00.000Z");
  });

  it("còn hạn → cộng tiếp từ ngày hết hạn; hết hạn / chưa mua → tính từ bây giờ", () => {
    const now = new Date("2026-11-15T00:00:00Z");
    expect(extendPremium(new Date("2026-12-01T00:00:00Z"), 1, now).toISOString()).toBe("2027-01-01T00:00:00.000Z");
    expect(extendPremium(new Date("2026-10-01T00:00:00Z"), 1, now).toISOString()).toBe("2026-12-15T00:00:00.000Z");
    expect(extendPremium(null, 3, now).toISOString()).toBe("2027-02-15T00:00:00.000Z");
  });
});

it("ngày reset lượt AI theo giờ Việt Nam (UTC+7)", () => {
  expect(vnDay(new Date("2026-11-15T16:59:59Z"))).toBe("2026-11-15");
  expect(vnDay(new Date("2026-11-15T17:00:00Z"))).toBe("2026-11-16");
});
