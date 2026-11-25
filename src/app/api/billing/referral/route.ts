/** POST /api/billing/referral { code } — người dùng nhập mã giới thiệu để mở đầy đủ tính năng AI. */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { fail, ok, readJsonObject } from "@/server/api-response";
import { redeemReferral } from "@/server/access";
import { BillingError } from "@/server/billing";
import { createRateLimiter } from "@/server/rate-limit";
import { clientIp, isSameOrigin } from "@/server/request";

export const dynamic = "force-dynamic";

/** Chống dò mã: mỗi tài khoản 10 lần / giờ, mỗi IP 20 lần / giờ. */
const perUser = createRateLimiter({ limit: 10, windowMs: 60 * 60_000 });
const perIp = createRateLimiter({ limit: 20, windowMs: 60 * 60_000 });

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để nhập mã giới thiệu.");
  if (!perUser.check(userId) || !perIp.check(clientIp(req))) return fail(429, "Bạn nhập mã quá nhiều lần. Hãy thử lại sau 1 giờ.");

  const body = await readJsonObject(req, 512);
  if (body instanceof Response) return body;
  try {
    const { premiumUntil, code } = await redeemReferral(userId, body.code);
    return ok({ code, premiumUntil: premiumUntil.toISOString() });
  } catch (e) {
    if (e instanceof BillingError) return fail(e.status, e.message);
    console.error("[api/billing/referral] lỗi:", e);
    return fail(500, "Không áp dụng được mã. Hãy thử lại.");
  }
}
