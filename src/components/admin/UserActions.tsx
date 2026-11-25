"use client";

/** Thao tác admin trên một tài khoản: khoá/mở, hạn tài khoản, cấp/thu hồi AI, đặt lại lượt thử, đăng xuất mọi thiết bị. */
import { useState } from "react";
import { useRouter } from "next/navigation";

type Body = { action: string; until?: string };

const toInputDate = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
/** Ngày chọn trong ô date (giờ Việt Nam) → hết ngày đó (23:59:59 +07:00). */
const endOfVnDay = (yyyyMmDd: string) => `${yyyyMmDd}T23:59:59+07:00`;

export function UserActions({
  id,
  email,
  disabled,
  accessUntil,
  premiumUntil,
  isSelf,
}: {
  id: string;
  email: string;
  disabled: boolean;
  accessUntil: string | null;
  premiumUntil: string | null;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [access, setAccess] = useState(toInputDate(accessUntil));
  const [ai, setAi] = useState("");

  async function run(body: Body, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setError(undefined);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    const json = (await res?.json().catch(() => null)) as { success?: boolean; error?: string } | null;
    setBusy(false);
    if (!json?.success) return setError(json?.error ?? "Không thực hiện được, hãy thử lại.");
    router.refresh();
  }

  return (
    <div className="space-y-2 text-xs">
      <div className="flex flex-wrap gap-1.5">
        {disabled ? (
          <button type="button" className="btn-success px-2.5 py-1 text-xs" disabled={busy} onClick={() => void run({ action: "enable" })}>
            Mở khoá
          </button>
        ) : (
          <button
            type="button"
            className="btn px-2.5 py-1 text-xs bg-danger text-white hover:brightness-110"
            disabled={busy || isSelf}
            title={isSelf ? "Không thể tự khoá chính mình" : undefined}
            onClick={() => void run({ action: "disable" }, `Khoá tài khoản ${email}? Người này bị đăng xuất ngay và không đăng nhập lại được.`)}
          >
            Khoá
          </button>
        )}
        <button type="button" className="btn-ghost px-2.5 py-1 text-xs" disabled={busy} onClick={() => void run({ action: "signOut" }, `Đăng xuất ${email} khỏi mọi thiết bị?`)}>
          Đăng xuất mọi nơi
        </button>
        <button type="button" className="btn-ghost px-2.5 py-1 text-xs" disabled={busy} onClick={() => void run({ action: "resetTrial" })}>
          Đặt lại lượt thử
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="w-20 text-muted">Hạn tài khoản</span>
        <input type="date" className="input w-36 px-2 py-1 text-xs" value={access} onChange={(e) => setAccess(e.target.value)} aria-label="Hạn dùng tài khoản" />
        <button
          type="button"
          className="btn-ghost px-2.5 py-1 text-xs"
          disabled={busy || !access}
          onClick={() => void run({ action: "setAccessUntil", until: endOfVnDay(access) })}
        >
          Lưu
        </button>
        {accessUntil && (
          <button type="button" className="btn-ghost px-2.5 py-1 text-xs" disabled={busy} onClick={() => void run({ action: "setAccessUntil", until: "" })}>
            Bỏ hạn
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="w-20 text-muted">Quyền AI</span>
        <input type="date" className="input w-36 px-2 py-1 text-xs" value={ai} onChange={(e) => setAi(e.target.value)} aria-label="Hạn dùng AI" />
        <button type="button" className="btn-ghost px-2.5 py-1 text-xs" disabled={busy || !ai} onClick={() => void run({ action: "grantAi", until: endOfVnDay(ai) })}>
          Cấp đến ngày
        </button>
        <button type="button" className="btn-ghost px-2.5 py-1 text-xs" disabled={busy} onClick={() => void run({ action: "grantAi", until: "permanent" })}>
          Không thời hạn
        </button>
        {premiumUntil && new Date(premiumUntil).getTime() > Date.now() && (
          <button type="button" className="btn-ghost px-2.5 py-1 text-xs" disabled={busy} onClick={() => void run({ action: "revokeAi" }, `Thu hồi quyền AI của ${email}?`)}>
            Thu hồi
          </button>
        )}
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
