"use client";

import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { todayKey } from "@/lib/progress";
import { buildRoadmap, currentWeekNumber, roadmapSummary } from "@/lib/roadmap";
import { useHydrated, useRoadmapState } from "@/lib/roadmap-store";
import { ProgressBar } from "@/components/ui/ProgressBar";

/** Thẻ trên trang chủ: mời tạo lộ trình, hoặc nhắc tuần hiện tại nếu đã có. */
export function RoadmapTeaser() {
  const hydrated = useHydrated();
  const { profile, log } = useRoadmapState();

  if (!hydrated || !profile) {
    return (
      <Link href="/roadmap" className="card group flex items-center gap-4 p-5 transition hover:shadow-md md:p-6">
        <Icon />
        <div className="flex-1">
          <h2 className="text-lg font-bold">Tạo lộ trình nói tiếng Anh cho riêng bạn</h2>
          <p className="text-sm text-muted">6 câu hỏi về trình độ, mục tiêu và thời gian rảnh → kế hoạch theo tuần, ghép sẵn bài học trong EngQuiz.</p>
        </div>
        <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1" />
      </Link>
    );
  }

  const roadmap = buildRoadmap(profile);
  const n = currentWeekNumber(profile.startDate, todayKey(), profile.weeks);
  const week = roadmap.weeks[n - 1];
  const s = roadmapSummary(roadmap, log);
  const heading = week ? `Tuần ${n}/${profile.weeks}: ${week.title}` : n === 0 ? "Lộ trình sắp bắt đầu" : "Bạn đã đi hết lộ trình";

  return (
    <Link href="/roadmap" className="card group flex items-center gap-4 p-5 transition hover:shadow-md md:p-6">
      <Icon />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Lộ trình của tôi</div>
        <h2 className="text-lg font-bold">{heading}</h2>
        <div className="mt-2 flex items-center gap-3">
          <ProgressBar value={(s.sessions / s.sessionsTotal) * 100} label="Tiến độ lộ trình" />
          <span className="shrink-0 text-xs font-semibold text-muted">
            {s.sessions}/{s.sessionsTotal} buổi
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
