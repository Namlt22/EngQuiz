"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Ear, FileText, Link2, ListChecks, PencilLine } from "lucide-react";
import type { EnVocabTopic } from "@/content/vocab-en";
import { VOCAB_MODES, topicWords, type VocabMode } from "@/core/en-vocab-games";
import { enExtraActions, useEnExtra } from "@/lib/en-extra-store";
import { progressActions } from "@/lib/progress";
import { ActivityResult } from "@/components/lesson/ActivityResult";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { VOCAB_MODE_LABEL, VocabGamePlayer, type WordResult } from "./VocabGamePlayer";

const ICONS: Record<VocabMode, React.ElementType> = { listen: Ear, choose: ListChecks, fill: FileText, match: Link2, write: PencilLine };
export const vocabGameId = (topic: string, mode: VocabMode) => `vocab:${topic}:${mode}`;
const PASS = 80;

export function VocabTopicGame({ topic }: { topic: EnVocabTopic }) {
  const router = useRouter();
  const params = useSearchParams();
  const extra = useEnExtra();
  const mode = VOCAB_MODES.find((m) => m === params.get("mode")) ?? null;
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<WordResult[] | null>(null);
  const base = `/games/vocab/${topic.id}`;
  // Đổi kiểu chơi (link "bước tiếp theo" trên màn hình kết quả) → bắt đầu ván mới.
  useEffect(() => setResults(null), [mode]);

  function finish(r: WordResult[]) {
    const correct = r.filter((x) => x.correct).length;
    enExtraActions.recordGame(vocabGameId(topic.id, mode!), (correct / r.length) * 100);
    progressActions.addXp(correct);
    setResults(r);
  }

  if (mode && results) {
    const correct = results.filter((r) => r.correct).length;
    const percent = Math.round((correct / results.length) * 100);
    const nextMode = VOCAB_MODES[(VOCAB_MODES.indexOf(mode) + 1) % VOCAB_MODES.length];
    return (
      <div className="mx-auto max-w-2xl">
        <ActivityResult
          passed={percent >= PASS}
          percent={percent}
          detail={`${correct}/${results.length}`}
          xp={correct}
          onRetry={() => {
            setResults(null);
            setRound((n) => n + 1);
          }}
          next={{ label: VOCAB_MODE_LABEL[nextMode], href: `${base}?mode=${nextMode}` }}
          secondary={{ label: "Trò chơi", href: "/games" }}
        />
      </div>
    );
  }

  if (mode) {
    return (
      <VocabGamePlayer
        key={`${mode}-${round}`}
        words={topicWords(topic)}
        mode={mode}
        onFinish={finish}
        onExit={() => router.replace(base, { scroll: false })}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/games" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg">
        <ChevronLeft className="size-4" /> Trò chơi
      </Link>
      <header className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-4xl" aria-hidden>
          {topic.emoji}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">{topic.title}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <LevelBadge level={topic.level} /> {topic.words.length} từ
          </p>
        </div>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {VOCAB_MODES.map((m) => {
          const Icon = ICONS[m];
          const best = extra.games[vocabGameId(topic.id, m)];
          return (
            <li key={m}>
              <Link
                href={`${base}?mode=${m}`}
                className="card flex items-center gap-4 p-4 transition hover:shadow-md"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-6" />
                </span>
                <span className="flex-1 font-bold">{VOCAB_MODE_LABEL[m]}</span>
                {best !== undefined && <span className="chip bg-success/10 text-success">{best}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
