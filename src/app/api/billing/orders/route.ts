/** POST /api/billing/orders { plan } — tạo đơn mua gói AI (hoặc trả lại đơn đang chờ cùng gói). */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { fail, ok, readJsonObject } from "@/server/api-response";
import { BillingError, createOrder } from "@/server/billing";
import { notifyAdminsNewOrder } from "@/server/billing-mail";
import { createRateLimiter } from "@/server/rate-limit";
import { isSameOrigin } from "@/server/request";

export const dynamic = "force-dynamic";

const perUser = createRateLimiter({ limit: 10, windowMs: 60 * 60_000 });

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để mua gói.");
  if (!perUser.check(userId)) return fail(429, "Bạn thao tác quá nhiều lần. Hãy thử lại sau.");

  const body = await readJsonObject(req, 1024);
  if (body instanceof Response) return body;
  try {
    const { order, created } = await createOrder(userId, body.plan);
    if (created) notifyAdminsNewOrder(order, session.user?.email ?? null);
    return ok(order, created ? 201 : 200);
  } catch (e) {
    if (e instanceof BillingError) return fail(e.status, e.message);
    console.error("[api/billing/orders] lỗi:", e);
    return fail(500, "Không tạo được đơn. Hãy thử lại.");
  }
}
