"use client";

/**
 * Trang một chữ Hán (/zh/hanzi/<mã Unicode>): tập viết, cách đọc, từ HSK chứa chữ, chuyển sang chữ trước/sau cùng cấp.
 * Tự viết đúng (sai ≤ MAX_MISTAKES_TO_PASS lần) thì app ghi nhận chữ đã viết được.
 */
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Volume2 } from "lucide-react";
import { charCode, charsAtLevel, type HanziChar } from "@/content/zh/hanzi-chars";
import { applySandhi } from "@/core/pinyin";
import { vocabVi } from "@/content/zh/vocab-vi";
import { progressActions, useProgress } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { StrokeWriter } from "./StrokeWriter";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

const WRITE_XP = 2;
const MAX_WORDS = 8;

export function HanziCharView({ info }: { info: HanziChar }) {
  const speech = useSpeech({ lang: "zh" });
  const written = (useProgress().hanzi ?? "").includes(info.char);
  const sameLevel = charsAtLevel(info.level);
  const idx = sameLevel.findIndex((c) => c.char === info.char);
  const prev = sameLevel[idx - 1];
  const next = sameLevel[idx + 1];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/zh/hanzi?level=${info.level}#tap-viet`} className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Chữ Hán HSK {info.level}
      </Link>

      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <section className="card p-4">
          <StrokeWriter char={info.char} onWritten={(r) => r.passed && progressActions.markHanziWritten(info.char, WRITE_XP)} />
        </section>

        <section className="space-y-4">
          <header className="flex items-center gap-3">
            <span className="text-6xl" lang="zh-Hans">
              {info.char}
            </span>
            <div>
              <span className="chip bg-surface-2">HSK {info.level}</span>
              {written && (
                <span className="chip ml-1 bg-success/10 text-success">
                  <CheckCircle2 className="size-3.5" /> Đã viết được
                </span>
              )}
              <div className="mt-1 flex flex-wrap gap-2">
                {info.readings.map((r) => (
                  <button key={r} type="button" onClick={() => speech.speak(info.char, 0.8)} className="inline-flex items-center gap-1 rounded-lg bg-primary-soft px-2 py-1 font-bold text-primary">
                    <Volume2 className="size-4" /> {r}
                  </button>
                ))}
              </div>
              {info.readings.length > 1 && <p className="mt-1 text-xs text-muted">Chữ đa âm: cách đọc tuỳ theo từ (xem bên dưới).</p>}
            </div>
          </header>

          <ZhVoiceNotice speech={speech} />

          <div>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Từ HSK có chữ này</h2>
            <ul className="space-y-1.5">
              {info.words.slice(0, MAX_WORDS).map((w) => {
                const spoken = applySandhi(w.hanzi, w.pinyin);
                return (
                  <li key={w.hanzi}>
                    <button type="button" onClick={() => speech.speak(w.hanzi, 0.8)} className="flex w-full items-baseline gap-2 rounded-xl border border-line p-2.5 text-left transition hover:border-primary">
                      <Volume2 className="size-4 shrink-0 self-center text-primary" />
                      <span className="text-lg" lang="zh-Hans">
                        {w.hanzi}
                      </span>
                      <span className="font-semibold">{w.pinyin}</span>
                      {spoken !== w.pinyin && <span className="text-xs text-primary">đọc là {spoken}</span>}
                      {vocabVi(w.hanzi) && <span className="min-w-0 truncate text-sm text-muted">{vocabVi(w.hanzi)![1]}</span>}
                      <span className="ml-auto text-xs text-muted">HSK {w.level}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {info.words.length > MAX_WORDS && <p className="mt-1 text-xs text-muted">và {info.words.length - MAX_WORDS} từ khác.</p>}
          </div>
        </section>
      </div>

      <nav className="flex justify-between gap-2" aria-label="Chữ trước, chữ sau">
        {prev ? (
          <Link href={`/zh/hanzi/${charCode(prev.char)}`} className="btn-ghost">
            <ArrowLeft className="size-4" /> <span lang="zh-Hans">{prev.char}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/zh/hanzi/${charCode(next.char)}`} className="btn-primary">
            <span lang="zh-Hans">{next.char}</span> <ArrowRight className="size-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
