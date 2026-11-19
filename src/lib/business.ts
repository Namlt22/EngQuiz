/**
 * Thông tin chủ sở hữu website — bắt buộc công khai với website TMĐT bán hàng (Luật TMĐT, Nghị định 248/2026/NĐ-CP).
 * Người bán là cá nhân kinh doanh. Đọc từ biến môi trường ENGQUIZ_BUSINESS_* để không phải sửa code khi đổi thông tin.
 * Chỉ dùng ở server (Server Component, route handler). Đổi giá trị → build lại (npm run build / redeploy).
 */

export interface BusinessInfo {
  /** Họ tên người bán (cá nhân kinh doanh), đúng như trên giấy tờ tuỳ thân */
  name: string;
  /** Mã số thuế cá nhân (số định danh cá nhân 12 số) */
  taxCode: string;
  address: string;
  email: string;
  phone: string;
  /** Link xác nhận đã thông báo website với cơ quan quản lý (online.gov.vn) — trống nếu chưa có */
  noticeUrl: string;
}

const FIELDS: Record<keyof BusinessInfo, string> = {
  name: "ENGQUIZ_BUSINESS_NAME",
  taxCode: "ENGQUIZ_BUSINESS_TAX_CODE",
  address: "ENGQUIZ_BUSINESS_ADDRESS",
  email: "ENGQUIZ_BUSINESS_EMAIL",
  phone: "ENGQUIZ_BUSINESS_PHONE",
  noticeUrl: "ENGQUIZ_BUSINESS_NOTICE_URL",
};

/** Các trường bắt buộc phải công khai trước khi mở bán. noticeUrl có sau khi nộp thông báo nên không bắt buộc. */
const REQUIRED: readonly (keyof BusinessInfo)[] = ["name", "taxCode", "address", "email", "phone"];

/** Hiện thay cho giá trị chưa cấu hình (trang công khai không lộ tên biến môi trường). */
export const MISSING_VALUE = "(đang cập nhật)";

type Env = Record<string, string | undefined>;

export function readBusinessInfo(env: Env = process.env): BusinessInfo {
  const entries = Object.entries(FIELDS).map(([key, envName]) => [key, env[envName]?.trim() ?? ""]);
  return Object.fromEntries(entries) as BusinessInfo;
}

/** Tên biến môi trường còn thiếu — để trang admin nhắc chủ website điền trước khi bán. */
export function missingBusinessFields(info: BusinessInfo): string[] {
  return REQUIRED.filter((k) => !info[k]).map((k) => FIELDS[k]);
}

/** Giá trị để hiển thị: chuỗi trống → MISSING_VALUE. */
export const shown = (v: string) => v || MISSING_VALUE;

/** Chỉ nhận link https tới cổng thông báo của Bộ Công Thương — tránh chèn link lạ vào chân trang. */
export function safeNoticeUrl(url: string): string | null {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)online\.gov\.vn$/.test(u.hostname) ? u.toString() : null;
  } catch {
    return null;
  }
}
