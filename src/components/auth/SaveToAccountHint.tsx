"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CloudOff } from "lucide-react";

/** Nhắc người chưa đăng nhập rằng dữ liệu chỉ nằm trên trình duyệt này. */
export function SaveToAccountHint({ callbackUrl = "/roadmap" }: { callbackUrl?: string }) {
  const { status } = useSession();
  if (status !== "unauthenticated") return null;
  return (
    <div className="card flex flex-wrap items-center gap-3 p-4 text-sm">
      <CloudOff className="size-5 shrink-0 text-warning" />
      <span className="min-w-0 flex-1">
        Bạn chưa đăng nhập nên tiến độ chỉ lưu trên trình duyệt này. Đăng nhập để lưu vào tài khoản và học tiếp trên máy khác.
      </span>
      <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="btn-primary py-2">
        Đăng nhập
      </Link>
    </div>
  );
}
