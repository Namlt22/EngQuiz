"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpenText, CheckCircle2, ChevronLeft, Headphones, Languages, ListChecks, Lock, Mic, PartyPopper, PencilLine, Puzzle } from "lucide-react";
import type { CourseDay } from "@/content/en-course";
import type { GameWord } from "@/core/en-vocab-games";
import { isDayDone, isDayUnlocked, type DayGrammar } from "@/lib/en-course";
import { EN_COURSE_PARTS, enExtraActions, getEnExtra, useEnExtra, type EnCoursePart } from "@/lib/en-extra-store";
import { HideBottomNav } from "@/components/en-games/HideBottomNav";
import { CheckPart, GrammarPart, ListeningPart, PART_LABEL, ReadingPart, SpeakingPart, WordsPart, WritingPart } from "./CourseParts";

type Tab = EnCoursePart | "check";
const TABS: Tab[] = [...EN_COURSE_PARTS, "check"];
const ICONS: Record<Tab, React.ElementType> = {
  words: Languages,
  grammar: Puzzle,
  listening: Headphones,
  reading: BookOpenText,
  writing: PencilLine,
  speaking: Mic,
  check: ListChecks,
};

interface Props {
  day: CourseDay;
  unitTitle: string;
  totalDays: number;
  words: GameWord[];
  grammar: DayGrammar;
}

export function DayPlayer({ day, unitTitle, totalDays, words, grammar }: Props) {
  const extra = useEnExtra();
  const [tab, setTab] = useState<Tab>("words");
  const scores = extra.course[day.id] ?? {};
  const unlocked = isDayUnlocked(extra, day.day);
  const complete = isDayDone(extra, day.id);

  // Mở lại ngày đang học: nhảy tới phần đầu tiên chưa làm. Đọc thẳng từ kho vì lần render hydrate đầu là rỗng.
  useEffect(() => {
    const saved = getEnExtra().course[day.id] ?? {};
    if (Object.keys(saved).length) setTab(EN_COURSE_PARTS.find((k) => saved[k] === undefined) ?? "check");
  }, [day.id]);

  const done = (part: EnCoursePart) => (score: number) => enExtraActions.recordCoursePart(day.id, part, score);
  const go = (next: Tab) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const idx = TABS.indexOf(tab);
  const nextTab = TABS[Math.min(idx + 1, TABS.length - 1)];
  const firstTodo = EN_COURSE_PARTS.find((k) => scores[k] === undefined);

  const header = (
    <header className="space-y-2">
      <Link href="/a1-course" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg">
        <ChevronLeft className="size-4" /> Khoá A1
      </Link>
      <p className="text-sm font-semibold text-primary">
        {unitTitle} · {day.day}/{totalDays}
      </p>
      <h1 className="text-2xl font-extrabold md:text-3xl">{day.title.vi}</h1>
    </header>
  );

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {header}
        <section className="card flex flex-col items-center gap-3 p-10 text-center">
          <Lock className="size-10 text-muted" />
          <Link href={`/a1-course/${day.day - 1}`} className="btn-primary">
            Ngày {day.day - 1} <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      <HideBottomNav />
      {header}
      <nav className="-mx-4 overflow-x-auto px-4" aria-label="Các phần trong ngày">
        <ol className="flex min-w-max gap-2">
          {TABS.map((k, i) => {
            const Icon = ICONS[k];
            const isDone = k === "check" ? complete : scores[k] !== undefined;
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => go(k)}
                  aria-current={tab === k ? "step" : undefined}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition ${
                    tab === k ? "border-primary bg-primary text-primary-fg" : isDone ? "border-success/40 bg-success/10 text-success" : "border-line bg-surface text-muted hover:text-fg"
                  }`}
                >
                  {isDone && tab !== k ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                  <span>
                    <span className="mr-1 opacity-60">{i + 1}</span>
                    {PART_LABEL[k]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section key={tab} className="animate-pop-in">
        {tab === "words" && <WordsPart words={words} onDone={done("words")} />}
        {tab === "grammar" && <GrammarPart grammar={grammar} review={day.review} onDone={done("grammar")} />}
        {tab === "listening" && <ListeningPart day={day} onDone={done("listening")} />}
        {tab === "reading" && <ReadingPart day={day} onDone={done("reading")} />}
        {tab === "writing" && <WritingPart day={day} onDone={done("writing")} />}
        {tab === "speaking" && <SpeakingPart day={day} onDone={done("speaking")} />}
        {tab === "check" && (
          <div className="space-y-5">
            {complete && (
              <p className="animate-pop-in flex items-center gap-2 text-xl font-extrabold text-success">
                <PartyPopper className="size-6" /> Xong ngày {day.day}
              </p>
            )}
            <CheckPart scores={scores} onGo={go} />
            {complete ? (
              day.day < totalDays && (
                <Link href={`/a1-course/${day.day + 1}`} className="btn-primary">
                  Ngày {day.day + 1} <ArrowRight className="size-4" />
                </Link>
              )
            ) : (
              firstTodo && (
                <button type="button" className="btn-primary" onClick={() => go(firstTodo)}>
                  {PART_LABEL[firstTodo]} <ArrowRight className="size-4" />
                </button>
              )
            )}
          </div>
        )}
      </section>

      {tab !== "check" && (
        <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
          <button type="button" className="text-sm font-semibold text-muted hover:text-fg" onClick={() => go(nextTab)}>
            Bỏ qua
          </button>
          {scores[tab] !== undefined && (
            <button type="button" className="btn-primary" onClick={() => go(nextTab)}>
              {PART_LABEL[nextTab]} <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
