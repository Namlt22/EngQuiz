"use client";

/**
 * Trang /vocab: 600 từ tiếng Anh A1–B2 theo chủ đề, ôn thẻ lặp lại ngắt quãng (3 kiểu ôn).
 * Cấp và chủ đề nằm trên URL (?level=A2&topic=travel) để quay lại đúng chỗ.
 */
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Brain, Keyboard, Layers, Volume2 } from "lucide-react";
import { EN_POS_LABEL, EN_VOCAB_LEVELS, EN_VOCAB_TOPICS } from "@/content/vocab-en";
import type { LevelCode } from "@/content/types";
import { MASTERED_BOX, buildQueue, dayNumber, decodeSrs } from "@/core/srs";
import { useProgress } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { EnFlashcardSession, type EnCardMode } from "./EnFlashcardSession";

export function EnVocabHome() {
  const params = useSearchParams();
  const router = useRouter();
  const level = (EN_VOCAB_LEVELS as string[]).includes(params.get("level") ?? "") ? (params.get("level") as LevelCode) : EN_VOCAB_LEVELS[0];
  const topics = EN_VOCAB_TOPICS.filter((t) => t.level === level);
  const topic = topics.find((t) => t.id === params.get("topic"));
  const { speak } = useSpeech();
  const progress = useProgress();
  const srs = useMemo(() => decodeSrs(progress.srs), [progress.srs]);
  const [session, setSession] = useState<{ queue: string[]; mode: EnCardMode } | null>(null);

  const words = (topic ? [topic] : topics).flatMap((t) => t.words);
  const list = words.map((w) => w[0]);
  const today = dayNumber();
  const queue = buildQueue(list, srs, today);
  const mastered = list.filter((w) => (srs.get(w)?.box ?? 0) >= MASTERED_BOX).length;
  const learning = list.filter((w) => srs.has(w)).length - mastered;
  const due = list.filter((w) => {
    const s = srs.get(w);
    return s && s.due <= today;
  }).length;

  const go = (lv: string, tp?: string) => router.replace(`/vocab?level=${lv}${tp ? `&topic=${tp}` : ""}`, { scroll: false });

  if (session) {
    return (
      <div className="mx-auto max-w-xl">
        <EnFlashcardSession queue={session.queue} mode={session.mode} speak={(t, rate) => speak(t, rate)} onExit={() => setSession(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Từ vựng</h1>
      </header>

      <div role="tablist" aria-label="Cấp độ" className="flex flex-wrap gap-2">
        {EN_VOCAB_LEVELS.map((lv) => (
          <button
            key={lv}
            type="button"
            role="tab"
            aria-selected={lv === level}
            onClick={() => go(lv)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${lv === level ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
          >
            {lv}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <TopicChip active={!topic} onClick={() => go(level)} label={`Tất cả · ${topics.length * 25}`} />
        {topics.map((t) => (
          <TopicChip key={t.id} active={topic?.id === t.id} onClick={() => go(level, t.id)} label={`${t.emoji} ${t.title}`} />
        ))}
      </div>

      <section className="card grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat icon={<Brain className="size-4" />} value={mastered} label="Đã thuộc" tone="text-success" />
          <Stat icon={<Layers className="size-4" />} value={learning} label="Đang học" tone="text-primary" />
          <Stat icon={<BookOpen className="size-4" />} value={list.length - mastered - learning} label="Chưa học" tone="text-muted" />
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" disabled={!queue.length} onClick={() => setSession({ queue, mode: "meaning" })} className="btn-primary">
            {queue.length ? `Ôn ${queue.length} thẻ (${due} đến hạn)` : "Hôm nay đã ôn xong"}
          </button>
          <div className="flex gap-2">
            <button type="button" disabled={!queue.length} onClick={() => setSession({ queue, mode: "word" })} className="btn-ghost flex-1 text-sm">
              Từ → nghĩa
            </button>
            <button type="button" disabled={!queue.length} onClick={() => setSession({ queue, mode: "spell" })} className="btn-ghost flex-1 text-sm">
              <Keyboard className="size-4" /> Gõ từ
            </button>
          </div>
        </div>
      </section>

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {words.map(([word, pos, ipa, vi, example]) => {
          const box = srs.get(word)?.box;
          return (
            <li key={word} className="flex items-center gap-3 p-3">
              <button type="button" onClick={() => speak(word, 0.9)} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-primary" aria-label={`Nghe ${word}`}>
                <Volume2 className="size-4" />
              </button>
              <button type="button" onClick={() => speak(example)} className="min-w-0 flex-1 text-left" title={example}>
                <span lang="en" className="font-bold">
                  {word}
                </span>{" "}
                <span className="font-mono text-sm text-muted">{ipa}</span>
                <span className="block text-sm text-muted">
                  <span className="text-xs">({EN_POS_LABEL[pos]})</span> {vi}
                </span>
              </button>
              {box !== undefined && (
                <span className={`chip shrink-0 ${box >= MASTERED_BOX ? "bg-success/10 text-success" : "bg-primary-soft text-primary"}`}>
                  {box >= MASTERED_BOX ? "Đã thuộc" : `Hộp ${box}`}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TopicChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`chip text-sm ${active ? "bg-primary-soft font-semibold text-primary ring-1 ring-primary/40" : "bg-surface-2 text-muted hover:text-fg"}`}
    >
      {label}
    </button>
  );
}

function Stat({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: string }) {
  return (
    <div>
      <div className={`flex items-center justify-center gap-1 text-2xl font-extrabold ${tone}`}>
        {icon}
        {value}
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
