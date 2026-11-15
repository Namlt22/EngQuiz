/**
 * Gói AI: quyền dùng AI, đơn hàng chuyển khoản, admin duyệt.
 * Mọi thay đổi lượt / hạn gói dùng câu lệnh có điều kiện (updateMany … where) để hai request đồng thời
 * không cùng lấy được lượt cuối.
 */
import { randomInt } from "node:crypto";
import { prisma } from "./db";
import { AI_DAILY_LIMIT, AI_TRIAL_TURNS, extendPremium, getPlan, ORDER_EXPIRES_DAYS, vnDay, type AiEntitlement } from "@/lib/plans";

import { vnYearRange, type PaidOrder } from "@/lib/revenue";

export { ORDER_EXPIRES_DAYS };

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ 0/O/1/I dễ đọc nhầm
const MAX_PENDING_ORDERS = 5;

export class BillingError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// ── Quyền dùng AI ───────────────────────────────────────────────
export async function getEntitlement(userId: string, now = new Date()): Promise<AiEntitlement> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { premiumUntil: true, aiTrialUsed: true } });
  const usage = await prisma.aiUsage.findUnique({ where: { userId_day: { userId, day: vnDay(now) } } });
  const premium = Boolean(user?.premiumUntil && user.premiumUntil.getTime() > now.getTime());
  return {
    premiumUntil: user?.premiumUntil?.toISOString() ?? null,
    premium,
    trialLeft: Math.max(0, AI_TRIAL_TURNS - (user?.aiTrialUsed ?? AI_TRIAL_TURNS)),
    usedToday: usage?.count ?? 0,
    dailyLimit: AI_DAILY_LIMIT,
  };
}

/** Một lượt AI đã lấy — dùng để trả lại khi AI lỗi. */
export type AiTurn = { kind: "premium"; day: string } | { kind: "trial" };

/** Lấy một lượt AI: gói còn hạn → lượt trong ngày; chưa có gói → lượt dùng thử. Hết lượt → BillingError. */
export async function takeAiTurn(userId: string, now = new Date()): Promise<AiTurn> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { premiumUntil: true } });
  if (user?.premiumUntil && user.premiumUntil.getTime() > now.getTime()) {
    const day = vnDay(now);
    const bumped = await prisma.aiUsage.updateMany({ where: { userId, day, count: { lt: AI_DAILY_LIMIT } }, data: { count: { increment: 1 } } });
    if (bumped.count === 1) return { kind: "premium", day };
    try {
      await prisma.aiUsage.create({ data: { userId, day, count: 1 } });
      return { kind: "premium", day };
    } catch {
      // Dòng đã có (đã đủ lượt, hoặc request khác vừa tạo) → coi như hết lượt hôm nay.
      throw new BillingError(429, `Bạn đã dùng hết ${AI_DAILY_LIMIT} lượt AI hôm nay. Lượt mới có lại lúc 0 giờ.`);
    }
  }
  const trial = await prisma.user.updateMany({ where: { id: userId, aiTrialUsed: { lt: AI_TRIAL_TURNS } }, data: { aiTrialUsed: { increment: 1 } } });
  if (trial.count === 1) return { kind: "trial" };
  throw new BillingError(402, "Bạn đã dùng hết lượt AI dùng thử. Mua gói AI để tiếp tục được chấm và sửa lỗi.");
}

export async function refundAiTurn(userId: string, turn: AiTurn): Promise<void> {
  if (turn.kind === "premium") {
    await prisma.aiUsage.updateMany({ where: { userId, day: turn.day, count: { gt: 0 } }, data: { count: { decrement: 1 } } });
  } else {
    await prisma.user.updateMany({ where: { id: userId, aiTrialUsed: { gt: 0 } }, data: { aiTrialUsed: { decrement: 1 } } });
  }
}

// ── Đơn hàng ────────────────────────────────────────────────────
const newCode = () => `EQ${Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("")}`;

export interface OrderView {
  code: string;
  plan: string;
  months: number;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
  expired: boolean;
}

type OrderRow = { code: string; plan: string; months: number; amount: number; status: string; createdAt: Date; paidAt: Date | null };

export const toOrderView = (o: OrderRow, now = new Date()): OrderView => ({
  code: o.code,
  plan: o.plan,
  months: o.months,
  amount: o.amount,
  status: o.status,
  createdAt: o.createdAt.toISOString(),
  paidAt: o.paidAt?.toISOString() ?? null,
  expired: o.status === "pending" && now.getTime() - o.createdAt.getTime() > ORDER_EXPIRES_DAYS * 24 * 60 * 60_000,
});

/** Tạo đơn (hoặc dùng lại đơn đang chờ cùng gói, chưa quá hạn) — tránh tạo hàng loạt đơn khi bấm nhiều lần. */
export async function createOrder(userId: string, planId: unknown, now = new Date()): Promise<{ order: OrderView; created: boolean }> {
  const plan = getPlan(planId);
  if (!plan) throw new BillingError(400, "Gói không hợp lệ.");
  const since = new Date(now.getTime() - ORDER_EXPIRES_DAYS * 24 * 60 * 60_000);
  const existing = await prisma.order.findFirst({
    where: { userId, plan: plan.id, status: "pending", createdAt: { gt: since } },
    orderBy: { createdAt: "desc" },
  });
  if (existing && existing.amount === plan.price) return { order: toOrderView(existing, now), created: false };

  const pending = await prisma.order.count({ where: { userId, status: "pending", createdAt: { gt: since } } });
  if (pending >= MAX_PENDING_ORDERS) throw new BillingError(429, "Bạn có quá nhiều đơn đang chờ thanh toán. Hãy thanh toán hoặc chờ đơn cũ hết hạn.");

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const order = await prisma.order.create({ data: { code: newCode(), userId, plan: plan.id, months: plan.months, amount: plan.price } });
      return { order: toOrderView(order, now), created: true };
    } catch (e) {
      if (attempt === 4) throw e; // trùng mã (rất hiếm) → thử mã khác
    }
  }
  throw new Error("unreachable");
}

export async function getOwnOrder(userId: string, code: string) {
  const order = await prisma.order.findUnique({ where: { code } });
  return order && order.userId === userId ? order : null;
}

/** Admin xác nhận đã nhận tiền: đơn → paid, gia hạn gói (cộng dồn nếu còn hạn). Chạy một lần duy nhất cho mỗi đơn. */
export async function approveOrder(code: string, adminEmail: string, now = new Date()) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { code }, include: { user: { select: { id: true, email: true, premiumUntil: true } } } });
    if (!order) throw new BillingError(404, "Không tìm thấy đơn.");
    const claimed = await tx.order.updateMany({ where: { code, status: "pending" }, data: { status: "paid", paidAt: now, handledBy: adminEmail } });
    if (claimed.count !== 1) throw new BillingError(409, `Đơn đã ở trạng thái "${order.status}".`);
    const premiumUntil = extendPremium(order.user.premiumUntil, order.months, now);
    await tx.user.update({ where: { id: order.userId }, data: { premiumUntil } });
    return { email: order.user.email, premiumUntil, months: order.months, amount: order.amount };
  });
}

export async function cancelOrder(code: string, adminEmail: string) {
  const r = await prisma.order.updateMany({ where: { code, status: "pending" }, data: { status: "cancelled", handledBy: adminEmail } });
  if (r.count !== 1) throw new BillingError(409, "Chỉ huỷ được đơn đang chờ.");
}

export async function listOrders(status: "pending" | "all", take = 100) {
  return prisma.order.findMany({
    where: status === "pending" ? { status: "pending" } : {},
    orderBy: { createdAt: "desc" },
    take,
    include: { user: { select: { email: true, name: true, premiumUntil: true } } },
  });
}

// ── Admin & tài khoản nhận tiền ─────────────────────────────────
/** Admin = email nằm trong ENGQUIZ_ADMIN_EMAILS (phân tách bằng dấu phẩy). */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ENGQUIZ_ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.trim().toLowerCase());
}

export interface BankInfo {
  bank: string;
  accountNo: string;
  accountName: string;
}

/** Tài khoản nhận chuyển khoản (VietQR). bank = mã ngân hàng VietQR, vd VCB, MB, TCB, ACB, hoặc BIN 6 số. */
export function bankInfo(): BankInfo | null {
  const bank = process.env.BANK_CODE?.trim();
  const accountNo = process.env.BANK_ACCOUNT_NO?.trim();
  const accountName = process.env.BANK_ACCOUNT_NAME?.trim();
  if (!bank || !accountNo || !accountName) return null;
  return { bank, accountNo, accountName };
}

/** Ảnh QR chuyển khoản điền sẵn số tiền + nội dung (dịch vụ ảnh công khai của VietQR). */
export function vietQrUrl(info: BankInfo, amount: number, content: string): string {
  const q = new URLSearchParams({ amount: String(amount), addInfo: content, accountName: info.accountName });
  return `https://img.vietqr.io/image/${encodeURIComponent(info.bank)}-${encodeURIComponent(info.accountNo)}-compact2.png?${q}`;
}

// ── Sổ doanh thu ────────────────────────────────────────────────
/** Đơn đã thanh toán trong năm (giờ Việt Nam) + thời điểm có đơn thanh toán đầu tiên — dữ liệu cho src/lib/revenue.ts. */
export async function listPaidOrders(year: number): Promise<{ orders: PaidOrder[]; startedAt: Date | null }> {
  const { from, to } = vnYearRange(year);
  const [rows, first] = await Promise.all([
    prisma.order.findMany({
      where: { status: "paid", paidAt: { gte: from, lt: to } },
      orderBy: { paidAt: "asc" },
      select: { code: true, plan: true, months: true, amount: true, paidAt: true },
    }),
    prisma.order.findFirst({ where: { status: "paid", paidAt: { not: null } }, orderBy: { paidAt: "asc" }, select: { paidAt: true } }),
  ]);
  const orders = rows.flatMap((o) => (o.paidAt ? [{ ...o, paidAt: o.paidAt }] : []));
  return { orders, startedAt: first?.paidAt ?? null };
}
