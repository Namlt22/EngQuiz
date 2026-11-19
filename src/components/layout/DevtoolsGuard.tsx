"use client";

/**
 * Hạn chế xem mã nguồn trên web (chỉ bật ở bản production):
 *  - chặn phím F12, Ctrl+Shift+I/J/C/K, Ctrl+U (xem nguồn), Ctrl+S (lưu trang) và bản Cmd+Option trên macOS;
 *  - chặn menu chuột phải (trừ trong ô nhập chữ, để vẫn dán được);
 *  - phát hiện DevTools đang mở (lệnh `debugger` bị dừng lại) → che trang cho tới khi đóng DevTools.
 *
 * LƯU Ý: đây là lớp NGĂN CẢN người dùng thông thường, không phải bảo mật. Trình duyệt luôn phải tải HTML/JS về máy,
 * nên ai quyết tâm vẫn xem được (tắt JavaScript, curl, view-source: gõ tay, proxy…). Mọi bí mật phải ở server.
 * Tắt hẳn bằng biến môi trường NEXT_PUBLIC_DEVTOOLS_GUARD=off (cần build lại).
 */
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

const ENABLED = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DEVTOOLS_GUARD !== "off";
const CHECK_INTERVAL_MS = 1000;
/** `debugger` chỉ dừng được lâu như vậy khi DevTools đang mở; bình thường lệnh chạy trong vài micro giây. */
const PAUSE_THRESHOLD_MS = 100;

/** Phím tắt mở DevTools / xem nguồn / lưu trang. */
export function isBlockedShortcut(e: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "shiftKey" | "altKey">): boolean {
  const key = e.key.toLowerCase();
  if (key === "f12") return true;
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return false;
  if ((e.shiftKey || e.altKey) && ["i", "j", "c", "k"].includes(key)) return true;
  return key === "u" || key === "s";
}

const isEditable = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT");

/**
 * Tạo lệnh `debugger` lúc chạy: trình nén JS (SWC, drop_debugger) sẽ xoá lệnh viết thẳng trong mã nguồn.
 * CSP hiện không chặn eval nên cách này chạy được; nếu sau này CSP cấm 'unsafe-eval' thì phần phát hiện tự tắt.
 */
function makeProbe(): (() => void) | null {
  try {
    return new Function("debugger") as () => void;
  } catch {
    return null;
  }
}

export function DevtoolsGuard() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ENABLED) return;
    const onKey = (e: KeyboardEvent) => {
      if (!isBlockedShortcut(e)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onMenu = (e: MouseEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("contextmenu", onMenu, { capture: true });

    const probe = makeProbe();
    const timer = probe
      ? window.setInterval(() => {
          const start = performance.now();
          probe();
          setOpen(performance.now() - start > PAUSE_THRESHOLD_MS);
        }, CHECK_INTERVAL_MS)
      : undefined;

    return () => {
      window.removeEventListener("keydown", onKey, { capture: true });
      window.removeEventListener("contextmenu", onMenu, { capture: true });
      if (timer) window.clearInterval(timer);
    };
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-bg p-6 text-center" role="alertdialog" aria-labelledby="devtools-guard-title">
      <div className="max-w-sm space-y-3">
        <ShieldAlert className="mx-auto size-12 text-primary" />
        <h2 id="devtools-guard-title" className="text-xl font-extrabold">
          Vui lòng đóng công cụ dành cho nhà phát triển
        </h2>
        <p className="text-sm text-muted">EngQuiz không cho phép xem mã nguồn trang. Đóng DevTools (F12) để tiếp tục học.</p>
      </div>
    </div>
  );
}
