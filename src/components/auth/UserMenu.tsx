"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Cloud, CloudAlert, CloudUpload, LogIn, LogOut, UserRound } from "lucide-react";
import type { SyncStatus } from "@/lib/learner-sync";
import { prepareSignOut, stopSyncAndClearLocal, stopSyncKeepLocal, useSyncStatus } from "./LearnerSync";

const STATUS_TEXT: Record<SyncStatus, string> = {
  off: "Chưa đồng bộ",
  loading: "Đang tải dữ liệu…",
  saving: "Đang lưu…",
  saved: "Đã lưu vào tài khoản",
  error: "Chưa lưu được, đang thử lại",
  invalid: "Dữ liệu trên máy không lưu được. Hãy tải lại trang; nếu vẫn lỗi, liên hệ hỗ trợ.",
  "signed-out": "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại để lưu tiến độ.",
};

type SignOutStep = "idle" | "saving" | "unsaved";

/** Đăng xuất an toàn: chờ lưu xong mới xóa dữ liệu trên máy; chưa lưu được thì hỏi lại. */
function SignOutButton() {
  const [step, setStep] = useState<SignOutStep>("idle");

  async function signOutNow(clearLocal: boolean) {
    if (clearLocal) stopSyncAndClearLocal();
    else stopSyncKeepLocal();
    await signOut({ redirectTo: "/" });
  }

  async function start() {
    setStep("saving");
    const saved = await prepareSignOut();
    if (saved) await signOutNow(true);
    else setStep("unsaved");
  }

  if (step === "unsaved") {
    return (
      <div className="space-y-2 rounded-xl bg-warning-soft p-3 text-xs">
        <p>Còn thay đổi chưa lưu được vào tài khoản (có thể do mất mạng).</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost px-3 py-1.5 text-xs" onClick={() => void start()}>
            Thử lưu lại
          </button>
          <button type="button" className="btn-ghost px-3 py-1.5 text-xs" onClick={() => void signOutNow(false)}>
            Đăng xuất, giữ dữ liệu trên máy
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" role="menuitem" className="btn-ghost w-full justify-start" disabled={step === "saving"} onClick={() => void start()}>
      <LogOut className="size-4" /> {step === "saving" ? "Đang lưu…" : "Đăng xuất"}
    </button>
  );
}

function StatusIcon({ status }: { status: SyncStatus }) {
  if (status === "error" || status === "invalid" || status === "signed-out") return <CloudAlert className="size-4 text-danger" />;
  if (status === "saving" || status === "loading") return <CloudUpload className="size-4 text-warning" />;
  return <Cloud className="size-4 text-success" />;
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const sync = useSyncStatus();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (status === "loading") return <span className="size-10 animate-pulse rounded-xl bg-surface-2" aria-hidden="true" />;

  if (!session?.user) {
    return (
      <Link href="/signin" className="btn-ghost h-10 px-3" title="Đăng nhập để lưu tiến độ vào tài khoản">
        <LogIn className="size-4" />
        <span className="hidden sm:inline">Đăng nhập</span>
      </Link>
    );
  }

  const label = session.user.name || session.user.email || "Tài khoản";
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative grid size-10 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:text-fg"
        title={`${label} · ${STATUS_TEXT[sync]}`}
      >
        <UserRound className="size-5" />
        <span className="absolute -bottom-1 -right-1 rounded-full bg-surface p-0.5">
          <StatusIcon status={sync} />
        </span>
      </button>
      {open && (
        <div role="menu" className="card absolute right-0 top-12 z-50 w-64 space-y-2 p-3 animate-pop-in">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{label}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <StatusIcon status={sync} /> {STATUS_TEXT[sync]}
            </div>
          </div>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
