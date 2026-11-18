"use client";

import Link from "next/link";
import { ArrowRight, AudioLines, BookOpen, Flame, Headphones, PenLine, Sparkles, Star, Trophy } from "lucide-react";
import { LEVELS } from "@/content/levels";
import { levelStats, nextTopic } from "@/lib/learn";
import { useProgress } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RoadmapTeaser } from "@/components/roadmap/RoadmapTeaser";

/** Lối tắt tới các phần luyện tập — chỉ icon + tên, không mô tả. */
const SHORTCUTS = [
  { href: "/grammar", label: "Lý thuyết", icon: BookOpen, tone: "from-sky-500 to-indigo-500" },
  { href: "/quiz", label: "Quiz", icon: PenLine, tone: "from-violet-500 to-fuchsia-500" },
  { href: "/dictation", label: "Nghe chép", icon: Headphones, tone: "from-emerald-500 to-teal-500" },
  { href: "/ipa", label: "Phát âm IPA", icon: AudioLines, tone: "from-amber-500 to-orange-500" },
] as const;

export function HomeDashboard() {
  const p = useProgress();
  const next = nextTopic(p);
  const isNew = p.xp === 0;
  const topicsDone = LEVELS.reduce((sum, l) => sum + levelStats(l.code, p).done, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-500/20 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-2xl">
          <span className="chip mb-3 bg-white/15 text-white">
            <Sparkles className="size-3.5" /> {isNew ? "Chào mừng bạn!" : "Chào bạn quay lại 👋"}
          </span>
          <h1 className="text-2xl font-extrabold leading-tight md:text-4xl">Nắm chắc ngữ pháp, nghe tốt từng từ.</h1>

          {next && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20 backdrop-blur">
              <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{isNew ? "Bắt đầu với" : "Tiếp tục học"}</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold">{next.level}</span>
                  <span className="text-lg font-bold leading-snug">{next.title}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/grammar/${next.slug}`} className="btn bg-white text-indigo-700 hover:bg-indigo-50">
                  <BookOpen className="size-4" /> Học
                </Link>
                <Link href={`/quiz/topic-${next.slug}`} className="btn bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25">
                  <PenLine className="size-4" /> Quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="card grid grid-cols-3 divide-x divide-line py-3">
        <Stat icon={<Flame className="size-4" />} value={p.streak} label="ngày liên tiếp" tone="text-warning" />
        <Stat icon={<Star className="size-4" />} value={p.xp} label="XP" tone="text-primary" />
        <Stat icon={<Trophy className="size-4" />} value={topicsDone} label="chủ điểm xong" tone="text-success" />
      </section>

      <RoadmapTeaser />

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-bold">Cấp độ</h2>
          <Link href="/levels" className="text-sm font-semibold text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((l) => {
            const s = levelStats(l.code, p);
            const pct = s.available ? (s.done / s.available) * 100 : 0;
            return (
              <Link key={l.code} href={`/levels/${l.code.toLowerCase()}`} className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br font-black text-white ${l.gradient}`}>{l.code}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-bold">{l.name}</span>
                    <span className="shrink-0 text-xs font-semibold text-muted">
                      {s.done}/{s.available}
                    </span>
                  </div>
                  <ProgressBar value={pct} barClassName={l.accent} label={`Tiến độ ${l.code}`} className="mt-2" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Luyện tập</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SHORTCUTS.map(({ href, label, icon: Icon, tone }) => (
            <Link key={href} href={href} className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white ${tone}`}>
                <Icon className="size-5" />
              </span>
              <span className="font-bold">{label}</span>
              <ArrowRight className="ml-auto hidden size-4 text-muted transition group-hover:translate-x-0.5 sm:block" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 text-center">
      <div className={`flex items-center gap-1.5 text-xl font-extrabold leading-none ${tone}`}>
        {icon}
        <span className="text-fg">{value}</span>
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
