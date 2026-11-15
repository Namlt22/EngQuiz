"use client";

/** Ô nhập mã giới thiệu: nhập đúng mã → mở đầy đủ tính năng AI (hạn theo mã). Chưa đăng nhập thì mời đăng nhập. */
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle2, Gift, Loader2 } from "lucide-react";

const PERMANENT_YEAR = 2099;

export function ReferralBox() {
  const { status } = useSession();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [until, setUntil] = useState<string>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return setError("Nhập mã giới thiệu");
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch("/api/billing/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const json = (await res.json().catch(() => null)) as { success?: boolean; data?: { premiumUntil: string }; error?: string } | null;
      if (!json?.success || !json.data) throw new Error(json?.error ?? `Lỗi máy chủ (HTTP ${res.status}).`);
      setUntil(json.data.premiumUntil);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không áp dụng được mã. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }

  if (until) {
    const d = new Date(until);
    return (
      <div id="referral" className="card flex flex-col items-center gap-2 p-6 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <p className="font-bold">Đã mở đầy đủ tính năng AI!</p>
        <p className="text-sm text-muted">
          {d.getFullYear() >= PERMANENT_YEAR ? "Không thời hạn." : `Dùng đến hết ngày ${d.toLocaleDateString("vi-VN")}.`}
        </p>
        <Link href="/speaking?tab=talk" className="btn-primary">
          Luyện nói với AI
        </Link>
      </div>
    );
  }

  return (
    <div id="referral" className="card space-y-3 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <Gift className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">Có mã giới thiệu?</h2>
          <p className="text-sm text-muted">Nhập mã để mở đầy đủ tính năng AI (chấm & sửa bài nói).</p>
        </div>
      </div>
      {status === "unauthenticated" ? (
        <Link href={`/signin?callbackUrl=${encodeURIComponent("/pricing#referral")}`} className="btn-primary w-full">
          Đăng nhập để nhập mã
        </Link>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row" noValidate>
          <input
            className="input font-mono uppercase"
            placeholder="VD: ENGQUIZ-VIP"
            maxLength={32}
            autoComplete="off"
            aria-label="Mã giới thiệu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0" disabled={busy || status === "loading"}>
            {busy && <Loader2 className="size-4 animate-spin" />} Áp dụng mã
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
