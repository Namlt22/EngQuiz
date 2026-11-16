"use client";

/**
 * Header: logo · menu chính (Trang chủ · Lộ trình · Học ▾ · Luyện tập ▾) · chuỗi ngày/XP · Gói AI · giao diện · tài khoản.
 * Menu chính chỉ hiện từ md trở lên; điện thoại dùng BottomNav.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Flame, Sparkles, Star } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, isActive, isEntryActive, type NavGroup } from "./nav-items";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { RoadmapReturnBar } from "@/components/roadmap/RoadmapReturnBar";
import { useProgress } from "@/lib/progress";

const itemClass = (active: boolean) =>
  `inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
    active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-fg"
  }`;

/** Mục có menu thả xuống: bấm để mở/đóng; đóng khi bấm ra ngoài, nhấn Esc hoặc chuyển trang. */
function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = group.items.some((i) => isActive(i.href, pathname));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" className={itemClass(active)} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        {group.label}
        <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div role="menu" className="card w-72 space-y-1 p-2 animate-pop-in">
            {group.items.map(({ href, label, hint, icon: Icon }) => {
              const on = isActive(href, pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  className={`flex items-start gap-3 rounded-xl p-2.5 transition ${on ? "bg-primary-soft" : "hover:bg-surface-2"}`}
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${on ? "bg-primary text-primary-fg" : "bg-surface-2 text-primary"}`}>
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-semibold ${on ? "text-primary" : ""}`}>{label}</span>
                    {hint && <span className="block text-xs text-muted">{hint}</span>}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressChip() {
  const p = useProgress();
  return (
    <span className="inline-flex h-10 items-center gap-2.5 rounded-xl border border-line bg-surface px-3 text-sm font-bold" title="Chuỗi ngày học liên tiếp · Điểm kinh nghiệm">
      <span className="inline-flex items-center gap-1 text-warning">
        <Flame className="size-4" /> {p.streak}
      </span>
      <span className="h-4 w-px bg-line" />
      <span className="inline-flex items-center gap-1 text-primary">
        <Star className="size-4" /> {p.xp}
        <span className="hidden text-xs font-semibold text-muted sm:inline">XP</span>
      </span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const pricing = pathname.startsWith("/pricing");

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {NAV.map((entry) =>
            entry.kind === "link" ? (
              <Link key={entry.href} href={entry.href} className={itemClass(isEntryActive(entry, pathname))}>
                {entry.label}
              </Link>
            ) : (
              <NavDropdown key={entry.label} group={entry} pathname={pathname} />
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ProgressChip />
          <Link
            href="/pricing"
            className={`hidden h-10 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-bold transition lg:inline-flex ${
              pricing
                ? "bg-primary text-primary-fg"
                : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 hover:brightness-110"
            }`}
          >
            <Sparkles className="size-4" /> Gói AI
          </Link>
          <span className="hidden sm:block">
            <ThemeToggle />
          </span>
          <UserMenu />
        </div>
      </div>
      {/* Đang học một bài mở từ lộ trình → thanh "Về lộ trình" dính cùng header */}
      <RoadmapReturnBar />
    </header>
  );
}
