"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

/** Thanh tab dưới cùng trên điện thoại. Ẩn khi đang làm bài (quiz / nghe chép). */
export function BottomNav() {
  const pathname = usePathname();
  const inSession = /^\/(quiz|dictation)\/.+/.test(pathname);
  if (inSession) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Điều hướng"
    >
      <ul className="grid grid-cols-8">
        {NAV_ITEMS.map(({ href, label, short, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 whitespace-nowrap py-2.5 text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                {short ?? label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
