import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CreateReferralForm, ReferralToggle } from "@/components/admin/ReferralAdmin";
import { listReferrals } from "@/server/access";
import { isAdminEmail } from "@/server/billing";

export const metadata: Metadata = { title: "Mã giới thiệu", robots: { index: false } };
export const dynamic = "force-dynamic";

const fmtDate = (d: Date | null) => (d ? d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—");

export default async function AdminReferralsPage() {
  const session = await auth();
  if (!session?.user?.id || !isAdminEmail(session.user.email)) notFound();
  const codes = await listReferrals();
  const now = Date.now();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold">Mã giới thiệu</h1>
        <p className="text-sm text-muted">
          Người dùng nhập mã ở trang Bảng giá (hoặc menu tài khoản) để mở đầy đủ tính năng AI trong số ngày bạn đặt. Mỗi người chỉ dùng một mã một lần;
          còn hạn mà nhập mã khác thì thời gian được cộng dồn.
        </p>
      </header>

      <CreateReferralForm />

      {codes.length === 0 ? (
        <p className="card p-8 text-center text-muted">Chưa có mã nào.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="p-3">Mã</th>
                <th className="p-3">Quyền AI</th>
                <th className="p-3">Đã dùng</th>
                <th className="p-3">Nhập được đến</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ghi chú</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => {
                const expired = !!c.expiresAt && c.expiresAt.getTime() <= now;
                const full = c.maxUses !== null && c.usedCount >= c.maxUses;
                const status = !c.active ? "Đã tắt" : expired ? "Hết hạn nhập" : full ? "Hết lượt" : "Đang dùng được";
                const ok = c.active && !expired && !full;
                return (
                  <tr key={c.code} className="border-b border-line last:border-0">
                    <td className="p-3 font-mono font-semibold">{c.code}</td>
                    <td className="p-3">{c.grantDays === null ? "Không thời hạn" : `${c.grantDays} ngày`}</td>
                    <td className="p-3">
                      {c.usedCount}
                      {c.maxUses !== null ? ` / ${c.maxUses}` : ""}
                    </td>
                    <td className="p-3">{c.expiresAt ? fmtDate(c.expiresAt) : "Không hạn"}</td>
                    <td className="p-3">
                      <span className={`chip ${ok ? "bg-success/15 text-success" : "bg-surface-2 text-muted"}`}>{status}</span>
                    </td>
                    <td className="p-3 text-xs text-muted">{c.note ?? ""}</td>
                    <td className="p-3 text-right">
                      <ReferralToggle code={c.code} active={c.active} />
                    </td>
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
