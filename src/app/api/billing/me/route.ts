/** GET /api/billing/me — trạng thái gói AI của người đang đăng nhập (+ có phải admin). */
import { auth } from "@/auth";
import { fail, ok } from "@/server/api-response";
import { getEntitlement, isAdminEmail } from "@/server/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Bạn cần đăng nhập.");
  try {
    return ok({ ...(await getEntitlement(userId)), admin: isAdminEmail(session.user?.email) });
  } catch (e) {
    console.error("[api/billing/me] lỗi:", e);
    return fail(500, "Không đọc được thông tin gói. Hãy thử lại.");
  }
}
