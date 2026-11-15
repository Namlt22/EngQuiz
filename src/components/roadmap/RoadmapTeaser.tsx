"use client";

import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { buildRoadmap } from "@/lib/roadmap";
import { buildDays, dayDone, nextOpenDay } from "@/lib/roadmap-days";
import { useHydrated, useRoadmapState } from "@/lib/roadmap-store";
import { ProgressBar } from "@/components/ui/ProgressBar";

/** Thẻ trên trang chủ: mời tạo lộ trình, hoặc nhắc ngày học tiếp theo (Day n) nếu đã có. */
export function RoadmapTeaser() {
  const hydrated = useHydrated();
  const { profile, log } = useRoadmapState();

  if (!hydrated || !profile) {
    return (
      <Link href="/roadmap" className="card group flex items-center gap-4 p-5 transition hover:shadow-md md:p-6">
        <Icon />
        <div className="flex-1">
          <h2 className="text-lg font-bold">Tạo lộ trình nói tiếng Anh cho riêng bạn</h2>
          <p className="text-sm text-muted">6 câu hỏi về trình độ, mục tiêu và thời gian rảnh → kế hoạch từng ngày (Day 1, Day 2…), bấm vào là học, học xong tự tích.</p>
        </div>
        <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1" />
      </Link>
    );
  }

  const roadmap = buildRoadmap(profile);
  const days = buildDays(roadmap);
  const next = nextOpenDay(days, log);
  const done = days.filter((d) => dayDone(log, d)).length;
  const week = next ? roadmap.weeks[next.week - 1] : undefined;
  const heading = next && week ? `Học tiếp Day ${next.n} · ${week.title}` : "Bạn đã hoàn thành lộ trình";

  return (
    <Link href="/roadmap" className="card group flex items-center gap-4 p-5 transition hover:shadow-md md:p-6">
      <Icon />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Lộ trình của tôi</div>
        <h2 className="text-lg font-bold">{heading}</h2>
        <div className="mt-2 flex items-center gap-3">
          <ProgressBar value={(done / days.length) * 100} label="Tiến độ lộ trình" />
          <span className="shrink-0 text-xs font-semibold text-muted">
            {done}/{days.length} ngày
          </span>
        </div>
      </div>
      <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1" />
    </Link>
  );
}

function Icon() {
  return (
    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-violet-500 text-white">
      <Route className="size-7" />
    </span>
  );
}
