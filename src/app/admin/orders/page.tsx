import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { OrderActions } from "@/components/billing/OrderActions";
import { formatVnd, getPlan } from "@/lib/plans";
import { isAdminEmail, listOrders, toOrderView } from "@/server/billing";

export const metadata: Metadata = { title: "Quản trị đơn hàng", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS: Record<string, { text: string; cls: string }> = {
  pending: { text: "Chờ thanh toán", cls: "bg-warning-soft text-warning" },
  paid: { text: "Đã kích hoạt", cls: "bg-success/15 text-success" },
  cancelled: { text: "Đã huỷ", cls: "bg-surface-2 text-muted" },
};

const fmt = (d: Date | string | null) => (d ? new Date(d).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—");

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ all?: string }> }) {
  const session = await auth();
  // Không phải admin → 404 (không để lộ là trang quản trị tồn tại).
  if (!session?.user?.id || !isAdminEmail(session.user.email)) notFound();
  const showAll = (await searchParams).all === "1";
  const orders = await listOrders(showAll ? "all" : "pending");

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Đơn mua gói AI</h1>
          <p className="text-sm text-muted">
            Đối chiếu sao kê ngân hàng: đúng <b>số tiền</b> và <b>nội dung = mã đơn</b> thì bấm “Đã nhận tiền”.
          </p>
        </div>
        <a href={showAll ? "/admin/orders" : "/admin/orders?all=1"} className="btn-ghost">
          {showAll ? "Chỉ đơn đang chờ" : "Xem tất cả đơn"}
        </a>
      </header>

      {orders.length === 0 ? (
        <p className="card p-8 text-center text-muted">{showAll ? "Chưa có đơn nào." : "Không có đơn nào đang chờ."}</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="p-3">Mã đơn</th>
                <th className="p-3">Người mua</th>
                <th className="p-3">Gói</th>
                <th className="p-3 text-right">Số tiền</th>
                <th className="p-3">Tạo lúc</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const view = toOrderView(o);
                const st = view.expired ? { text: "Quá hạn", cls: "bg-danger-soft text-danger" } : (STATUS[o.status] ?? STATUS.cancelled);
                return (
                  <tr key={o.code} className="border-b border-line last:border-0">
                    <td className="p-3 font-mono font-semibold">{o.code}</td>
                    <td className="p-3">
                      <div>{o.user.email ?? "—"}</div>
                      <div className="text-xs text-muted">Gói hiện tại đến: {fmt(o.user.premiumUntil)}</div>
                    </td>
                    <td className="p-3">{getPlan(o.plan)?.label ?? o.plan}</td>
                    <td className="p-3 text-right font-semibold">{formatVnd(o.amount)}</td>
                    <td className="p-3">{fmt(o.createdAt)}</td>
                    <td className="p-3">
                      <span className={`chip ${st.cls}`}>{st.text}</span>
                      {o.handledBy && <div className="mt-1 text-xs text-muted">{o.handledBy}</div>}
                    </td>
                    <td className="p-3 text-right">{o.status === "pending" && <OrderActions code={o.code} amountText={formatVnd(o.amount)} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
