"use client";

import { useEffect, useMemo, useRef } from "react";
import type { DictationExercise } from "@/content/types";
import { PASS_PERCENT, progressActions } from "@/lib/progress";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { ActivityResult } from "@/components/lesson/ActivityResult";
import { CATALOG } from "@/content/catalog";
import { DICTATIONS } from "@/content/dictations";
import { isAvailable } from "@/lib/learn";

export interface SentenceResult {
  /** Độ chính xác ở lần kiểm tra ĐẦU TIÊN (0..1) — phản ánh đúng khả năng nghe. */
  firstAccuracy: number;
  checks: number;
  revealed: boolean;
  plays: number;
}

/** Tổng kết bài nghe chép: lưu điểm, gợi ý bài tiếp, xem lại từng câu. */
export function DictationSummary({
  exercise,
  results,
  onRestart,
}: {
  exercise: DictationExercise;
  results: SentenceResult[];
  onRestart: () => void;
}) {
  const percent = Math.round((results.reduce((s, r) => s + (r?.firstAccuracy ?? 0), 0) / exercise.sentences.length) * 100);
  const perfect = results.filter((r) => r && r.checks === 1 && r.firstAccuracy === 1 && !r.revealed).length;
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    progressActions.recordDictation(exercise.id, exercise.topicSlug, percent, exercise.sentences.length, exercise.sentences.length);
  }, [exercise, percent]);

  const passed = percent >= PASS_PERCENT;
  // Bước tiếp: chủ điểm kế tiếp (bài theo chủ điểm) hoặc bài nghe chép kế tiếp cùng loại.
  const nextLink = useMemo(() => {
    if (exercise.topicSlug) {
      const i = CATALOG.findIndex((t) => t.slug === exercise.topicSlug);
      const t = CATALOG.slice(i + 1).find((x) => isAvailable(x.slug));
      return t ? { label: t.title, href: `/grammar/${t.slug}` } : undefined;
    }
    const same = DICTATIONS.filter((d) => d.kind === exercise.kind);
    const n = same[same.findIndex((d) => d.id === exercise.id) + 1];
    return n ? { label: n.title, href: `/dictation/${n.id}` } : undefined;
  }, [exercise]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ActivityResult
        passed={passed}
        percent={percent}
        detail={`${perfect}/${exercise.sentences.length}`}
        onRetry={onRestart}
        reviewLink={exercise.topicSlug ? { label: "Xem lại lý thuyết", href: `/grammar/${exercise.topicSlug}` } : undefined}
        next={nextLink}
      />

      <section className="card divide-y divide-line">
        <h2 className="p-4 font-bold">Toàn bộ nội dung</h2>
        {exercise.sentences.map((s, i) => {
          const r = results[i];
          const pct = Math.round((r?.firstAccuracy ?? 0) * 100);
          return (
            <div key={i} className="flex items-start gap-3 p-4">
              <SpeakButton text={s.text} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{s.text}</p>
                <p className="text-sm text-muted">{s.vi}</p>
              </div>
              <span
                className={`chip shrink-0 ${
                  r?.revealed && !r.checks ? "bg-surface-2 text-muted" : pct >= PASS_PERCENT ? "bg-success-soft text-success" : pct >= 50 ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"
                }`}
              >
                {r?.revealed && !r.checks ? "xem đáp án" : `${pct}%`}
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
