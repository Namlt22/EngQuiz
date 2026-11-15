/** GET /api/billing/orders/{code} — trạng thái đơn của chính người mua (trang thanh toán hỏi định kỳ). */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { fail, ok } from "@/server/api-response";
import { getOwnOrder, toOrderView } from "@/server/billing";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Bạn cần đăng nhập.");
  const { code } = await params;
  if (!/^EQ[A-Z0-9]{6}$/.test(code)) return fail(404, "Không tìm thấy đơn.");
  try {
    const order = await getOwnOrder(userId, code);
    return order ? ok(toOrderView(order)) : fail(404, "Không tìm thấy đơn.");
  } catch (e) {
    console.error("[api/billing/orders/code] lỗi:", e);
    return fail(500, "Không đọc được đơn. Hãy thử lại.");
  }
}
