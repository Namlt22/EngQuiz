"use client";

/**
 * Khách chưa đăng nhập được học thử GUEST_TRIAL_ITEMS bài (bài lý thuyết, quiz, nghe chép, luyện nói, lộ trình…).
 * Bài đã mở thì mở lại thoải mái; bài thứ 6 trở đi hiện màn hình mời đăng nhập (miễn phí).
 * Đếm trên máy (localStorage) — mục đích là mời đăng ký, không phải bảo mật (nội dung học vốn công khai).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LockKeyhole, Sparkles } from "lucide-react";
import { GUEST_TRIAL_ITEMS } from "@/lib/plans";

const STORAGE_KEY = "engquiz.guest-trial.v1";

function readOpened(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 100) : [];
  } catch {
    return [];
  }
}

function saveOpened(list: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* chế độ riêng tư / bộ nhớ đầy: vẫn cho học, chỉ không đếm được */
  }
}

type GateState = "checking" | "open" | "locked";

export function GuestGate({ itemKey, children }: { itemKey: string; children: React.ReactNode }) {
  const { status } = useSession();
  const [state, setState] = useState<GateState>("checking");
  const [left, setLeft] = useState(GUEST_TRIAL_ITEMS);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") return setState("open");
    const opened = readOpened();
    if (opened.includes(itemKey)) {
      setLeft(GUEST_TRIAL_ITEMS - opened.length);
      return setState("open");
    }
    if (opened.length >= GUEST_TRIAL_ITEMS) return setState("locked");
    const next = [...opened, itemKey];
    saveOpened(next);
    setLeft(GUEST_TRIAL_ITEMS - next.length);
    setState("open");
  }, [status, itemKey]);

  // Đang kiểm tra phiên: vẫn hiện nội dung (trang tĩnh, tránh nháy trống với người đã đăng nhập).
  if (state === "locked") return <GuestWall />;
  return (
    <>
      {state === "open" && status === "unauthenticated" && <TrialBanner left={left} />}
      {children}
    </>
  );
}

function TrialBanner({ left }: { left: number }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center gap-2 rounded-xl bg-primary-soft px-4 py-2.5 text-sm text-primary">
      <Sparkles className="size-4 shrink-0" />
      <span className="flex-1">
        Bạn đang học thử: còn <b>{Math.max(0, left)}</b>/{GUEST_TRIAL_ITEMS} bài. Tạo tài khoản miễn phí để học không giới hạn và lưu tiến độ.
      </span>
      <Link href={`/register?callbackUrl=${encodeURIComponent(pathname)}`} className="font-semibold underline">
        Tạo tài khoản
      </Link>
    </div>
  );
}

function GuestWall() {
  const pathname = usePathname();
  const back = encodeURIComponent(pathname);
  return (
    <div className="card animate-pop-in mx-auto max-w-md space-y-4 p-6 text-center md:p-8">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <LockKeyhole className="size-7" />
      </span>
      <h1 className="text-2xl font-extrabold">Bạn đã dùng hết {GUEST_TRIAL_ITEMS} bài học thử</h1>
      <p className="text-muted">
        Tạo tài khoản <b className="text-fg">miễn phí</b> để học tiếp toàn bộ lý thuyết, quiz, nghe chép, luyện nói theo mẫu và lộ trình cá nhân — tiến độ được lưu trên mọi thiết bị.
      </p>
      <div className="space-y-2">
        <Link href={`/register?callbackUrl=${back}`} className="btn-primary w-full">
          Tạo tài khoản miễn phí
        </Link>
        <Link href={`/signin?callbackUrl=${back}`} className="btn-ghost w-full">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>
      <p className="text-xs text-muted">
        Muốn AI chấm & sửa bài nói? Xem <Link href="/pricing" className="font-semibold text-primary hover:underline">các gói AI</Link>.
      </p>
    </div>
  );
}
