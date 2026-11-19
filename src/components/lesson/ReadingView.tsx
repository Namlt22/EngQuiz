"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Languages, Pause, Play } from "lucide-react";
import { READINGS } from "@/content/readings";
import type { ReadingPassage } from "@/content/types";
import { progressActions } from "@/lib/progress";
import { SPEECH_ERROR_NOTICE, useSpeech } from "@/lib/speech";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { LessonQuiz } from "./LessonQuiz";
import { SaveWordButton } from "@/components/notebook/SaveWordButton";
import { SelectionSave } from "@/components/notebook/SelectionSave";
import { sentenceWith } from "@/lib/notebook-lookup";

const READ_RATE = 0.9;

export function ReadingView({ passage }: { passage: ReadingPassage }) {
  // Bài kế tiếp cùng cấp (hết cấp thì bài đầu của cấp sau).
  const nextReading = READINGS[READINGS.findIndex((r) => r.id === passage.id) + 1];
  const [showVi, setShowVi] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { speak, stop, supported } = useSpeech();
  /** Mỗi lần bấm Nghe / Dừng tạo lượt mới; lượt cũ đọc xong sẽ không nối tiếp đoạn sau. */
  const runRef = useRef(0);

  function playFrom(i: number, run: number) {
    if (run !== runRef.current) return;
    if (i >= passage.paragraphs.length) {
      setPlaying(null);
      return;
    }
    setPlaying(i);
    setNotice(null);
    speak(passage.paragraphs[i].en, READ_RATE, {
      onEnd: () => playFrom(i + 1, run),
      onError: () => {
        if (run !== runRef.current) return;
        setPlaying(null);
        setNotice(SPEECH_ERROR_NOTICE);
      },
    });
  }

  function toggleAll() {
    runRef.current++;
    if (playing !== null) {
      stop();
      setPlaying(null);
      return;
    }
    playFrom(0, runRef.current);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/reading" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Tất cả bài đọc
      </Link>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={passage.level} />
          <span className="chip bg-surface-2 text-muted">{passage.theme}</span>
        </div>
        <h1 className="text-2xl font-extrabold md:text-3xl">{passage.title}</h1>
        <p className="text-muted">{passage.description}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {supported && (
          <button type="button" onClick={toggleAll} className="btn-primary">
            {playing !== null ? <Pause className="size-4" /> : <Play className="size-4" />}
            {playing !== null ? "Dừng đọc" : "Nghe cả bài"}
          </button>
        )}
        <button type="button" onClick={() => setShowVi((v) => !v)} aria-pressed={showVi} className="btn-ghost">
          <Languages className="size-4" /> {showVi ? "Ẩn bản dịch" : "Hiện bản dịch"}
        </button>
      </div>
      {notice && (
        <p role="alert" className="text-sm text-danger">
          {notice}
        </p>
      )}

      <SelectionSave course="en" source={`reading:${passage.id}`} glossary={passage.glossary}>
      <article className="card space-y-4 p-5 md:p-7">
        {passage.paragraphs.map((p, i) => (
          <div key={i} className={`flex gap-3 rounded-xl p-2 transition ${playing === i ? "bg-primary-soft" : ""}`}>
            <SpeakButton text={p.en} rate={READ_RATE} />
            <div className="space-y-1">
              <p className="text-[1.05rem] leading-relaxed">{p.en}</p>
              {showVi && <p className="text-sm leading-relaxed text-muted">{p.vi}</p>}
            </div>
          </div>
        ))}
      </article>
      </SelectionSave>

      <section className="card space-y-3 p-5">
        <h2 className="text-lg font-bold">Từ vựng trong bài</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {passage.glossary.map((g) => (
            <li key={g.word} className="flex items-center gap-2 rounded-xl bg-surface-2 p-2.5 text-sm">
              <SpeakButton text={g.word} rate={0.8} />
              <span className="flex-1">
                <b>{g.word}</b> — {g.meaning}
              </span>
              <SaveWordButton
                entry={{ term: g.word, meaning: g.meaning, example: sentenceWith(passage.paragraphs.map((x) => x.en).join(" "), g.word.split(" ")[0], "en"), source: `reading:${passage.id}` }}
              />
            </li>
          ))}
        </ul>
      </section>

      <LessonQuiz
        title="Câu hỏi đọc hiểu"
        questions={passage.questions}
        onFinish={({ percent, correct, total }) => progressActions.recordReading(passage.id, percent, correct, total)}
        nextLink={nextReading ? { label: nextReading.title, href: `/reading/${nextReading.id}` } : undefined}
      />
    </div>
  );
}
