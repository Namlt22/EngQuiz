/** POST /api/admin/orders/{code} { action: "approve" | "cancel" } — chỉ admin (ENGQUIZ_ADMIN_EMAILS). */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { fail, ok, readJsonObject } from "@/server/api-response";
import { approveOrder, BillingError, cancelOrder, isAdminEmail } from "@/server/billing";
import { notifyBuyerActivated } from "@/server/billing-mail";
import { isSameOrigin } from "@/server/request";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const email = session?.user?.email;
  if (!session?.user?.id || !isAdminEmail(email)) return fail(403, "Chỉ quản trị viên mới làm được thao tác này.");

  const body = await readJsonObject(req, 512);
  if (body instanceof Response) return body;
  const { code } = await params;
  try {
    if (body.action === "approve") {
      const r = await approveOrder(code, email as string);
      notifyBuyerActivated(r.email, r);
      return ok({ status: "paid", premiumUntil: r.premiumUntil.toISOString() });
    }
    if (body.action === "cancel") {
      await cancelOrder(code, email as string);
      return ok({ status: "cancelled" });
    }
    return fail(400, "Thao tác không hợp lệ.");
  } catch (e) {
    if (e instanceof BillingError) return fail(e.status, e.message);
    console.error("[api/admin/orders] lỗi:", e);
    return fail(500, "Không xử lý được đơn. Hãy thử lại.");
  }
}
