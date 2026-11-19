/** GET /api/admin/revenue?year=2026 — tải sổ doanh thu S1a-HKD dạng CSV. Chỉ admin (ENGQUIZ_ADMIN_EMAILS). */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { readBusinessInfo, shown } from "@/lib/business";
import { ledgerCsv, parseYear, summarizeRevenue } from "@/lib/revenue";
import { fail } from "@/server/api-response";
import { isAdminEmail, listPaidOrders } from "@/server/billing";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !isAdminEmail(session.user.email)) return fail(403, "Chỉ quản trị viên mới tải được sổ doanh thu.");

  const year = parseYear(req.nextUrl.searchParams.get("year") ?? undefined);
  try {
    const { orders, startedAt } = await listPaidOrders(year);
    const csv = ledgerCsv(summarizeRevenue(orders, year, startedAt), shown(readBusinessInfo().name));
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="so-doanh-thu-S1a-HKD-${year}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[api/admin/revenue] lỗi:", e);
    return fail(500, "Không tạo được sổ doanh thu. Hãy thử lại.");
  }
}
