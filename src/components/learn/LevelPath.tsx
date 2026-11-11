"use client";

import Link from "next/link";
import { BookOpen, Check, Clock, Headphones, Lock, PenLine, Sparkles } from "lucide-react";
import { CATEGORY_LABELS } from "@/content/levels";
import type { LevelCode } from "@/content/types";
import { buildLevelPath, hasDictation } from "@/lib/learn";
import { PASS_PERCENT, topicMastery, useProgress } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function LevelPath({ level, accent }: { level: LevelCode; accent: string }) {
  const progress = useProgress();
  const nodes = buildLevelPath(level, progress);

  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {nodes.map((n, i) => {
        const p = progress.topics[n.meta.slug];
        const dict = hasDictation(n.meta.slug);
        const mastery = topicMastery(p, dict);
        const base = "card relative flex h-full flex-col p-4 transition";

        if (!n.available) {
          return (
            <li key={n.meta.slug}>
              <div className={`${base} border-dashed opacity-70`}>
                <Header index={i + 1} meta={n.meta} />
                <span className="chip mt-3 w-fit bg-surface-2 text-muted">
                  <Clock className="size-3" /> Đang biên soạn
                </span>
              </div>
            </li>
          );
        }

        return (
          <li key={n.meta.slug}>
            <Link
              href={`/grammar/${n.meta.slug}`}
              className={`${base} hover:-translate-y-0.5 hover:shadow-md ${
                n.recommended ? "ring-2 ring-primary/60" : ""
              } ${n.status === "done" ? "border-success/40" : ""}`}
            >
              {n.recommended && (
                <span className="chip absolute -top-2.5 right-3 bg-primary text-primary-fg shadow">
                  <Sparkles className="size-3" /> Học tiếp
                </span>
              )}
              <Header index={i + 1} meta={n.meta} done={n.status === "done"} locked={n.locked} />
              <div className="mt-3 flex items-center gap-2">
                <Dot ok={!!p?.theoryRead} icon={<BookOpen className="size-3.5" />} label="Đã đọc lý thuyết" />
                <Dot ok={(p?.quizBest ?? 0) >= PASS_PERCENT} icon={<PenLine className="size-3.5" />} label={`Quiz ≥ ${PASS_PERCENT}%`} />
                {dict && (
                  <Dot ok={(p?.dictationBest ?? 0) >= PASS_PERCENT} icon={<Headphones className="size-3.5" />} label={`Nghe chép ≥ ${PASS_PERCENT}%`} />
                )}
                <span className="ml-auto text-xs font-semibold text-muted">{mastery}%</span>
              </div>
              <ProgressBar value={mastery} className="mt-2 h-1.5" barClassName={accent} />
              {n.locked && (
                <p className="mt-2 text-xs text-muted">Nên học chủ điểm trước. Làm quiz đạt ≥ {PASS_PERCENT}% để học vượt.</p>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function Header({
  index,
  meta,
  done,
  locked,
}: {
  index: number;
  meta: { title: string; titleEn: string; category: keyof typeof CATEGORY_LABELS };
  done?: boolean;
  locked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${
          done ? "bg-success text-white dark:text-bg" : "bg-surface-2 text-muted"
        }`}
      >
        {done ? <Check className="size-4" /> : locked ? <Lock className="size-4" /> : index}
      </span>
      <div className="min-w-0">
        <div className="font-semibold leading-snug">{meta.title}</div>
        <div className="truncate text-xs text-muted">
          {meta.titleEn} · {CATEGORY_LABELS[meta.category]}
        </div>
      </div>
    </div>
  );
}

function Dot({ ok, icon, label }: { ok: boolean; icon: React.ReactNode; label: string }) {
  return (
    <span
      className={`grid size-7 place-items-center rounded-lg ${ok ? "bg-success-soft text-success" : "bg-surface-2 text-muted/60"}`}
      title={`${label}${ok ? " ✓" : ""}`}
      aria-label={`${label}: ${ok ? "đã đạt" : "chưa đạt"}`}
    >
      {icon}
    </span>
  );
}
