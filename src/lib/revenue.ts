/**
 * Sổ doanh thu từ đơn đã thanh toán — số liệu cho sổ S1a-HKD (Thông tư 152/2025/TT-BTC) và
 * thông báo doanh thu Mẫu 01/TKN-CNKD (nộp chậm nhất 31/01 năm sau).
 * Hàm thuần (không đụng database) để kiểm thử được; dữ liệu lấy ở src/server/billing.ts → listPaidOrders.
 *
 * Doanh thu ghi nhận theo NGÀY TIỀN VỀ (paidAt, giờ Việt Nam) và theo số tiền GỘP khách trả (amount),
 * không trừ phí ngân hàng.
 */
import { getPlan } from "./plans";

/** Ngưỡng doanh thu năm không phải nộp thuế GTGT, TNCN của hộ / cá nhân kinh doanh (Nghị định 141/2026/NĐ-CP). */
export const TAX_FREE_REVENUE_THRESHOLD = 1_000_000_000;
/** Từ mức này (tỷ lệ so với ngưỡng) bắt đầu cảnh báo "sắp chạm ngưỡng". */
export const NEAR_THRESHOLD_RATIO = 0.8;

const VN_OFFSET_MS = 7 * 60 * 60_000;

export interface PaidOrder {
  code: string;
  plan: string;
  months: number;
  amount: number;
  paidAt: Date;
}

export interface LedgerRow {
  /** dd/mm/yyyy theo giờ Việt Nam */
  date: string;
  /** Số hiệu chứng từ = mã đơn (cũng là nội dung chuyển khoản) */
  code: string;
  description: string;
  amount: number;
}

export interface RevenueSummary {
  year: number;
  rows: LedgerRow[];
  /** 12 phần tử, tháng 1 → 12 */
  monthly: number[];
  total: number;
  /** Doanh thu quy đổi cả năm khi năm đó mới bắt đầu kinh doanh giữa chừng; bằng total nếu kinh doanh đủ năm */
  annualized: number;
  /** Số tháng có kinh doanh trong năm dùng để quy đổi (1–12) */
  activeMonths: number;
  status: "below" | "near" | "over";
}

/** Khoảng [from, to) của năm dương lịch theo giờ Việt Nam, dạng UTC để truy vấn database. */
export function vnYearRange(year: number): { from: Date; to: Date } {
  return { from: new Date(Date.UTC(year, 0, 1) - VN_OFFSET_MS), to: new Date(Date.UTC(year + 1, 0, 1) - VN_OFFSET_MS) };
}

/** Ngày giờ Việt Nam của một thời điểm, dạng các thành phần (tháng 0–11). */
function vnParts(at: Date) {
  const d = new Date(at.getTime() + VN_OFFSET_MS);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() };
}

const pad = (n: number) => String(n).padStart(2, "0");
const vnDate = (at: Date) => {
  const { year, month, day } = vnParts(at);
  return `${pad(day)}/${pad(month + 1)}/${year}`;
};

const describe = (o: PaidOrder) => `Bán gói AI ${getPlan(o.plan)?.label ?? `${o.months} tháng`} (đơn ${o.code})`;

/**
 * Số tháng kinh doanh trong năm để quy đổi doanh thu:
 *  - Đã có doanh thu từ trước năm này (startedAt trước năm) → 12 tháng, không quy đổi.
 *  - Bắt đầu trong năm → tính từ tháng bắt đầu tới hết tháng 12, tháng bắt đầu tính đủ một tháng.
 * Quy tắc quy đổi cụ thể nên xác nhận lại với cơ quan thuế quản lý.
 */
export function activeMonthsInYear(year: number, startedAt: Date | null): number {
  if (!startedAt) return 12;
  const start = vnParts(startedAt);
  if (start.year < year) return 12;
  if (start.year > year) return 0;
  return 12 - start.month;
}

export function revenueStatus(annualized: number): RevenueSummary["status"] {
  if (annualized >= TAX_FREE_REVENUE_THRESHOLD) return "over";
  if (annualized >= TAX_FREE_REVENUE_THRESHOLD * NEAR_THRESHOLD_RATIO) return "near";
  return "below";
}

/**
 * @param orders  đơn đã thanh toán (đơn ngoài năm `year` bị bỏ qua)
 * @param startedAt thời điểm bắt đầu kinh doanh (đơn thanh toán đầu tiên từ trước tới nay); null = coi như đủ năm
 */
export function summarizeRevenue(orders: readonly PaidOrder[], year: number, startedAt: Date | null): RevenueSummary {
  const inYear = orders.filter((o) => vnParts(o.paidAt).year === year).toSorted((a, b) => a.paidAt.getTime() - b.paidAt.getTime());
  const monthly = Array.from({ length: 12 }, (_, m) => inYear.filter((o) => vnParts(o.paidAt).month === m).reduce((s, o) => s + o.amount, 0));
  const total = monthly.reduce((s, v) => s + v, 0);
  const activeMonths = Math.max(1, activeMonthsInYear(year, startedAt));
  const annualized = activeMonths === 12 ? total : Math.round((total / activeMonths) * 12);
  return {
    year,
    rows: inYear.map((o) => ({ date: vnDate(o.paidAt), code: o.code, description: describe(o), amount: o.amount })),
    monthly,
    total,
    annualized,
    activeMonths,
    status: revenueStatus(annualized),
  };
}

/** Ô CSV: bọc nháy kép khi cần; chặn công thức (=, +, -, @) để Excel không thực thi khi mở file. */
function csvCell(v: string | number): string {
  let s = String(v);
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV theo cột của sổ S1a-HKD (Ngày tháng · Số hiệu chứng từ · Diễn giải · Số tiền), có BOM để Excel đọc đúng tiếng Việt. */
export function ledgerCsv(summary: RevenueSummary, sellerName: string): string {
  const lines: (string | number)[][] = [
    [`SỔ CHI TIẾT DOANH THU BÁN HÀNG HÓA, DỊCH VỤ (S1a-HKD) — NĂM ${summary.year}`],
    [`Người nộp thuế: ${sellerName}`],
    [],
    ["Ngày tháng", "Số hiệu chứng từ", "Diễn giải", "Số tiền (VND)"],
    ...summary.rows.map((r) => [r.date, r.code, r.description, r.amount]),
    ["", "", "Tổng cộng", summary.total],
  ];
  return `﻿${lines.map((l) => l.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

/** Năm hiện tại theo giờ Việt Nam. */
export const currentVnYear = (now = new Date()) => vnParts(now).year;

/** Đọc ?year= từ URL: chỉ nhận năm 2020 → năm hiện tại, còn lại dùng năm hiện tại. */
export function parseYear(value: unknown, now = new Date()): number {
  const current = currentVnYear(now);
  const n = typeof value === "string" && /^\d{4}$/.test(value) ? Number(value) : NaN;
  return n >= 2020 && n <= current ? n : current;
}
