"use client";

/** Nút duyệt / huỷ đơn cho admin. Duyệt = xác nhận đã thấy tiền về đúng số tiền và nội dung. */
import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderActions({ code, amountText }: { code: string; amountText: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function act(action: "approve" | "cancel") {
    const question =
      action === "approve"
        ? `Xác nhận ĐÃ NHẬN ${amountText} với nội dung "${code}"? Gói AI sẽ được kích hoạt ngay.`
        : `Huỷ đơn ${code}?`;
    if (!window.confirm(question)) return;
    setBusy(true);
    setError(undefined);
    const res = await fetch(`/api/admin/orders/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }).catch(() => null);
    const json = (await res?.json().catch(() => null)) as { success?: boolean; error?: string } | null;
    setBusy(false);
    if (!json?.success) return setError(json?.error ?? "Không xử lý được, hãy thử lại.");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button type="button" className="btn-success px-3 py-1.5 text-xs" disabled={busy} onClick={() => void act("approve")}>
          Đã nhận tiền
        </button>
        <button type="button" className="btn-ghost px-3 py-1.5 text-xs" disabled={busy} onClick={() => void act("cancel")}>
          Huỷ
        </button>
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
