/** POST /api/admin/referrals/{code} { active: boolean } — admin bật / tắt một mã giới thiệu. */
import type { NextRequest } from "next/server";
import { fail, ok, readJsonObject } from "@/server/api-response";
import { setReferralActive } from "@/server/access";
import { requireAdmin } from "@/server/admin-guard";
import { BillingError } from "@/server/billing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const body = await readJsonObject(req, 256);
  if (body instanceof Response) return body;
  if (typeof body.active !== "boolean") return fail(400, "Thiếu trạng thái bật/tắt.");
  try {
    await setReferralActive((await params).code, body.active);
    return ok({ active: body.active });
  } catch (e) {
    if (e instanceof BillingError) return fail(e.status, e.message);
    console.error("[api/admin/referrals/code] lỗi:", e);
    return fail(500, "Không cập nhật được mã. Hãy thử lại.");
  }
}
