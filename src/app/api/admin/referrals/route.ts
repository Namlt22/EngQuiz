/** POST /api/admin/referrals { code, note?, grantDays?, maxUses?, expiresAt? } — admin tạo mã giới thiệu. */
import type { NextRequest } from "next/server";
import { fail, ok, readJsonObject } from "@/server/api-response";
import { createReferral } from "@/server/access";
import { requireAdmin } from "@/server/admin-guard";
import { BillingError } from "@/server/billing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const body = await readJsonObject(req, 1024);
  if (body instanceof Response) return body;
  try {
    const created = await createReferral(body, admin.email);
    return ok({ code: created.code }, 201);
  } catch (e) {
    if (e instanceof BillingError) return fail(e.status, e.message);
    console.error("[api/admin/referrals] lỗi:", e);
    return fail(500, "Không tạo được mã. Hãy thử lại.");
  }
}
