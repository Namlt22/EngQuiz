"use client";

/** Tạo mã giới thiệu và bật / tắt mã (admin). */
import { useState } from "react";
import { useRouter } from "next/navigation";

async function post(url: string, body: unknown): Promise<string | null> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  const json = (await res?.json().catch(() => null)) as { success?: boolean; error?: string } | null;
  return json?.success ? null : (json?.error ?? "Không thực hiện được, hãy thử lại.");
}

export function CreateReferralForm() {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", note: "", grantDays: "", maxUses: "", expiresAt: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    const err = await post("/api/admin/referrals", {
      ...form,
      expiresAt: form.expiresAt ? `${form.expiresAt}T23:59:59+07:00` : "",
    });
    setBusy(false);
    if (err) return setError(err);
    setForm({ code: "", note: "", grantDays: "", maxUses: "", expiresAt: "" });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6" noValidate>
      <label className="space-y-1 text-xs font-semibold text-muted lg:col-span-2">
        Mã (chữ không dấu, số, gạch ngang)
        <input className="input py-2 font-mono text-sm uppercase" required maxLength={32} placeholder="ENGQUIZ-VIP" value={form.code} onChange={set("code")} />
      </label>
      <label className="space-y-1 text-xs font-semibold text-muted">
        Số ngày dùng AI
        <input className="input py-2 text-sm" inputMode="numeric" placeholder="trống = không hạn" value={form.grantDays} onChange={set("grantDays")} />
      </label>
      <label className="space-y-1 text-xs font-semibold text-muted">
        Số người tối đa
        <input className="input py-2 text-sm" inputMode="numeric" placeholder="trống = không giới hạn" value={form.maxUses} onChange={set("maxUses")} />
      </label>
      <label className="space-y-1 text-xs font-semibold text-muted">
        Nhập được đến ngày
        <input type="date" className="input py-2 text-sm" value={form.expiresAt} onChange={set("expiresAt")} />
      </label>
      <label className="space-y-1 text-xs font-semibold text-muted">
        Ghi chú
        <input className="input py-2 text-sm" maxLength={200} placeholder="vd: lớp IELTS K12" value={form.note} onChange={set("note")} />
      </label>
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-6">
        <button type="submit" className="btn-primary" disabled={busy || !form.code.trim()}>
          {busy ? "Đang tạo…" : "Tạo mã"}
        </button>
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    </form>
  );
}

export function ReferralToggle({ code, active }: { code: string; active: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className={active ? "btn-ghost px-2.5 py-1 text-xs" : "btn-success px-2.5 py-1 text-xs"}
        disabled={busy}
        onClick={async () => {
          if (active && !window.confirm(`Tắt mã ${code}? Người đã nhập vẫn giữ quyền; người mới không nhập được nữa.`)) return;
          setBusy(true);
          const err = await post(`/api/admin/referrals/${encodeURIComponent(code)}`, { active: !active });
          setBusy(false);
          if (err) return setError(err);
          router.refresh();
        }}
      >
        {active ? "Tắt mã" : "Bật lại"}
      </button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </span>
  );
}
