"use client";

/** Danh sách bài của một ngày học: mỗi bài một dòng, bấm "Học" là vào đúng trang; xong thì tự hiện dấu tích. */
import Link from "next/link";
import { AudioLines, BookOpen, Check, Headphones, Layers, Mic, PenLine, Repeat, Volume2 } from "lucide-react";
import type { RoadmapLog } from "@/lib/roadmap";
import { taskDone, type RoadmapDay, type TaskKind } from "@/lib/roadmap-days";

const ICONS: Record<TaskKind, typeof BookOpen> = {
  theory: BookOpen,
  quiz: PenLine,
  quizset: Layers,
  dictation: Headphones,
  read: Volume2,
  sound: AudioLines,
  talk: Mic,
};

export const dayMinutes = (day: RoadmapDay) => day.tasks.reduce((sum, t) => sum + t.minutes, 0);

export function DayTasks({ day, log, compact = false }: { day: RoadmapDay; log: RoadmapLog; compact?: boolean }) {
  // Bài đầu tiên chưa xong được làm nổi bật: người học chỉ cần bấm nút đó.
  const firstOpen = day.tasks.find((t) => !taskDone(log, t));
  return (
    <ol className="space-y-2">
      {day.tasks.map((task, i) => {
        const done = taskDone(log, task);
        const Icon = ICONS[task.kind];
        const isNext = task.id === firstOpen?.id;
        return (
          <li
            key={task.id}
            className={`flex items-center gap-3 rounded-xl border p-3 transition ${
              done ? "border-transparent bg-success/10" : isNext ? "border-primary/40 bg-primary-soft/60" : "border-line bg-surface"
            }`}
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                done ? "bg-success text-white dark:text-bg" : "bg-surface-2 text-primary"
              }`}
              aria-hidden="true"
            >
              {done ? <Check className="size-5" /> : <Icon className="size-[18px]" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-semibold ${done ? "text-muted line-through decoration-1" : ""}`}>
                <span className="mr-1 text-muted">{i + 1}.</span>
                {task.title}
                {task.review && (
                  <span className="chip ml-1.5 bg-surface-2 align-middle text-[10px] text-muted">
                    <Repeat className="size-3" /> ôn
                  </span>
                )}
              </div>
              {!compact && (
                <div className="text-xs text-muted">
                  {done ? "Đã xong" : task.hint} · ~{task.minutes} phút
                </div>
              )}
            </div>
            <Link
              href={task.href}
              className={`shrink-0 px-3 py-1.5 text-xs ${done ? "btn-ghost" : isNext ? "btn-primary" : "btn-ghost"}`}
              aria-label={`${done ? "Học lại" : "Học"}: ${task.title}`}
            >
              {done ? "Học lại" : "Học"}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
