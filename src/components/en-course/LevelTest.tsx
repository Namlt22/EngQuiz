"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, RotateCcw, Target } from "lucide-react";
import { LEVEL_TEST } from "@/content/en-level-test";
import { getLevel } from "@/content/levels";
import { placement, shouldStop, TEST_LEVELS, type LevelAnswer, type Placement } from "@/core/en-level-test";
import { enExtraActions, useEnExtra } from "@/lib/en-extra-store";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { HideBottomNav } from "@/components/en-games/HideBottomNav";

/** Khoá A1 20 ngày chỉ có cho A1; cấp khác dẫn về chủ điểm ngữ pháp của cấp đó. */
const hasA1Course = (level: string) => level === "A1";

export function LevelTest() {
  const extra = useEnExtra();
  const [stage, setStage] = useState<"intro" | "test" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<LevelAnswer[]>([]);
  const [result, setResult] = useState<Placement | null>(null);

  function answer(choice: number) {
    const q = LEVEL_TEST[index];
    const next = [...answers, { level: q.level, correct: choice === q.answer }];
    setAnswers(next);
    if (shouldStop(next) || index + 1 >= LEVEL_TEST.length) {
      const r = placement(next);
      setResult(r);
      enExtraActions.recordPlacement({ estimate: r.estimate, start: r.start, at: Date.now() });
      setStage("result");
    } else setIndex(index + 1);
  }

  function restart() {
    setAnswers([]);
    setIndex(0);
    setResult(null);
    setStage("test");
  }

  if (stage === "intro") {
    return (
      <section className="card mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <Target className="size-12 text-primary" />
        <h1 className="text-2xl font-extrabold">Kiểm tra trình độ</h1>
        <p className="text-sm text-muted">A1 → C1 · 20 câu</p>
        {extra.placement && (
          <p className="chip bg-surface-2 text-muted">
            {extra.placement.estimate ?? "Mới bắt đầu"} → {extra.placement.start}
          </p>
        )}
        <button type="button" className="btn-primary" onClick={() => setStage("test")}>
          Bắt đầu <ArrowRight className="size-4" />
        </button>
      </section>
    );
  }

  if (stage === "result" && result) {
    const start = getLevel(result.start.toLowerCase())!;
    return (
      <section className="card animate-pop-in mx-auto max-w-md overflow-hidden text-center">
        <div className={`bg-gradient-to-br p-8 text-white ${start.gradient}`}>
          <p className="text-5xl font-black">{result.estimate ?? "Mới bắt đầu"}</p>
          <p className="mt-2 font-semibold text-white/90">→ {result.start}</p>
        </div>
        <ul className="grid grid-cols-5 gap-1 p-4 text-center text-xs">
          {TEST_LEVELS.map((lv) => {
            const s = result.byLevel[lv];
            return (
              <li key={lv} className={`rounded-lg py-2 ${s ? getLevel(lv.toLowerCase())!.badge : "bg-surface-2 text-muted"}`}>
                <b>{lv}</b>
                <br />
                {s ? `${s.correct}/${s.total}` : "–"}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-2 px-4 pb-5">
          {hasA1Course(result.start) ? (
            <Link href="/a1-course" className="btn-primary">
              Khoá A1 20 ngày <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Link href={`/levels/${result.start.toLowerCase()}`} className="btn-primary">
              Ngữ pháp {result.start} <ArrowRight className="size-4" />
            </Link>
          )}
          <button type="button" className="mx-auto inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg" onClick={restart}>
            <RotateCcw className="size-3.5" /> Làm lại
          </button>
        </div>
      </section>
    );
  }

  const q = LEVEL_TEST[index];
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <HideBottomNav />
      <SessionHeader current={index + 1} total={LEVEL_TEST.length} value={(index / LEVEL_TEST.length) * 100} onExit={() => setStage("intro")} />
      <div key={q.id} className="animate-pop-in space-y-6">
        <p lang="en" className="text-2xl font-semibold leading-relaxed">
          {q.prompt.split("___").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span className="mx-1 inline-block w-16 border-b-4 border-primary/60 align-baseline" />}
            </span>
          ))}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {q.options.map((o) => (
            <button
              key={o}
              type="button"
              lang="en"
              onClick={() => answer(q.options.indexOf(o))}
              className="w-full rounded-2xl border-2 border-line bg-surface px-4 py-3.5 text-left text-base font-semibold transition hover:border-primary/50 hover:bg-surface-2"
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
