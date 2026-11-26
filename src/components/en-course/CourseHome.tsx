"use client";

import Link from "next/link";
import { CheckCircle2, Lock, Target } from "lucide-react";
import { EN_COURSE_DAYS, EN_COURSE_UNITS } from "@/content/en-course";
import { isDayDone, isDayUnlocked, nextDay, partsDone } from "@/lib/en-course";
import { useEnExtra } from "@/lib/en-extra-store";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function CourseHome() {
  const extra = useEnExtra();
  const done = EN_COURSE_DAYS.filter((d) => isDayDone(extra, d.id)).length;
  const current = nextDay(extra);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">Khoá A1 20 ngày</h1>
        <Link href="/level-test" className="btn-ghost text-sm">
          <Target className="size-4" /> Kiểm tra trình độ
        </Link>
      </header>

      <section className="card flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-48 flex-1">
          <ProgressBar value={(done / EN_COURSE_DAYS.length) * 100} label="Tiến độ khoá A1" />
          <p className="mt-2 text-sm font-semibold text-muted">
            {done}/{EN_COURSE_DAYS.length}
          </p>
        </div>
        <Link href={`/a1-course/${current.day}`} className="btn-primary">
          Ngày {current.day} · {current.title.vi}
        </Link>
      </section>

      {EN_COURSE_UNITS.map((u) => (
        <section key={u.unit} className="space-y-3">
          <h2 className="font-bold">{u.title.vi}</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {u.days.map((d) => {
              const open = isDayUnlocked(extra, d.day);
              const isDone = isDayDone(extra, d.id);
              const n = partsDone(extra, d.id).length;
              const cls = `card flex h-full flex-col p-4 transition ${current.id === d.id && !isDone ? "ring-2 ring-primary" : ""} ${open ? "hover:shadow-md" : "opacity-55"}`;
              const inner = (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted">
                    <span>{d.day}</span>
                    {isDone ? <CheckCircle2 className="size-4 text-success" /> : !open && <Lock className="size-4" />}
                  </div>
                  <p className="mt-2 font-bold leading-snug">{d.title.vi}</p>
                  {open && !isDone && n > 0 && <p className="mt-auto pt-2 text-xs font-semibold text-primary">{n}/6</p>}
                </>
              );
              return (
                <li key={d.id}>
                  {open ? (
                    <Link href={`/a1-course/${d.day}`} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
