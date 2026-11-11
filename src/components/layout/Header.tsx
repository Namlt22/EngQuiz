"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Star } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./ThemeToggle";
import { useProgress } from "@/lib/progress";

export function Header() {
  const pathname = usePathname();
  const p = useProgress();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className="chip bg-warning-soft text-warning" title="Chuỗi ngày học liên tiếp">
            <Flame className="size-3.5" /> {p.streak}
          </span>
          <span className="chip bg-primary-soft text-primary" title="Điểm kinh nghiệm">
            <Star className="size-3.5" /> {p.xp} XP
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
