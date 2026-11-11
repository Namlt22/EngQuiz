"use client";

import Link from "next/link";
import { ArrowRight, Layers, PenLine, Shapes } from "lucide-react";
import type { QuizSet } from "@/lib/quiz-sets";
import { PASS_PERCENT, useProgress } from "@/lib/progress";
import { LevelBadge } from "@/components/ui/LevelBadge";

type SetSummary = Omit<QuizSet, "items"> & { count: number; topicSlug?: string };

export function QuizSetList({ sets }: { sets: SetSummary[] }) {
  const p = useProgress();
  const topicSets = sets.filter((s) => s.kind === "topic");
  const mixed = sets.filter((s) => s.kind !== "topic");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Shapes className="size-5 text-primary" /> Bộ đề tổng hợp
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mixed.map((s) => (
            <Link key={s.id} href={`/quiz/${s.id}`} className="card group flex flex-col gap-2 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                  <Layers className="size-5" />
                </span>
                {s.level && <LevelBadge level={s.level} />}
              </div>
              <div className="font-bold">{s.title}</div>
              <div className="line-clamp-2 text-xs text-muted">{s.subtitle}</div>
              <div className="mt-auto flex items-center justify-between pt-2 text-sm">
                <span className="text-muted">{s.count} câu</span>
                <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <PenLine className="size-5 text-primary" /> Theo chủ điểm
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {topicSets.map((s) => {
            const best = s.topicSlug ? p.topics[s.topicSlug]?.quizBest : undefined;
            return (
              <li key={s.id}>
                <Link href={`/quiz/${s.id}`} className="card flex items-center gap-3 p-4 transition hover:shadow-md">
                  {s.level && <LevelBadge level={s.level} />}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-xs text-muted">
                      {s.subtitle} · {s.count} câu
                    </div>
                  </div>
                  {best !== undefined && (
                    <span className={`chip ${best >= PASS_PERCENT ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
                      {best}%
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
