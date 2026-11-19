import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { UserActions } from "@/components/admin/UserActions";
import { accountBlockReason } from "@/lib/account-access";
import { AI_TRIAL_TURNS } from "@/lib/plans";
import { isPermanent, listUsers } from "@/server/access";
import { isAdminEmail } from "@/server/billing";

export const metadata: Metadata = { title: "Quản lý tài khoản", robots: { index: false } };
export const dynamic = "force-dynamic";

const fmtDate = (d: Date | null) => (d ? d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—");

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !isAdminEmail(session.user.email)) notFound();
  const q = ((await searchParams).q ?? "").slice(0, 100);
  const users = await listUsers(q);
  const now = new Date();

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Tài khoản</h1>
          <p className="text-sm text-muted">
            Khoá / mở, đặt hạn dùng tài khoản (hết hạn là không đăng nhập được), cấp hoặc thu hồi quyền dùng AI đầy đủ. Tài khoản thường có{" "}
            {AI_TRIAL_TURNS} lượt AI dùng thử.
          </p>
        </div>
        <form className="flex gap-2" action="/admin/users">
          <input name="q" defaultValue={q} placeholder="Tìm email hoặc tên" className="input w-56 py-2 text-sm" aria-label="Tìm tài khoản" />
          <button type="submit" className="btn-ghost">
            Tìm
          </button>
        </form>
      </header>

      {users.length === 0 ? (
        <p className="card p-8 text-center text-muted">Không có tài khoản nào{q ? ` khớp “${q}”` : ""}.</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => {
            const blocked = accountBlockReason(u, now);
            const premium = !!u.premiumUntil && u.premiumUntil.getTime() > now.getTime();
            const isSelf = u.id === session.user?.id;
            return (
              <div key={u.id} className="card grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <div className="min-w-0 space-y-1 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="truncate">{u.email ?? "(không có email)"}</b>
                    {isSelf && <span className="chip bg-primary-soft text-primary">Bạn</span>}
                    {u.disabled ? (
                      <span className="chip bg-danger-soft text-danger">Đã khoá</span>
                    ) : blocked ? (
                      <span className="chip bg-danger-soft text-danger">Hết hạn</span>
                    ) : (
                      <span className="chip bg-success/15 text-success">Hoạt động</span>
                    )}
                    {premium && <span className="chip bg-primary-soft text-primary">AI đầy đủ</span>}
                  </div>
                  <div className="text-xs text-muted">
                    {u.name ? `${u.name} · ` : ""}Tạo {fmtDate(u.createdAt)} · {u.emailVerified ? "đã xác thực email" : "chưa xác thực email"} ·{" "}
                    {u._count.sessions} phiên đang mở
                  </div>
                  <div className="text-xs text-muted">
                    Hạn tài khoản: <b className="text-fg">{u.accessUntil ? fmtDate(u.accessUntil) : "không giới hạn"}</b> · Quyền AI:{" "}
                    <b className="text-fg">{premium ? (isPermanent(u.premiumUntil) ? "không thời hạn" : `đến ${fmtDate(u.premiumUntil)}`) : "không"}</b> · Lượt thử đã dùng:{" "}
                    {u.aiTrialUsed}/{AI_TRIAL_TURNS}
                  </div>
                  {u.referralRedemptions.length > 0 && (
                    <div className="text-xs text-muted">Mã đã nhập: {u.referralRedemptions.map((r) => r.code).join(", ")}</div>
                  )}
                </div>
                <UserActions
                  id={u.id}
                  email={u.email ?? u.id}
                  disabled={u.disabled}
                  accessUntil={u.accessUntil?.toISOString() ?? null}
                  premiumUntil={u.premiumUntil?.toISOString() ?? null}
                  isSelf={isSelf}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
