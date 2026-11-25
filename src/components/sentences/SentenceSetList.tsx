"use client";

/** Danh sách bộ luyện đặt câu của một khoá, xếp theo cấp độ, kèm điểm cao nhất đã đạt. */
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { sentenceSetsFor } from "@/content/sentence-practice";
import type { CourseCode } from "@/lib/course";
import { PASS_PERCENT, useProgress } from "@/lib/progress";

export function SentenceSetList({ course }: { course: CourseCode }) {
  const scores = useProgress(course).sentences ?? {};
  const base = course === "zh" ? "/zh/sentences" : "/sentences";
  const sets = sentenceSetsFor(course);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold md:text-3xl">Đặt câu</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((s) => {
          const best = scores[s.id]?.best;
          const passed = best !== undefined && best >= PASS_PERCENT;
          return (
            <li key={s.id}>
              <Link href={`${base}/${s.id}`} className="card flex h-full flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:border-primary/50">
                <div className="flex items-center gap-2">
                  <span className="chip bg-surface-2 text-muted">{s.level}</span>
                  <span className="text-xs text-muted">{s.tasks.length} câu</span>
                  {best !== undefined && (
                    <span className={`ml-auto inline-flex items-center gap-1 text-xs font-semibold ${passed ? "text-success" : "text-muted"}`}>
                      {passed && <CheckCircle2 className="size-4" />}
                      {best}%
                    </span>
                  )}
                </div>
                <h2 className="font-bold">{s.title}</h2>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
