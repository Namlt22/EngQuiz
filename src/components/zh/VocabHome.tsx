"use client";

/**
 * Trang /zh/vocab: từ vựng HSK theo cấp, ôn thẻ lặp lại ngắt quãng.
 * Cấp chưa có nghĩa tiếng Việt vẫn hiện danh sách (chữ + pinyin) nhưng chưa mở ôn thẻ.
 */
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Brain, Layers, Volume2 } from "lucide-react";
import { HSK_LEVELS, type HskLevel } from "@/content/zh/hsk-levels";
import { wordsIntroducedAt } from "@/content/zh/vocab";
import { POS_LABEL, VI_LEVELS, vocabVi } from "@/content/zh/vocab-vi";
import { applySandhi } from "@/core/pinyin";
import { MASTERED_BOX, buildQueue, dayNumber, decodeSrs } from "@/core/srs";
import { useProgress } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { FlashcardSession, type CardMode } from "./FlashcardSession";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

function readLevel(v: string | null): HskLevel {
  const n = Number(v);
  return (HSK_LEVELS as number[]).includes(n) ? (n as HskLevel) : 1;
}

export function VocabHome() {
  const params = useSearchParams();
  const router = useRouter();
  const level = readLevel(params.get("level"));
  const speech = useSpeech({ lang: "zh" });
  const speak = (t: string) => speech.speak(t, 0.8);
  const progress = useProgress();
  const srs = useMemo(() => decodeSrs(progress.srs), [progress.srs]);
  const words = wordsIntroducedAt(level);
  const hasVi = VI_LEVELS.includes(level);
  const [session, setSession] = useState<{ queue: string[]; mode: CardMode } | null>(null);

  const today = dayNumber();
  const list = words.map((w) => w.hanzi);
  const queue = buildQueue(list, srs, today);
  const mastered = list.filter((w) => (srs.get(w)?.box ?? 0) >= MASTERED_BOX).length;
  const learning = list.filter((w) => srs.has(w)).length - mastered;
  const due = list.filter((w) => {
    const s = srs.get(w);
    return s && s.due <= today;
  }).length;

  if (session) {
    return (
      <div className="mx-auto max-w-xl">
        <FlashcardSession queue={session.queue} mode={session.mode} speak={speak} onExit={() => setSession(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-extrabold md:text-3xl">Từ vựng HSK</h1>
        <p className="max-w-2xl text-muted">
          Danh mục từ theo đề cương thi HSK mới. Ôn bằng thẻ lặp lại ngắt quãng: nhớ được thì lâu sau mới gặp lại, quên thì ôn lại ngay.
        </p>
      </header>

      <div role="tablist" aria-label="Cấp HSK" className="flex flex-wrap gap-2">
        {HSK_LEVELS.map((lv) => (
          <button
            key={lv}
            type="button"
            role="tab"
            aria-selected={lv === level}
            onClick={() => router.replace(`/zh/vocab?level=${lv}`, { scroll: false })}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${lv === level ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
          >
            HSK {lv} · {wordsIntroducedAt(lv).length} từ
          </button>
        ))}
      </div>

      <ZhVoiceNotice supported={speech.supported} voiceCount={speech.voiceOptions.length} />

      {hasVi ? (
        <section className="card grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat icon={<Brain className="size-4" />} value={mastered} label="Đã thuộc" tone="text-success" />
            <Stat icon={<Layers className="size-4" />} value={learning} label="Đang học" tone="text-primary" />
            <Stat icon={<BookOpen className="size-4" />} value={list.length - mastered - learning} label="Chưa học" tone="text-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" disabled={!queue.length} onClick={() => setSession({ queue, mode: "hanzi" })} className="btn-primary">
              {queue.length ? `Ôn ${queue.length} thẻ (${due} đến hạn)` : "Hôm nay đã ôn xong"}
            </button>
            <button type="button" disabled={!queue.length} onClick={() => setSession({ queue, mode: "meaning" })} className="btn-ghost text-sm">
              Ôn kiểu nghĩa → chữ
            </button>
          </div>
        </section>
      ) : (
        <p className="rounded-2xl border border-line p-4 text-sm text-muted">Nghĩa tiếng Việt và thẻ ôn của HSK {level} sẽ có khi tới chặng HSK {level} trong lộ trình.</p>
      )}

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {words.map((w) => {
          const vi = vocabVi(w.hanzi);
          const spoken = applySandhi(w.hanzi, w.pinyin);
          const box = srs.get(w.hanzi)?.box;
          return (
            <li key={w.hanzi} className="flex items-center gap-3 p-3">
              <button type="button" onClick={() => speak(w.hanzi)} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-primary" aria-label={`Nghe ${w.pinyin}`}>
                <Volume2 className="size-4" />
              </button>
              <span className="w-20 shrink-0 text-xl" lang="zh-Hans">
                {w.hanzi}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-semibold">{w.pinyin}</span>
                {spoken !== w.pinyin && <span className="ml-2 text-xs text-primary">đọc là {spoken}</span>}
                {vi && (
                  <span className="block text-sm text-muted">
                    {vi[2] && <span className="mr-1 uppercase">[{vi[2]}]</span>}
                    <span className="text-xs">({POS_LABEL[vi[0]]})</span> {vi[1]}
                  </span>
                )}
              </span>
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
