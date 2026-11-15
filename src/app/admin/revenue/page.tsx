import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { missingBusinessFields, readBusinessInfo } from "@/lib/business";
import { formatVnd } from "@/lib/plans";
import { currentVnYear, parseYear, summarizeRevenue, TAX_FREE_REVENUE_THRESHOLD, type RevenueSummary } from "@/lib/revenue";
import { isAdminEmail, listPaidOrders, salesOpen } from "@/server/billing";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Sổ doanh thu", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS: Record<RevenueSummary["status"], { cls: string; text: (s: RevenueSummary) => string }> = {
  below: { cls: "bg-success/15 text-success", text: () => "Dưới ngưỡng: không phải nộp thuế GTGT, TNCN. Vẫn phải thông báo doanh thu." },
  near: { cls: "bg-warning-soft text-warning", text: () => "Đã quá 80% ngưỡng 1 tỷ. Theo dõi sát doanh thu những tháng còn lại." },
  over: {
    cls: "bg-danger-soft text-danger",
    text: (s) =>
      s.activeMonths < 12
        ? `Doanh thu quy đổi cả năm (${s.activeMonths} tháng kinh doanh) đã chạm ngưỡng: có thể phải kê khai, nộp thuế GTGT và TNCN. Hỏi chi cục thuế để xác nhận.`
        : "Đã chạm ngưỡng 1 tỷ: phải kê khai, nộp thuế GTGT và TNCN theo quy định.",
  },
};

export default async function AdminRevenuePage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !isAdminEmail(session.user.email)) notFound();
  if (!salesOpen()) {
    return <ComingSoon title="Sổ doanh thu — sắp ra mắt" description="Đang tạm dừng bán gói AI nên chưa có doanh thu. Sổ doanh thu sẽ hiện lại khi mở bán (ENGQUIZ_SALES_OPEN=1)." />;
  }
  const year = parseYear((await searchParams).year);
  const { orders, startedAt } = await listPaidOrders(year);
  const s = summarizeRevenue(orders, year, startedAt);
  const missing = missingBusinessFields(readBusinessInfo());
  const years = Array.from({ length: currentVnYear() - 2025 }, (_, i) => 2026 + i).reverse();
  const st = STATUS[s.status];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Sổ doanh thu {year}</h1>
          <p className="text-sm text-muted">
            Đơn đã duyệt, ghi theo ngày tiền về và số tiền khách chuyển (chưa trừ phí). Số liệu này dùng cho sổ S1a-HKD và thông báo doanh thu Mẫu 01/TKN-CNKD (nộp chậm nhất 31/01/{year + 1}).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {years.map((y) => (
            <Link key={y} href={`/admin/revenue?year=${y}`} className={y === year ? "btn-primary" : "btn-ghost"}>
              {y}
            </Link>
          ))}
          <a href={`/api/admin/revenue?year=${year}`} className="btn-ghost">
            Tải CSV (S1a-HKD)
          </a>
          <Link href="/admin/orders" className="btn-ghost">
            Đơn hàng
          </Link>
        </div>
      </header>

      {missing.length > 0 && (
        <p className="rounded-xl bg-warning-soft p-3 text-sm">
          Chưa điền thông tin người bán bắt buộc công khai trên website: <code>{missing.join(", ")}</code>. Điền trong <code>.env</code> rồi build lại trước khi mở bán.
        </p>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Doanh thu thực tế" value={formatVnd(s.total)} sub={`${s.rows.length} đơn`} />
        <Stat label="Quy đổi cả năm" value={formatVnd(s.annualized)} sub={s.activeMonths < 12 ? `từ ${s.activeMonths} tháng kinh doanh` : "kinh doanh đủ năm"} />
        <Stat label="Ngưỡng miễn thuế" value={formatVnd(TAX_FREE_REVENUE_THRESHOLD)} sub={`đã dùng ${Math.round((s.annualized / TAX_FREE_REVENUE_THRESHOLD) * 100)}%`} />
      </section>
      <p className={`rounded-xl p-3 text-sm font-medium ${st.cls}`}>{st.text(s)}</p>

      <section className="card overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              {s.monthly.map((_, m) => (
                <th key={m} className="p-2 text-right">
                  T{m + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {s.monthly.map((v, m) => (
                <td key={m} className="p-2 text-right tabular-nums">
                  {v ? (v / 1000).toLocaleString("vi-VN") + "k" : "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>

      {s.rows.length === 0 ? (
        <p className="card p-8 text-center text-muted">Chưa có đơn nào được thanh toán trong năm {year}.</p>
      ) : (
        <section className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="p-3">Ngày</th>
                <th className="p-3">Số hiệu</th>
                <th className="p-3">Diễn giải</th>
                <th className="p-3 text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r) => (
                <tr key={r.code} className="border-b border-line last:border-0">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3 font-mono">{r.code}</td>
                  <td className="p-3">{r.description}</td>
                  <td className="p-3 text-right font-semibold tabular-nums">{formatVnd(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="text-2xl font-extrabold tabular-nums">{value}</div>
      <div className="text-xs text-muted">{sub}</div>
    </div>
  );
}
