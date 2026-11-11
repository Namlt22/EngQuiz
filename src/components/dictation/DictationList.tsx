"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Headphones, MessagesSquare, Sparkles } from "lucide-react";
import { DICTATION_KIND_LABELS } from "@/content/dictations";
import { LEVELS } from "@/content/levels";
import type { DictationExercise, DictationKind, LevelCode } from "@/content/types";
import { PASS_PERCENT, useProgress } from "@/lib/progress";
import { LevelBadge } from "@/components/ui/LevelBadge";

const KIND_ICON: Record<DictationKind, React.ReactNode> = {
  grammar: <Sparkles className="size-5" />,
  story: <BookOpen className="size-5" />,
  conversation: <MessagesSquare className="size-5" />,
};
const KIND_TONE: Record<DictationKind, string> = {
  grammar: "from-violet-500 to-indigo-500",
  story: "from-emerald-500 to-teal-500",
  conversation: "from-orange-500 to-amber-500",
};

export function DictationList({ exercises }: { exercises: DictationExercise[] }) {
  const p = useProgress();
  const [level, setLevel] = useState<LevelCode | "ALL">("ALL");
  const kinds = Object.keys(DICTATION_KIND_LABELS) as DictationKind[];
  const visible = exercises.filter((e) => level === "ALL" || e.level === level);

  return (
    <div className="space-y-8">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(["ALL", ...LEVELS.map((l) => l.code)] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setLevel(v)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              level === v ? "bg-primary text-primary-fg" : "border border-line bg-surface text-muted hover:text-fg"
            }`}
          >
            {v === "ALL" ? "Tất cả cấp" : v}
          </button>
        ))}
      </div>

      {kinds.map((kind) => {
        const list = visible.filter((e) => e.kind === kind);
        if (!list.length) return null;
        return (
          <section key={kind}>
            <div className="mb-3 flex items-center gap-3">
              <span className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br text-white ${KIND_TONE[kind]}`}>{KIND_ICON[kind]}</span>
              <div>
                <h2 className="font-bold">{DICTATION_KIND_LABELS[kind].label}</h2>
                <p className="text-xs text-muted">{DICTATION_KIND_LABELS[kind].description}</p>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((e) => {
                const best = p.dictations[e.id]?.best;
                return (
                  <li key={e.id}>
                    <Link href={`/dictation/${e.id}`} className="card group flex h-full flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-center gap-2">
                        <LevelBadge level={e.level} />
                        <span className="text-xs text-muted">{e.sentences.length} câu</span>
                        {best !== undefined && (
                          <span className={`chip ml-auto ${best >= PASS_PERCENT ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
                            {best}%
                          </span>
                        )}
                      </div>
                      <div className="font-semibold">{e.title}</div>
                      <p className="flex-1 text-sm text-muted">{e.description}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        <Headphones className="size-4" /> {best !== undefined ? "Luyện lại" : "Bắt đầu"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
