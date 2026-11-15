"use client";

/** Chọn gói AI → tạo đơn → chuyển sang trang thanh toán QR. Chưa đăng nhập thì chuyển tới đăng nhập rồi quay lại. */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Loader2 } from "lucide-react";
import { formatVnd, perMonth, PLANS, savingPercent, type PlanId } from "@/lib/plans";

/** salesOpen=false: hiện giá để tham khảo nhưng nút bị khoá (tạm dừng bán; dùng mã giới thiệu thay thế). */
export function PlanPicker({ salesOpen = true }: { salesOpen?: boolean }) {
  const router = useRouter();
  const { status } = useSession();
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [error, setError] = useState<string>();

  async function choose(plan: PlanId) {
    if (status !== "authenticated") {
      router.push(`/signin?callbackUrl=${encodeURIComponent("/pricing")}`);
      return;
    }
    setBusy(plan);
    setError(undefined);
    try {
      const res = await fetch("/api/billing/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const json = (await res.json().catch(() => null)) as { success?: boolean; data?: { code: string }; error?: string } | null;
      if (!json?.success || !json.data) throw new Error(json?.error ?? `Lỗi máy chủ (HTTP ${res.status}).`);
      router.push(`/billing/${json.data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tạo được đơn. Hãy thử lại.");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => {
          const saving = savingPercent(p);
          const highlight = p.id === "12m";
          return (
            <div key={p.id} className={`card relative flex flex-col gap-3 p-5 ${highlight ? "border-2 border-primary" : ""}`}>
              {p.badge && (
                <span className={`chip absolute -top-3 left-5 ${highlight ? "bg-primary text-primary-fg" : "bg-warning-soft text-warning"}`}>{p.badge}</span>
              )}
              <div className="text-sm font-semibold text-muted">{p.label}</div>
              <div>
                <div className="text-3xl font-extrabold">{formatVnd(p.price)}</div>
                <div className="text-sm text-muted">
                  ≈ {formatVnd(perMonth(p))}/tháng
                  {saving > 0 && <span className="ml-1 font-semibold text-success">tiết kiệm {saving}%</span>}
                </div>
              </div>
              <ul className="flex-1 space-y-1.5 text-sm">
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" /> AI chấm & sửa bài nói
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" /> Dùng trong {p.months} tháng, mua thêm thì cộng dồn
                </li>
              </ul>
              <button type="button" className={highlight ? "btn-primary w-full" : "btn-ghost w-full"} disabled={busy !== null || !salesOpen} onClick={() => void choose(p.id)}>
                {busy === p.id ? <Loader2 className="size-4 animate-spin" /> : null}
                {!salesOpen ? "Tạm dừng bán" : busy === p.id ? "Đang tạo đơn…" : "Chọn gói"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-muted">
        Gói <b className="text-fg">không tự động gia hạn</b>, không tự trừ tiền. Chọn gói nghĩa là bạn đồng ý{" "}
        <Link href="/legal/terms" className="font-semibold text-primary hover:underline">
          Điều khoản sử dụng
        </Link>{" "}
        và{" "}
        <Link href="/legal/payment" className="font-semibold text-primary hover:underline">
          Chính sách thanh toán, gia hạn & hoàn tiền
        </Link>
        .
      </p>
    </div>
  );
}
