"use client";

import { useId } from "react";
import Link from "next/link";
import { COURSES } from "@/lib/course";
import { useCourse } from "@/lib/course-client";

/**
 * Biểu tượng EngQuiz — "Sóng giọng nói" (phương án 3, design/logo-options): bốn vạch sóng âm trong hình tròn
 * gradient chàm → tím, gợi nghe chép và luyện nói được AI chấm. Cùng hình với favicon src/app/icon.svg.
 */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill={`url(#${id}-bg)`} />
      <g fill="#fff">
        <rect x="9" y="19" width="5" height="10" rx="2.5" />
        <rect x="17.5" y="13" width="5" height="22" rx="2.5" />
        <rect x="26" y="10" width="5" height="28" rx="2.5" />
        <rect x="34.5" y="17" width="5" height="14" rx="2.5" opacity=".7" />
      </g>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  const home = COURSES[useCourse()].home;
  return (
    <Link href={home} className={`group inline-flex shrink-0 items-center gap-2 ${className}`} aria-label="EngQuiz — Trang chủ">
      <LogoMark className="size-9 drop-shadow-[0_4px_10px_rgba(99,102,241,0.35)] transition group-hover:-rotate-6" />
      <span className="text-xl font-extrabold tracking-tight">
        Eng<span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Quiz</span>
      </span>
    </Link>
  );
}
