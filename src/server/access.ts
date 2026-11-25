/**
 * Quyền truy cập do admin kiểm soát:
 *  - khoá / mở tài khoản, đặt hạn dùng tài khoản (accessUntil) → hết hạn thì không đăng nhập được;
 *  - cấp / thu hồi quyền dùng AI đầy đủ (premiumUntil), đặt lại lượt AI dùng thử;
 *  - mã giới thiệu: người dùng nhập mã → được dùng AI đầy đủ trong grantDays ngày (null = không thời hạn).
 * Mọi thay đổi số lượt dùng mã đều có điều kiện trong câu lệnh để hai người nhập cùng lúc không vượt maxUses.
 */
import { isUniqueViolation, prisma } from "./db";
import { BillingError } from "./billing";

/** "Không thời hạn": premiumUntil đặt tới mốc rất xa thay cho null (null nghĩa là chưa từng có gói). */
export const PERMANENT_UNTIL = new Date("2099-12-31T16:59:59Z");
const DAY_MS = 24 * 60 * 60_000;
const CODE_RE = /^[A-Z0-9][A-Z0-9-]{2,31}$/;
const NOTE_MAX = 200;

export const isPermanent = (d: Date | string | null | undefined) => !!d && new Date(d).getTime() >= PERMANENT_UNTIL.getTime();
export const normalizeReferralCode = (raw: unknown) => (typeof raw === "string" ? raw.trim().toUpperCase().replace(/\s+/g, "") : "");

/* ---------------- Mã giới thiệu ---------------- */

/** Người dùng nhập mã giới thiệu → gia hạn quyền dùng AI. Trả về hạn mới. */
export async function redeemReferral(userId: string, rawCode: unknown, now = new Date()): Promise<{ premiumUntil: Date; code: string }> {
  const code = normalizeReferralCode(rawCode);
  if (!CODE_RE.test(code)) throw new BillingError(400, "Mã giới thiệu không hợp lệ.");
  return prisma.$transaction(async (tx) => {
    const ref = await tx.referralCode.findUnique({ where: { code } });
    if (!ref || !ref.active || (ref.expiresAt && ref.expiresAt.getTime() <= now.getTime())) {
      throw new BillingError(404, "Mã giới thiệu không đúng hoặc đã hết hiệu lực.");
    }
    if (await tx.referralRedemption.findUnique({ where: { code_userId: { code, userId } } })) {
      throw new BillingError(409, "Bạn đã dùng mã này rồi.");
    }
    const claimed = await tx.referralCode.updateMany({
      where: { code, active: true, ...(ref.maxUses !== null ? { usedCount: { lt: ref.maxUses } } : {}) },
      data: { usedCount: { increment: 1 } },
    });
    if (claimed.count !== 1) throw new BillingError(410, "Mã giới thiệu đã hết lượt sử dụng.");
    await tx.referralRedemption.create({ data: { code, userId } });

    const user = await tx.user.findUniqueOrThrow({ where: { id: userId }, select: { premiumUntil: true } });
    const base = user.premiumUntil && user.premiumUntil.getTime() > now.getTime() ? user.premiumUntil : now;
    const premiumUntil = ref.grantDays === null ? PERMANENT_UNTIL : new Date(Math.min(base.getTime() + ref.grantDays * DAY_MS, PERMANENT_UNTIL.getTime()));
    await tx.user.update({ where: { id: userId }, data: { premiumUntil } });
    return { premiumUntil, code };
  });
}

export interface ReferralInput {
  code?: unknown;
  note?: unknown;
  grantDays?: unknown;
  maxUses?: unknown;
  expiresAt?: unknown;
}

const optionalInt = (v: unknown, name: string, max: number): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new BillingError(400, `${name}: nhập số nguyên từ 1 đến ${max}, hoặc để trống.`);
  return n;
};

const optionalDate = (v: unknown, name: string): Date | null => {
  if (v === null || v === undefined || v === "") return null;
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) throw new BillingError(400, `${name}: ngày không hợp lệ.`);
  return d;
};

export async function createReferral(input: ReferralInput, adminEmail: string) {
  const code = normalizeReferralCode(input.code);
  if (!CODE_RE.test(code)) throw new BillingError(400, "Mã: 3–32 ký tự, chỉ gồm chữ không dấu, số và dấu gạch ngang.");
  const note = typeof input.note === "string" ? input.note.trim().slice(0, NOTE_MAX) || null : null;
  const data = {
    code,
    note,
    grantDays: optionalInt(input.grantDays, "Số ngày dùng", 3650),
    maxUses: optionalInt(input.maxUses, "Số người dùng tối đa", 100_000),
    expiresAt: optionalDate(input.expiresAt, "Hạn nhập mã"),
    createdBy: adminEmail,
  };
  try {
    return await prisma.referralCode.create({ data });
  } catch (e) {
    if (isUniqueViolation(e)) throw new BillingError(409, "Mã này đã tồn tại.");
    throw e;
  }
}

export async function setReferralActive(code: string, active: boolean) {
  const r = await prisma.referralCode.updateMany({ where: { code: normalizeReferralCode(code) }, data: { active } });
  if (r.count !== 1) throw new BillingError(404, "Không tìm thấy mã.");
}

export const listReferrals = () => prisma.referralCode.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

/* ---------------- Quản lý tài khoản (admin) ---------------- */

export async function listUsers(search: string, take = 100) {
  const q = search.trim();
  return prisma.user.findMany({
    where: q ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] } : {},
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      disabled: true,
      accessUntil: true,
      premiumUntil: true,
      aiTrialUsed: true,
      _count: { select: { sessions: true } },
      referralRedemptions: { select: { code: true }, orderBy: { redeemedAt: "desc" }, take: 3 },
    },
  });
}

export type UserAction =
  | { action: "disable" }
  | { action: "enable" }
  | { action: "setAccessUntil"; until: unknown }
  | { action: "grantAi"; until: unknown }
  | { action: "revokeAi" }
  | { action: "resetTrial" }
  | { action: "signOut" };

/** Thực hiện một thao tác admin lên tài khoản. Khoá / hết hạn → đăng xuất mọi phiên đang mở. */
export async function applyUserAction(userId: string, input: Record<string, unknown>, adminUserId: string, now = new Date()) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) throw new BillingError(404, "Không tìm thấy tài khoản.");
  const self = userId === adminUserId;
  const signOutAll = () => prisma.session.deleteMany({ where: { userId } });

  switch (input.action) {
    case "disable":
      if (self) throw new BillingError(400, "Bạn không thể tự khoá tài khoản của mình.");
      await prisma.user.update({ where: { id: userId }, data: { disabled: true } });
      await signOutAll();
      return;
    case "enable":
      await prisma.user.update({ where: { id: userId }, data: { disabled: false } });
      return;
    case "setAccessUntil": {
      const until = optionalDate(input.until, "Hạn tài khoản");
      if (self && until && until.getTime() <= now.getTime()) throw new BillingError(400, "Không thể đặt hạn đã qua cho chính bạn.");
      await prisma.user.update({ where: { id: userId }, data: { accessUntil: until } });
      if (until && until.getTime() <= now.getTime()) await signOutAll();
      return;
    }
    case "grantAi": {
      const until = input.until === "permanent" ? PERMANENT_UNTIL : optionalDate(input.until, "Hạn dùng AI");
      if (!until) throw new BillingError(400, "Chọn ngày hết hạn hoặc 'không thời hạn'.");
      await prisma.user.update({ where: { id: userId }, data: { premiumUntil: until } });
      return;
    }
    case "revokeAi":
      await prisma.user.update({ where: { id: userId }, data: { premiumUntil: now } });
      return;
    case "resetTrial":
      await prisma.user.update({ where: { id: userId }, data: { aiTrialUsed: 0 } });
      return;
    case "signOut":
      await signOutAll();
      return;
    default:
      throw new BillingError(400, "Thao tác không hợp lệ.");
  }
}
