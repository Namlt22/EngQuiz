"use client";

/** Danh sách bài (bài đọc / hội thoại) có lọc theo cấp độ và hiện điểm cao nhất đã đạt. */
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { LEVELS } from "@/content/levels";
import type { LevelCode } from "@/content/types";
import { PASS_PERCENT, useProgress, type ProgressState } from "@/lib/progress";
import { LevelBadge } from "@/components/ui/LevelBadge";

export interface LessonCard {
  id: string;
  title: string;
  level: LevelCode;
  tag: string;
  description: string;
}

export function LessonList({ lessons, basePath, field }: { lessons: LessonCard[]; basePath: string; field: "reading" | "dialogues" }) {
  const progress: ProgressState = useProgress();
  const [level, setLevel] = useState<LevelCode | "ALL">("ALL");
  const levels = LEVELS.filter((l) => lessons.some((x) => x.level === l.code));
  const visible = lessons.filter((x) => level === "ALL" || x.level === level);
  const scores = progress[field] ?? {};

  return (
    <div className="space-y-5">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Lọc theo cấp độ">
        {(["ALL", ...levels.map((l) => l.code)] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={level === v}
            onClick={() => setLevel(v)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              level === v ? "bg-primary text-primary-fg" : "border border-line bg-surface text-muted hover:text-fg"
            }`}
          >
            {v === "ALL" ? "Tất cả" : v}
          </button>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((x) => {
          const best = scores[x.id]?.best;
          const passed = best !== undefined && best >= PASS_PERCENT;
          return (
            <li key={x.id}>
              <Link href={`${basePath}/${x.id}`} className="card flex h-full flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:border-primary/50">
                <div className="flex items-center gap-2">
                  <LevelBadge level={x.level} />
                  <span className="chip bg-surface-2 text-muted">{x.tag}</span>
                  {best !== undefined && (
                    <span className={`ml-auto inline-flex items-center gap-1 text-xs font-semibold ${passed ? "text-success" : "text-muted"}`}>
                      {passed && <CheckCircle2 className="size-4" />}
                      {best}%
                    </span>
                  )}
                </div>
                <h2 className="font-bold">{x.title}</h2>
                <p className="text-sm text-muted">{x.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
