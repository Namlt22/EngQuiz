/**
 * POST /api/admin/users/{id} { action, until? } — admin kiểm soát tài khoản:
 * disable | enable | setAccessUntil | grantAi (until: ngày hoặc "permanent") | revokeAi | resetTrial | signOut
 */
import type { NextRequest } from "next/server";
import { fail, ok, readJsonObject } from "@/server/api-response";
import { applyUserAction } from "@/server/access";
import { requireAdmin } from "@/server/admin-guard";
import { BillingError } from "@/server/billing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const body = await readJsonObject(req, 512);
  if (body instanceof Response) return body;
  const { id } = await params;
  try {
    await applyUserAction(id, body, admin.id);
    return ok({ done: true });
  } catch (e) {
    if (e instanceof BillingError) return fail(e.status, e.message);
    console.error("[api/admin/users] lỗi:", e);
    return fail(500, "Không thực hiện được. Hãy thử lại.");
  }
}
