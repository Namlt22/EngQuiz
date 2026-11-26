"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { BookOpen, CheckCheck, ChevronLeft, Keyboard, ListChecks, Wrench } from "lucide-react";
import type { LevelCode, Question } from "@/content/types";
import { GRAMMAR_MODES, availableGrammarModes, buildGrammarGame, type GrammarMode } from "@/core/en-grammar-games";
import { shuffle } from "@/core/en-vocab-games";
import { enExtraActions, useEnExtra } from "@/lib/en-extra-store";
import type { QuizSet } from "@/lib/quiz-sets";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { HideBottomNav } from "./HideBottomNav";

const ICONS: Record<GrammarMode, React.ElementType> = { choose: ListChecks, truefalse: CheckCheck, fix: Wrench, type: Keyboard };
export const GRAMMAR_MODE_LABEL: Record<GrammarMode, string> = { choose: "Chọn đáp án", truefalse: "Đúng hay sai", fix: "Sửa lỗi", type: "Gõ đáp án" };
export const grammarGameId = (slug: string, mode: GrammarMode) => `grammar:${slug}:${mode}`;

interface Props {
  slug: string;
  title: string;
  titleEn: string;
  level: LevelCode;
  questions: Question[];
}

export function GrammarGame({ slug, title, titleEn, level, questions }: Props) {
  const params = useSearchParams();
  const extra = useEnExtra();
  const modes = useMemo(() => availableGrammarModes(questions), [questions]);
  const mode = modes.find((m) => m === params.get("mode")) ?? null;

  // Bộ câu trộn ở client sau khi chọn kiểu chơi (không lệch hydration).
  const set: QuizSet | null = useMemo(() => {
    if (!mode) return null;
    const items = shuffle(buildGrammarGame(mode, questions)).map((question) => ({ question, topicSlug: slug }));
    return { id: grammarGameId(slug, mode), kind: "game", title, subtitle: GRAMMAR_MODE_LABEL[mode], level, items };
  }, [mode, questions, slug, title, level]);

  const onSaved = useCallback((percent: number) => mode && enExtraActions.recordGame(grammarGameId(slug, mode), percent), [mode, slug]);

  if (set)
    return (
      <>
        <HideBottomNav />
        <QuizPlayer key={set.id} set={set} onSaved={onSaved} />
      </>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/games?tab=grammar" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg">
        <ChevronLeft className="size-4" /> Trò chơi
      </Link>
      <header>
        <p className="flex items-center gap-2 text-sm text-muted">
          <LevelBadge level={level} /> <span lang="en">{titleEn}</span>
        </p>
        <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">{title}</h1>
        <Link href={`/grammar/${slug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          <BookOpen className="size-4" /> Lý thuyết
        </Link>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {GRAMMAR_MODES.filter((m) => modes.includes(m)).map((m) => {
          const Icon = ICONS[m];
          const best = extra.games[grammarGameId(slug, m)];
          return (
            <li key={m}>
              <Link href={`/games/grammar/${slug}?mode=${m}`} className="card flex items-center gap-4 p-4 transition hover:shadow-md">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-6" />
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{GRAMMAR_MODE_LABEL[m]}</span>
                  <span className="block text-sm text-muted">{buildGrammarGame(m, questions).length} câu</span>
                </span>
                {best !== undefined && <span className="chip bg-success/10 text-success">{best}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
