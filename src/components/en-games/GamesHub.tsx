"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EN_VOCAB_TOPICS } from "@/content/vocab-en";
import type { LevelCode } from "@/content/types";
import { useEnExtra } from "@/lib/en-extra-store";
import { LevelBadge } from "@/components/ui/LevelBadge";

export interface GrammarGameCard {
  slug: string;
  title: string;
  titleEn: string;
  level: LevelCode;
}

export function GamesHub({ grammar }: { grammar: GrammarGameCard[] }) {
  const extra = useEnExtra();
  const router = useRouter();
  const tab = useSearchParams().get("tab") === "grammar" ? "grammar" : "vocab";

  const bestOf = (prefix: string) => {
    const scores = Object.entries(extra.games)
      .filter(([k]) => k.startsWith(prefix))
      .map(([, v]) => v);
    return scores.length ? Math.max(...scores) : undefined;
  };
  const levels = [...new Set(grammar.map((g) => g.level))];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold md:text-3xl">Trò chơi</h1>

      <div role="tablist" aria-label="Loại trò chơi" className="flex gap-2">
        {(["vocab", "grammar"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => router.replace(`/games?tab=${k}`, { scroll: false })}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${tab === k ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
          >
            {k === "vocab" ? "Từ vựng" : "Ngữ pháp"}
          </button>
        ))}
      </div>

      {tab === "vocab" ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {EN_VOCAB_TOPICS.map((t) => {
            const best = bestOf(`vocab:${t.id}:`);
            return (
              <li key={t.id}>
                <Link href={`/games/vocab/${t.id}`} className="card flex h-full flex-col p-4 transition hover:shadow-md">
                  <span className="text-3xl" aria-hidden>
                    {t.emoji}
                  </span>
                  <span className="mt-2 font-bold leading-tight">{t.title}</span>
                  <span className="mt-auto flex items-center justify-between pt-3">
                    <LevelBadge level={t.level} />
                    {best !== undefined && <span className="chip bg-success/10 text-success">{best}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="space-y-6">
          {levels.map((level) => (
            <section key={level} className="space-y-3">
              <LevelBadge level={level} />
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grammar
                  .filter((g) => g.level === level)
                  .map((g) => {
                    const best = bestOf(`grammar:${g.slug}:`);
                    return (
                      <li key={g.slug}>
                        <Link href={`/games/grammar/${g.slug}`} className="card flex items-center gap-3 p-4 transition hover:shadow-md">
                          <span className="flex-1">
                            <span className="block font-bold leading-tight">{g.title}</span>
                            <span lang="en" className="block text-xs text-muted">
                              {g.titleEn}
                            </span>
                          </span>
                          {best !== undefined && <span className="chip bg-success/10 text-success">{best}</span>}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
