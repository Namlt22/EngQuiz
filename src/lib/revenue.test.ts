import { describe, expect, it } from "vitest";
import { activeMonthsInYear, ledgerCsv, parseYear, revenueStatus, summarizeRevenue, TAX_FREE_REVENUE_THRESHOLD, vnYearRange, type PaidOrder } from "./revenue";

/** Thời điểm theo giờ Việt Nam. */
const vn = (iso: string) => new Date(`${iso}+07:00`);
const order = (code: string, paidAt: string, amount = 249_000, plan = "3m"): PaidOrder => ({ code, plan, months: 3, amount, paidAt: vn(paidAt) });

describe("vnYearRange", () => {
  it("năm tính theo giờ Việt Nam", () => {
    const { from, to } = vnYearRange(2026);
    expect(from.toISOString()).toBe("2025-12-31T17:00:00.000Z");
    expect(to.toISOString()).toBe("2026-12-31T17:00:00.000Z");
  });
});

describe("summarizeRevenue", () => {
  it("ghi nhận theo ngày tiền về giờ Việt Nam, kể cả sát nửa đêm", () => {
    const orders = [
      order("EQAAAAAA", "2026-03-31T23:30:00"), // còn là tháng 3 ở Việt Nam (UTC đã là 31/3 16:30)
      order("EQBBBBBB", "2026-04-01T00:10:00"), // UTC vẫn là 31/3 nhưng ở Việt Nam đã sang tháng 4
      order("EQCCCCCC", "2025-12-31T23:59:00"), // năm trước → bỏ qua
    ];
    const s = summarizeRevenue(orders, 2026, vn("2025-06-01T00:00:00"));
    expect(s.monthly[2]).toBe(249_000);
    expect(s.monthly[3]).toBe(249_000);
    expect(s.total).toBe(498_000);
    expect(s.rows.map((r) => r.date)).toEqual(["31/03/2026", "01/04/2026"]);
    expect(s.rows[0].description).toBe("Bán gói AI 3 tháng (đơn EQAAAAAA)");
  });

  it("kinh doanh từ năm trước → không quy đổi", () => {
    const s = summarizeRevenue([order("EQAAAAAA", "2026-05-01T10:00:00", 800_000_000)], 2026, vn("2025-01-10T00:00:00"));
    expect(s.activeMonths).toBe(12);
    expect(s.annualized).toBe(800_000_000);
    expect(s.status).toBe("near");
  });

  it("bắt đầu giữa năm → quy đổi ra cả năm (800 triệu trong 6 tháng ≈ 1,6 tỷ)", () => {
    const s = summarizeRevenue([order("EQAAAAAA", "2026-07-15T10:00:00", 800_000_000)], 2026, vn("2026-07-15T10:00:00"));
    expect(s.activeMonths).toBe(6);
    expect(s.annualized).toBe(1_600_000_000);
    expect(s.status).toBe("over");
  });

  it("năm chưa có đơn nào", () => {
    const s = summarizeRevenue([], 2027, null);
    expect(s).toMatchObject({ total: 0, annualized: 0, status: "below", rows: [] });
    expect(s.monthly).toHaveLength(12);
  });
});

describe("activeMonthsInYear / revenueStatus", () => {
  it("tháng bắt đầu được tính đủ tháng", () => {
    expect(activeMonthsInYear(2026, vn("2026-01-31T23:00:00"))).toBe(12);
    expect(activeMonthsInYear(2026, vn("2026-12-01T08:00:00"))).toBe(1);
    expect(activeMonthsInYear(2026, null)).toBe(12);
    expect(activeMonthsInYear(2025, vn("2026-02-01T08:00:00"))).toBe(0);
  });

  it("ngưỡng 1 tỷ: dưới 80% an toàn, từ 80% cảnh báo, từ 1 tỷ vượt", () => {
    expect(revenueStatus(TAX_FREE_REVENUE_THRESHOLD * 0.79)).toBe("below");
    expect(revenueStatus(TAX_FREE_REVENUE_THRESHOLD * 0.8)).toBe("near");
    expect(revenueStatus(TAX_FREE_REVENUE_THRESHOLD)).toBe("over");
  });
});

describe("ledgerCsv", () => {
  it("có BOM, tiêu đề cột S1a-HKD, dòng tổng; chặn công thức Excel", () => {
    const s = summarizeRevenue([order("EQAAAAAA", "2026-02-03T09:00:00")], 2026, null);
    const csv = ledgerCsv(s, "=HYPERLINK(\"x\")");
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain("Ngày tháng,Số hiệu chứng từ,Diễn giải,Số tiền (VND)");
    expect(csv).toContain("03/02/2026,EQAAAAAA,Bán gói AI 3 tháng (đơn EQAAAAAA),249000");
    expect(csv).toContain(",,Tổng cộng,249000");
    expect(csv).toContain('"Người nộp thuế: =HYPERLINK(""x"")"');
  });
});

describe("parseYear", () => {
  const now = vn("2026-11-15T12:00:00");
  it("nhận năm hợp lệ, còn lại về năm hiện tại", () => {
    expect(parseYear("2025", now)).toBe(2025);
    expect(parseYear("2027", now)).toBe(2026);
    expect(parseYear("2019", now)).toBe(2026);
    expect(parseYear("20x6", now)).toBe(2026);
    expect(parseYear(undefined, now)).toBe(2026);
    expect(parseYear(["2025"], now)).toBe(2026);
  });
});
