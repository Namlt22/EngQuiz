/**
 * Các gói AI và quyền theo loại người dùng. Dùng chung cho trang Bảng giá, thanh toán và server.
 *  - Khách (chưa đăng nhập): học thử GUEST_TRIAL_ITEMS bài, không có AI.
 *  - Tài khoản miễn phí: mọi tính năng không dùng AI + AI_TRIAL_TURNS lượt AI tặng.
 *  - Gói AI: AI chấm & sửa bài nói, tối đa AI_DAILY_LIMIT lượt/ngày.
 */
export const GUEST_TRIAL_ITEMS = 5;
export const AI_TRIAL_TURNS = 3;
export const AI_DAILY_LIMIT = 30;
/** Đơn chờ chuyển khoản hết hiệu lực sau số ngày này. */
export const ORDER_EXPIRES_DAYS = 3;

export type PlanId = "1m" | "3m" | "6m" | "12m";

export interface Plan {
  id: PlanId;
  label: string;
  months: number;
  /** VND */
  price: number;
  badge?: string;
}

export const PLANS: readonly Plan[] = [
  { id: "1m", label: "1 tháng", months: 1, price: 99_000 },
  { id: "3m", label: "3 tháng", months: 3, price: 249_000, badge: "Phổ biến" },
  { id: "6m", label: "6 tháng", months: 6, price: 449_000 },
  { id: "12m", label: "1 năm", months: 12, price: 799_000, badge: "Tiết kiệm nhất" },
];

export const getPlan = (id: unknown): Plan | undefined => PLANS.find((p) => p.id === id);

export const BASE_MONTHLY = PLANS[0].price;
export const perMonth = (p: Plan) => Math.round(p.price / p.months / 1000) * 1000;
/** Phần trăm tiết kiệm so với mua lẻ từng tháng. */
export const savingPercent = (p: Plan) => Math.round((1 - p.price / (BASE_MONTHLY * p.months)) * 100);

export const formatVnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

/** Cộng tháng theo lịch; ngày cuối tháng không bị "tràn" (31/1 + 1 tháng → 28 hoặc 29/2). */
export function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d;
}

/** Gia hạn: tính tiếp từ ngày hết hạn nếu gói còn hạn, ngược lại từ bây giờ. */
export function extendPremium(current: Date | null, months: number, now: Date): Date {
  const base = current && current.getTime() > now.getTime() ? current : now;
  return addMonths(base, months);
}

/** Ngày (YYYY-MM-DD) theo giờ Việt Nam — mốc reset lượt AI hằng ngày. */
export function vnDay(at: Date): string {
  return new Date(at.getTime() + 7 * 60 * 60_000).toISOString().slice(0, 10);
}

/** Trạng thái quyền AI gửi cho client. */
export interface AiEntitlement {
  premiumUntil: string | null;
  premium: boolean;
  trialLeft: number;
  usedToday: number;
  dailyLimit: number;
}
