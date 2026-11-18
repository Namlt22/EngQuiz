"use client";

/**
 * Trang chủ "Hôm nay" cho cả hai khoá (docs/REDESIGN.md mục 5.1):
 * một dòng chỉ số · Tiếp theo (nhiệm vụ đầu tiên chưa xong của lộ trình) · Ôn thẻ (ẩn khi 0) · bài trong ngày · lối tắt.
 * Chưa có lộ trình → thẻ tạo lộ trình thay cho phần Tiếp theo và bài trong ngày. Không có dòng chú thích.
 */
import Link from "next/link";
import { ArrowRight, Bot, Flame, Layers, NotebookPen, PartyPopper, Repeat, Route, Star } from "lucide-react";
import { dayNumber } from "@/core/srs";
import { buildReviewQueue } from "@/lib/review-queue";
import type { CourseCode } from "@/lib/course";
import { daysFor } from "@/lib/course-roadmap";
import { todayKey, useProgress } from "@/lib/progress";
import { dayTasksDone, nextOpenDay, taskDone } from "@/lib/roadmap-days";
import { saveReturnTarget } from "@/lib/roadmap-return";
import { roadmapActions, useHydrated, useRoadmapState } from "@/lib/roadmap-store";
import { zhProfile } from "@/lib/zh-roadmap";
import { DayTasks } from "@/components/roadmap/DayTasks";
import { ProgressBar } from "@/components/ui/ProgressBar";

const ACCENT: Record<CourseCode, string> = {
  en: "from-indigo-600 via-violet-600 to-fuchsia-600",
  zh: "from-red-600 via-rose-600 to-amber-500",
};

/** Chữ trên nút trắng theo màu của khoá. */
const ACCENT_TEXT: Record<CourseCode, string> = { en: "text-indigo-700", zh: "text-rose-700" };

const QUICK: Record<CourseCode, { href: string; label: string; icon: typeof Layers }[]> = {
  en: [
    { href: "/notebook", label: "Sổ tay", icon: NotebookPen },
    { href: "/vocab", label: "Từ vựng", icon: Layers },
    { href: "/chat", label: "Chat AI", icon: Bot },
  ],
  zh: [
    { href: "/zh/notebook", label: "Sổ tay", icon: NotebookPen },
    { href: "/zh/vocab", label: "Từ vựng", icon: Layers },
    { href: "/zh/chat", label: "Chat AI", icon: Bot },
  ],
};

export function TodayHub({ course }: { course: CourseCode }) {
  const hydrated = useHydrated();
  const p = useProgress();
  const { profile, log } = useRoadmapState();
  if (!hydrated) return <div className="card h-64 animate-pulse" aria-busy="true" />;

  const days = profile ? daysFor(course, profile) : [];
  const day = profile ? nextOpenDay(days, log) : undefined;
  const task = day?.tasks.find((t) => !taskDone(log, t));
  const dayN = day?.n ?? days.length;

  const today = dayNumber();
  const due = buildReviewQueue(p.srs, p.notebook ?? [], today).length;
  const reviewHref = course === "zh" ? "/zh/review" : "/review";

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <p className="flex items-center gap-4 text-sm font-semibold">
        <span className="flex items-center gap-1.5 text-warning">
          <Flame className="size-4" />
          <span className="text-fg">{p.streak}</span>
        </span>
        <span className="flex items-center gap-1.5 text-primary">
          <Star className="size-4" />
          <span className="text-fg">{p.xp} XP</span>
        </span>
        {profile && <span className="text-muted">Day {dayN}</span>}
      </p>

      <div className="grid gap-4 md:grid-cols-[1fr_18rem] md:items-start">
        <div className="space-y-4">
          {!profile ? (
            <SetupCard course={course} />
          ) : task && day ? (
            <section className={`rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg ${ACCENT[course]}`}>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/75">Tiếp theo</div>
              <h1 className="mt-1 text-xl font-extrabold leading-snug md:text-2xl">{task.title}</h1>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-white/80">~{task.minutes} phút</span>
                <Link
                  href={task.href}
                  onClick={() => saveReturnTarget({ day: day.n, taskId: task.id, title: task.title, course })}
                  className={`btn bg-white hover:bg-white/90 ${ACCENT_TEXT[course]}`}
                >
                  Bắt đầu <ArrowRight className="size-4" />
                </Link>
              </div>
            </section>
          ) : (
            <section className={`flex items-center gap-4 rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg ${ACCENT[course]}`}>
              <PartyPopper className="size-8 shrink-0" />
              <h1 className="flex-1 text-xl font-extrabold">Xong lộ trình</h1>
              <Link href={reviewHref} className={`btn bg-white hover:bg-white/90 ${ACCENT_TEXT[course]}`}>
                Ôn thẻ
              </Link>
            </section>
          )}

          {day && (
            <section className="card space-y-3 p-4">
              <div className="flex items-center gap-3">
                <span className="shrink-0 whitespace-nowrap font-bold">Day {day.n}</span>
                <ProgressBar value={(dayTasksDone(log, day) / day.tasks.length) * 100} label={`Tiến độ Day ${day.n}`} />
                <span className="shrink-0 text-sm text-muted">
                  {dayTasksDone(log, day)}/{day.tasks.length}
                </span>
              </div>
              <DayTasks day={day} log={log} compact />
            </section>
          )}
        </div>

        <div className="space-y-4">
          {due > 0 && (
            <Link href={reviewHref} className="card flex items-center gap-3 p-4 transition hover:shadow-md">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-primary">
                <Repeat className="size-5" />
              </span>
              <span className="flex-1 font-bold">Ôn thẻ hôm nay</span>
              <span className="text-lg font-extrabold text-primary">{due}</span>
            </Link>
          )}
          <div className="grid grid-cols-3 gap-3">
            {QUICK[course].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="card flex flex-col items-center gap-2 p-4 text-center transition hover:shadow-md">
                <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-bold">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Chưa có lộ trình: tiếng Anh mở trang tạo lộ trình (6 câu hỏi); tiếng Trung chọn ngay điểm bắt đầu. */
function SetupCard({ course }: { course: CourseCode }) {
  if (course === "zh") {
    const start = (skipIntro: boolean) => roadmapActions.saveProfile(zhProfile(skipIntro, todayKey()));
    return (
      <section className={`space-y-4 rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg ${ACCENT.zh}`}>
        <h1 className="text-xl font-extrabold md:text-2xl">Bắt đầu lộ trình tiếng Trung</h1>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => start(false)} className="btn bg-white text-rose-700 hover:bg-white/90">
            Bắt đầu từ pinyin
          </button>
          <button type="button" onClick={() => start(true)} className="btn bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25">
            Đã biết pinyin
          </button>
        </div>
      </section>
    );
  }
  return (
    <section className={`flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg ${ACCENT.en}`}>
      <Route className="size-8 shrink-0" />
      <h1 className="flex-1 text-xl font-extrabold md:text-2xl">Tạo lộ trình của bạn</h1>
      <Link href="/roadmap" className="btn bg-white text-indigo-700 hover:bg-white/90">
        Bắt đầu <ArrowRight className="size-4" />
      </Link>
    </section>
  );
}
