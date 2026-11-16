import { beforeEach, describe, expect, it, vi } from "vitest";

/** Prisma giả: chỉ các bảng / hàm mà billing.ts và access.ts dùng. */
const user = { findUnique: vi.fn(), updateMany: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn() };
const aiUsage = { updateMany: vi.fn(), create: vi.fn() };
const referralCode = { findUnique: vi.fn(), updateMany: vi.fn(), create: vi.fn() };
const referralRedemption = { findUnique: vi.fn(), create: vi.fn() };
const tx = { user, referralCode, referralRedemption };
const prisma = { user, aiUsage, referralCode, referralRedemption, $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)) };

class FakeKnownError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
vi.mock("./db", () => ({ prisma, isUniqueViolation: (e: unknown) => e instanceof FakeKnownError && e.code === "P2002" }));

const { BillingError, refundAiTurn, takeAiTurn } = await import("./billing");
const { PERMANENT_UNTIL, createReferral, redeemReferral } = await import("./access");
const { AI_DAILY_LIMIT } = await import("@/lib/plans");

const NOW = new Date("2026-11-16T03:00:00Z");
const DAY_MS = 86_400_000;
const all = [user, aiUsage, referralCode, referralRedemption].flatMap((t) => Object.values(t));

beforeEach(() => {
  all.forEach((f) => f.mockReset());
});

async function expectBillingError(p: Promise<unknown>, status: number) {
  const err = await p.catch((e: unknown) => e);
  expect(err).toBeInstanceOf(BillingError);
  expect((err as InstanceType<typeof BillingError>).status).toBe(status);
}

describe("takeAiTurn — lượt AI", () => {
  it("chưa có gói: còn lượt thử → trial; hết lượt thử → 402", async () => {
    user.findUnique.mockResolvedValue({ premiumUntil: null });
    user.updateMany.mockResolvedValueOnce({ count: 1 });
    expect(await takeAiTurn("u1", NOW)).toEqual({ kind: "trial" });
    user.updateMany.mockResolvedValueOnce({ count: 0 });
    await expectBillingError(takeAiTurn("u1", NOW), 402);
  });

  it("gói đã hết hạn hôm qua → quay về lượt dùng thử", async () => {
    user.findUnique.mockResolvedValue({ premiumUntil: new Date(NOW.getTime() - DAY_MS) });
    user.updateMany.mockResolvedValue({ count: 1 });
    expect(await takeAiTurn("u1", NOW)).toEqual({ kind: "trial" });
    expect(aiUsage.updateMany).not.toHaveBeenCalled();
  });

  it("có gói: còn lượt trong ngày → premium; đủ lượt → 429", async () => {
    user.findUnique.mockResolvedValue({ premiumUntil: new Date(NOW.getTime() + DAY_MS) });
    aiUsage.updateMany.mockResolvedValueOnce({ count: 1 });
    expect(await takeAiTurn("u1", NOW)).toMatchObject({ kind: "premium" });

    aiUsage.updateMany.mockResolvedValue({ count: 0 });
    aiUsage.create.mockRejectedValueOnce(new FakeKnownError("P2002"));
    await expectBillingError(takeAiTurn("u1", NOW), 429);
    expect(aiUsage.updateMany.mock.calls.at(-1)?.[0]).toMatchObject({ where: { count: { lt: AI_DAILY_LIMIT } } });
  });

  it("lượt đầu trong ngày bị request khác tạo dòng trước (P2002) → thử cộng lại, không báo nhầm hết lượt", async () => {
    user.findUnique.mockResolvedValue({ premiumUntil: new Date(NOW.getTime() + DAY_MS) });
    aiUsage.updateMany.mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 1 });
    aiUsage.create.mockRejectedValueOnce(new FakeKnownError("P2002"));
    expect(await takeAiTurn("u1", NOW)).toMatchObject({ kind: "premium" });
  });

  it("lỗi database thật khi tạo dòng → ném lỗi gốc, không biến thành 429", async () => {
    user.findUnique.mockResolvedValue({ premiumUntil: new Date(NOW.getTime() + DAY_MS) });
    aiUsage.updateMany.mockResolvedValue({ count: 0 });
    const down = new Error("connection lost");
    aiUsage.create.mockRejectedValueOnce(down);
    await expect(takeAiTurn("u1", NOW)).rejects.toBe(down);
  });

  it("refundAiTurn trả đúng loại lượt và không xuống dưới 0", async () => {
    aiUsage.updateMany.mockResolvedValue({ count: 1 });
    user.updateMany.mockResolvedValue({ count: 1 });
    await refundAiTurn("u1", { kind: "premium", day: "2026-11-16" });
    expect(aiUsage.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "u1", day: "2026-11-16", count: { gt: 0 } } }));
    await refundAiTurn("u1", { kind: "trial" });
    expect(user.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "u1", aiTrialUsed: { gt: 0 } } }));
  });
});

describe("redeemReferral — mã giới thiệu", () => {
  const code = (patch: Record<string, unknown> = {}) => ({ code: "VIP-2026", active: true, expiresAt: null, maxUses: null, grantDays: 30, ...patch });

  function happyPath(ref = code(), premiumUntil: Date | null = null) {
    referralCode.findUnique.mockResolvedValue(ref);
    referralRedemption.findUnique.mockResolvedValue(null);
    referralCode.updateMany.mockResolvedValue({ count: 1 });
    referralRedemption.create.mockResolvedValue({});
    user.findUniqueOrThrow.mockResolvedValue({ premiumUntil });
    user.update.mockResolvedValue({});
  }

  it("chuẩn hóa mã (chữ thường, khoảng trắng) và cấp đúng số ngày", async () => {
    happyPath();
    const r = await redeemReferral("u1", "  vip-2026 ", NOW);
    expect(r.code).toBe("VIP-2026");
    expect(r.premiumUntil.getTime()).toBe(NOW.getTime() + 30 * DAY_MS);
  });

  it("đang có gói còn hạn → cộng dồn; mã không thời hạn → PERMANENT_UNTIL", async () => {
    const until = new Date(NOW.getTime() + 10 * DAY_MS);
    happyPath(code(), until);
    expect((await redeemReferral("u1", "VIP-2026", NOW)).premiumUntil.getTime()).toBe(until.getTime() + 30 * DAY_MS);
    happyPath(code({ grantDays: null }));
    expect((await redeemReferral("u1", "VIP-2026", NOW)).premiumUntil).toEqual(PERMANENT_UNTIL);
  });

  it("mã tắt / hết hạn → 404; đã dùng → 409; hết lượt → 410; sai định dạng → 400", async () => {
    referralCode.findUnique.mockResolvedValueOnce(code({ active: false }));
    await expectBillingError(redeemReferral("u1", "VIP-2026", NOW), 404);
    referralCode.findUnique.mockResolvedValueOnce(code({ expiresAt: new Date(NOW.getTime() - 1) }));
    await expectBillingError(redeemReferral("u1", "VIP-2026", NOW), 404);

    referralCode.findUnique.mockResolvedValue(code());
    referralRedemption.findUnique.mockResolvedValueOnce({ id: "r1" });
    await expectBillingError(redeemReferral("u1", "VIP-2026", NOW), 409);

    referralRedemption.findUnique.mockResolvedValue(null);
    referralCode.updateMany.mockResolvedValueOnce({ count: 0 });
    await expectBillingError(redeemReferral("u1", "VIP-2026", NOW), 410);

    await expectBillingError(redeemReferral("u1", "!!", NOW), 400);
  });
});

describe("createReferral — lỗi trùng mã", () => {
  it("trùng mã (P2002) → 409; lỗi database khác → ném lỗi gốc", async () => {
    referralCode.create.mockRejectedValueOnce(new FakeKnownError("P2002"));
    await expectBillingError(createReferral({ code: "VIP-2026" }, "admin@example.com"), 409);
    const down = new Error("connection lost");
    referralCode.create.mockRejectedValueOnce(down);
    await expect(createReferral({ code: "VIP-2026" }, "admin@example.com")).rejects.toBe(down);
  });
});
