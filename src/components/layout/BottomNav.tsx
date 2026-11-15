"use client";

/**
 * Thanh tab dưới cùng trên điện thoại: Trang chủ · Lộ trình · Học · Luyện tập · Gói AI.
 * "Học" / "Luyện tập" mở bảng chọn trang con ngay phía trên thanh tab. Ẩn khi đang làm bài (quiz / nghe chép).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { NAV, isActive, isEntryActive, type NavGroup } from "./nav-items";

function GroupSheet({ group, pathname, onClose }: { group: NavGroup; pathname: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button type="button" aria-label="Đóng" className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={onClose} />
      <div
        role="menu"
        aria-label={group.label}
        className="card fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 space-y-1 p-2 animate-pop-in md:hidden"
      >
        <div className="flex items-center justify-between px-2 pb-1 pt-0.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">{group.label}</span>
          <button type="button" className="grid size-7 place-items-center rounded-lg text-muted" aria-label="Đóng" onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>
        {group.items.map(({ href, label, hint, icon: Icon }) => {
          const on = isActive(href, pathname);
          return (
            <Link key={href} href={href} role="menuitem" className={`flex items-center gap-3 rounded-xl p-2.5 ${on ? "bg-primary-soft" : "active:bg-surface-2"}`}>
              <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${on ? "bg-primary text-primary-fg" : "bg-surface-2 text-primary"}`}>
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className={`block font-semibold ${on ? "text-primary" : ""}`}>{label}</span>
                {hint && <span className="block text-xs text-muted">{hint}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  useEffect(() => setOpenGroup(null), [pathname]);

  const inSession = /^\/(quiz|dictation)\/.+/.test(pathname);
  if (inSession) return null;

  const tab = (active: boolean) =>
    `flex w-full flex-col items-center gap-1 whitespace-nowrap py-2.5 text-[11px] font-semibold ${active ? "text-primary" : "text-muted"}`;
  const sheet = NAV.find((e): e is { kind: "group" } & NavGroup => e.kind === "group" && e.label === openGroup);

  return (
    <>
      {sheet && <GroupSheet group={sheet} pathname={pathname} onClose={() => setOpenGroup(null)} />}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Điều hướng"
      >
        <ul className="grid grid-cols-5">
          {NAV.map((entry) => {
            const active = isEntryActive(entry, pathname) || openGroup === entry.label;
            const Icon = entry.icon;
            return (
              <li key={entry.label}>
                {entry.kind === "link" ? (
                  <Link href={entry.href} className={tab(active)}>
                    <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                    {entry.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={tab(active)}
                    aria-expanded={openGroup === entry.label}
                    aria-haspopup="menu"
                    onClick={() => setOpenGroup((g) => (g === entry.label ? null : entry.label))}
                  >
                    <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                    {entry.label}
                  </button>
                )}
              </li>
            );
          })}
          <li>
            <Link href="/pricing" className={tab(isActive("/pricing", pathname))}>
              <Sparkles className="size-5" />
              Gói AI
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
