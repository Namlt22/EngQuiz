"use client";

/**
 * Trang một bài hội thoại / bài đọc tiếng Trung: nghe từng câu hoặc cả bài, bật/tắt pinyin và bản dịch,
 * chạm vào từ để xem nghĩa; cuối bài có câu hỏi đọc hiểu — đạt thì app tự ghi nhận.
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Headphones, Pause, Play, Volume2 } from "lucide-react";
import type { ZhTextLesson } from "@/content/zh/texts";
import { plainText, tokenize, type ZhToken } from "@/core/zh-sentence";
import { progressActions } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { WordGloss } from "./WordGloss";
import { ZhTextQuiz } from "./ZhTextQuiz";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

const RATE = 0.8;
/** Cao độ giọng đọc của từng vai, để nghe phân biệt người nói. */
const PITCH: Record<string, number> = { A: 1, B: 1.25, C: 0.85 };

export function ZhTextView({ lesson }: { lesson: ZhTextLesson }) {
  const speech = useSpeech({ lang: "zh" });
  const [pinyin, setPinyin] = useState(true);
  const [translate, setTranslate] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [gloss, setGloss] = useState<ZhToken | null>(null);
  const isDialogue = lesson.kind === "dialogue";
  const back = isDialogue ? { href: "/zh/dialogues", label: "Hội thoại" } : { href: "/zh/reading", label: "Bài đọc" };

  function speakLine(i: number, chain: boolean) {
    const line = lesson.lines[i];
    setPlaying(i);
    speech.speak(plainText(line.zh), RATE, {
      pitch: PITCH[line.speaker ?? "A"] ?? 1,
      onEnd: () => {
        if (chain && i + 1 < lesson.lines.length) speakLine(i + 1, true);
        else setPlaying(null);
      },
      onError: () => setPlaying(null),
    });
  }

  function toggleAll() {
    if (playing !== null) {
      speech.stop();
      setPlaying(null);
    } else speakLine(0, true);
  }

  function finish(percent: number, correct: number, total: number) {
    if (isDialogue) progressActions.recordDialogue(lesson.id, percent, correct, total);
    else progressActions.recordReading(lesson.id, percent, correct, total);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24">
      <Link href={back.href} className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> {back.label} HSK {lesson.level}
      </Link>
      <header className="space-y-1">
        <span className="chip bg-surface-2">{isDialogue ? "Hội thoại" : "Bài đọc"} · HSK {lesson.level}</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">{lesson.title}</h1>
        <p className="text-2xl" lang="zh-Hans">
          {plainText(lesson.zhTitle)}
        </p>
        <p className="text-muted">{lesson.scene}</p>
      </header>

      <ZhVoiceNotice speech={speech} />

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggleAll} className="btn-primary">
          {playing !== null ? <Pause className="size-4" /> : <Play className="size-4" />} {playing !== null ? "Dừng" : "Nghe cả bài"}
        </button>
        <label className="ml-auto flex items-center gap-1.5 text-sm font-semibold">
          <input type="checkbox" checked={pinyin} onChange={(e) => setPinyin(e.target.checked)} className="size-4" /> Pinyin
        </label>
        <label className="flex items-center gap-1.5 text-sm font-semibold">
          <input type="checkbox" checked={translate} onChange={(e) => setTranslate(e.target.checked)} className="size-4" /> Bản dịch
        </label>
      </div>
      <p className="text-xs text-muted">Chạm vào một từ để xem nghĩa.</p>

      <section className={isDialogue ? "space-y-3" : "card space-y-3 p-5"}>
        {lesson.lines.map((line, i) => {
          const right = isDialogue && line.speaker === "B";
          return (
            <div key={i} className={isDialogue ? `flex ${right ? "justify-end" : "justify-start"}` : ""}>
              <div className={isDialogue ? `max-w-[85%] rounded-2xl p-3 ${right ? "bg-primary-soft" : "bg-surface-2"} ${playing === i ? "ring-2 ring-primary" : ""}` : `rounded-xl p-1 ${playing === i ? "bg-primary-soft" : ""}`}>
                {isDialogue && <div className="mb-1 text-xs font-bold text-muted">{lesson.speakers?.[line.speaker ?? ""]}</div>}
                <div className="flex items-start gap-2">
                  <button type="button" onClick={() => speakLine(i, false)} className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-surface text-primary" aria-label="Nghe câu này">
                    <Volume2 className="size-3.5" />
                  </button>
                  <div className="min-w-0">
                    <ClickableLine text={line.zh} pinyin={pinyin} selected={gloss?.text} onWord={setGloss} />
                    {translate && <p className="mt-1 text-sm text-muted">{line.vi}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">Câu hỏi đọc hiểu</h2>
        <ZhTextQuiz questions={lesson.questions} onFinish={finish} />
      </section>

      <Link href={`/zh/dictation/${lesson.id}`} className="card flex items-center gap-3 p-4 transition hover:shadow-md">
        <Headphones className="size-5 text-primary" />
        <span className="flex-1 font-semibold">Nghe chép bài này</span>
        <span className="text-sm text-muted">{lesson.lines.length} câu</span>
      </Link>

      {gloss && <WordGloss token={gloss} onSpeak={() => speech.speak(gloss.text, RATE)} onClose={() => setGloss(null)} />}
    </div>
  );
}

/** Câu tiếng Trung, mỗi từ là một nút bấm để xem nghĩa. */
function ClickableLine({ text, pinyin, selected, onWord }: { text: string; pinyin: boolean; selected?: string; onWord: (t: ZhToken) => void }) {
  return (
    <span lang="zh-Hans" className="inline-flex flex-wrap items-end text-xl leading-relaxed">
      {tokenize(text).map((t, i) =>
        t.kind === "punct" ? (
          <span key={i}>{t.text}</span>
        ) : (
          <button key={i} type="button" onClick={() => onWord(t)} className={`rounded px-0.5 transition hover:bg-primary-soft ${selected === t.text ? "bg-primary-soft text-primary" : ""}`}>
            {pinyin ? (
              <ruby>
                {t.text}
                <rt className="text-[0.55em] text-muted">{t.pinyin}</rt>
              </ruby>
            ) : (
              t.text
            )}
          </button>
        ),
      )}
    </span>
  );
}
