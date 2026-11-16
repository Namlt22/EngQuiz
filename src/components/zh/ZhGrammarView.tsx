"use client";

/** Trang một bài ngữ pháp tiếng Trung: lý thuyết (bật/tắt pinyin, nghe câu ví dụ) và bài tập cuối bài. */
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Volume2, XCircle } from "lucide-react";
import { ZH_GRAMMAR, type ZhBlock, type ZhGrammarLesson } from "@/content/zh/grammar";
import { plainText, sentencePinyin } from "@/core/zh-sentence";
import { progressActions, useProgress } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { ZhGrammarQuiz } from "./ZhGrammarQuiz";
import { ZhText, compactHan } from "./ZhText";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

const LESSON_XP = 10;
type Say = (zh: string) => void;

export function ZhGrammarView({ lesson }: { lesson: ZhGrammarLesson }) {
  const speech = useSpeech({ lang: "zh" });
  const say: Say = (zh) => speech.speak(plainText(zh), 0.8);
  const [pinyin, setPinyin] = useState(true);
  const done = !!useProgress().topics[`grammar-${lesson.id}`]?.theoryRead;
  const idx = ZH_GRAMMAR.findIndex((l) => l.id === lesson.id);
  const next = ZH_GRAMMAR[idx + 1];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/zh/grammar" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Ngữ pháp HSK {lesson.level}
      </Link>
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-surface-2">
            HSK {lesson.level} · Bài {idx + 1}
          </span>
          {done && (
            <span className="chip bg-success/10 text-success">
              <CheckCircle2 className="size-3.5" /> Đã học xong
            </span>
          )}
        </div>
        <h1 className="text-2xl font-extrabold md:text-3xl">{lesson.title}</h1>
        <p className="text-muted">{lesson.intro}</p>
        <div className="flex flex-wrap gap-1.5">
          {lesson.points.map((p) => (
            <span key={p} className="chip bg-primary-soft text-primary">
              {p}
            </span>
          ))}
        </div>
      </header>

      <div className="flex items-center justify-between gap-2">
        <ZhVoiceNotice supported={speech.supported} voiceCount={speech.voiceOptions.length} />
        <label className="ml-auto flex shrink-0 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={pinyin} onChange={(e) => setPinyin(e.target.checked)} className="size-4 accent-[var(--primary)]" />
          Hiện pinyin
        </label>
      </div>

      {lesson.blocks.map((b, k) => (
        <Block key={k} block={b} pinyin={pinyin} say={say} />
      ))}

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">Bài tập</h2>
        <ZhGrammarQuiz questions={lesson.quiz} showPinyin={pinyin} onFinish={(percent) => percent >= 80 && progressActions.recordZhLesson("grammar", lesson.id, percent, LESSON_XP)} />
      </section>

      {next && (
        <div className="flex justify-end">
          <Link href={`/zh/grammar/${next.id}`} className="btn-ghost">
            Bài tiếp: {next.title} <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

function Sentence({ zh, pinyin, say, vi }: { zh: string; pinyin: boolean; say: Say; vi?: string }) {
  return (
    <div className="flex items-start gap-2">
      <button type="button" onClick={() => say(zh)} className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-primary" aria-label={`Nghe: ${sentencePinyin(zh)}`}>
        <Volume2 className="size-4" />
      </button>
      <div>
        <ZhText text={zh} pinyin={pinyin} className="text-xl" />
        {vi && <div className="text-sm text-muted">{vi}</div>}
      </div>
    </div>
  );
}

function Block({ block: b, pinyin, say }: { block: ZhBlock; pinyin: boolean; say: Say }) {
  switch (b.type) {
    case "summary":
      return <p className="card p-5 leading-relaxed">{b.text}</p>;
    case "tip":
      return (
        <p className="flex gap-2 rounded-2xl border border-primary/30 bg-primary-soft p-4 text-sm leading-relaxed">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" /> {b.text}
        </p>
      );
    case "formula":
      return (
        <section className="card divide-y divide-line">
          {b.title && <h2 className="p-4 font-bold">{b.title}</h2>}
          {b.rows.map((r) => (
            <div key={r.label} className="space-y-1 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">{r.label}</div>
              <div className="font-semibold text-primary">{r.pattern}</div>
              {r.example && <Sentence zh={r.example} pinyin={pinyin} say={say} />}
            </div>
          ))}
        </section>
      );
    case "usage":
      return (
        <section className="card space-y-3 p-5">
          <h2 className="font-bold">{b.title}</h2>
          {b.text && <p className="text-sm text-muted">{b.text}</p>}
          {b.examples.map((e) => (
            <Sentence key={e.zh} zh={e.zh} vi={e.vi} pinyin={pinyin} say={say} />
          ))}
        </section>
      );
    case "compare":
      return (
        <section className="card overflow-x-auto p-5">
          <h2 className="mb-3 font-bold">{b.title}</h2>
          <table className="w-full min-w-96 text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {b.headers.map((h) => (
                  <th key={h} className="p-2 font-semibold text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, k) => (
                <tr key={k} className="border-b border-line/60 last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} className="p-2 align-top">
                      {compactHan(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    case "mistakes":
      return (
        <section className="card space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <AlertTriangle className="size-4 text-warning" /> Lỗi người Việt hay mắc
          </h2>
          {b.items.map((m) => (
            <div key={m.wrong} className="space-y-1 rounded-xl bg-surface-2 p-3">
              <div className="flex items-center gap-2 text-danger">
                <XCircle className="size-4 shrink-0" /> <ZhText text={m.wrong} className="text-lg line-through decoration-1" />
              </div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="size-4 shrink-0" /> <ZhText text={m.right} pinyin={pinyin} className="text-lg" />
              </div>
              <p className="text-sm">{m.why}</p>
            </div>
          ))}
        </section>
      );
  }
}
