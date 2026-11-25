"use client";

/** Trạng thái đơn trên trang thanh toán: hỏi lại mỗi 15 giây khi đang chờ; đã kích hoạt thì báo & mời luyện nói. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Copy, XCircle } from "lucide-react";

const POLL_MS = 15_000;

export function OrderStatus({ code, initialStatus, expired }: { code: string; initialStatus: string; expired: boolean }) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (status !== "pending" || expired) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/billing/orders/${code}`, { cache: "no-store" });
        const json = (await res.json()) as { success?: boolean; data?: { status: string } };
        if (json.success && json.data && json.data.status !== "pending") setStatus(json.data.status);
      } catch {
        /* mất mạng tạm thời: lần sau hỏi lại */
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [code, status, expired]);

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-success/10 p-5 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <p className="font-bold">Đã nhận thanh toán — gói AI đã được kích hoạt!</p>
        <Link href="/speaking?tab=talk" className="btn-primary">
          Luyện nói với AI
        </Link>
      </div>
    );
  }
  if (status === "cancelled" || expired) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-danger-soft p-5 text-center text-danger">
        <XCircle className="size-10" />
        <p className="font-bold">{status === "cancelled" ? "Đơn đã bị huỷ." : "Đơn đã quá hạn thanh toán."}</p>
        <p className="text-sm">Nếu bạn đã chuyển khoản cho đơn này, hãy trả lời email xác nhận hoặc liên hệ EngQuiz kèm mã đơn {code}.</p>
        <Link href="/pricing" className="btn-ghost">
          Tạo đơn mới
        </Link>
      </div>
    );
  }
  return (
    <p className="flex items-center gap-2 rounded-xl bg-warning-soft p-3 text-sm">
      <Clock className="size-4 shrink-0" /> Đang chờ thanh toán. Trang này tự cập nhật khi gói được kích hoạt (thường trong vài giờ sau khi chuyển khoản).
    </p>
  );
}

export function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2.5">
      <div className="min-w-0">
        <div className="text-xs text-muted">{label}</div>
        <div className="truncate font-semibold">{value}</div>
      </div>
      <button
        type="button"
        className="btn-ghost shrink-0 px-3 py-1.5 text-xs"
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
      >
        <Copy className="size-3.5" /> {copied ? "Đã chép" : "Chép"}
      </button>
    </div>
  );
}
