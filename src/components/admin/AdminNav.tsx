"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, Receipt, TrendingUp, Users } from "lucide-react";

const TABS = [
  { href: "/admin/users", label: "Tài khoản", icon: Users },
  { href: "/admin/referrals", label: "Mã giới thiệu", icon: Gift },
  { href: "/admin/orders", label: "Đơn hàng", icon: Receipt },
  { href: "/admin/revenue", label: "Doanh thu", icon: TrendingUp },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Quản trị">
      {TABS.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={pathname.startsWith(href) ? "btn-primary py-2" : "btn-ghost py-2"}>
          <Icon className="size-4" /> {label}
        </Link>
      ))}
    </nav>
  );
}
