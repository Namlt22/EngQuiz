"use client";

/** 7 phần của một ngày trong khoá A1. Mỗi phần báo điểm (0–100) khi làm xong. Màn hình sạch: không chú thích. */
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BookOpen, CheckCircle2, Circle, ListChecks, Pause, Play, Volume2 } from "lucide-react";
import type { CourseDay } from "@/content/en-course";
import type { GameWord } from "@/core/en-vocab-games";
import { checkSentence, writingScore, type WritingIssue } from "@/core/en-writing-check";
import type { DayGrammar } from "@/lib/en-course";
import { EN_COURSE_PARTS, type EnCoursePart } from "@/lib/en-extra-store";
import { useSpeech } from "@/lib/speech";
import { useSpeechRecognition } from "@/lib/speech-recognition";
import { TheoryBlocks } from "@/components/theory/TheoryBlocks";
import { RecordButton } from "@/components/speaking/RecordButton";
import { VocabGamePlayer } from "@/components/en-games/VocabGamePlayer";
import { Practice, mcqToQuestion } from "./Practice";

export type PartDone = (score: number) => void;

export const PART_LABEL: Record<EnCoursePart | "check", string> = {
  words: "Từ vựng",
  grammar: "Ngữ pháp",
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
  check: "Tổng kết",
};

/* ---------------- 1. Từ vựng ---------------- */

export function WordsPart({ words, onDone }: { words: GameWord[]; onDone: PartDone }) {
  const { speak } = useSpeech();
  const [checking, setChecking] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (checking) {
    return (
      <VocabGamePlayer
        key={attempt}
        words={words}
        mode="choose"
        count={words.length}
        onExit={() => setChecking(false)}
        onFinish={(r) => {
          setChecking(false);
          onDone(Math.round((r.filter((x) => x.correct).length / r.length) * 100));
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {words.map((w) => (
          <li key={w.id} className="flex items-center gap-3 p-3">
            <button type="button" onClick={() => speak(w.word, 0.9)} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-primary" aria-label={`Nghe ${w.word}`}>
              <Volume2 className="size-4" />
            </button>
            <button type="button" onClick={() => speak(w.example)} className="min-w-0 flex-1 text-left" title={w.example}>
              <span lang="en" className="font-bold">
                {w.word}
              </span>{" "}
              <span className="font-mono text-sm text-muted">{w.ipa}</span>
              <span className="block text-sm text-muted">{w.vi}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          setAttempt((a) => a + 1);
          setChecking(true);
        }}
      >
        <ListChecks className="size-4" /> Kiểm tra nhanh
      </button>
    </div>
  );
}

/* ---------------- 2. Ngữ pháp ---------------- */

export function GrammarPart({ grammar, review, onDone }: { grammar: DayGrammar; review?: boolean; onDone: PartDone }) {
  return (
    <div className="space-y-6">
      {review ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {grammar.topics.map((tp) => (
            <li key={tp.slug}>
              <Link href={`/grammar/${tp.slug}`} className="card flex items-center gap-2 px-4 py-3 text-sm font-semibold transition hover:shadow-md">
                <BookOpen className="size-4 text-primary" /> {tp.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold">{grammar.topics[0].title}</h2>
          <TheoryBlocks blocks={grammar.blocks} />
          <Link href={`/grammar/${grammar.topics[0].slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            <BookOpen className="size-4" /> Lý thuyết đầy đủ
          </Link>
        </div>
      )}
      <Practice questions={grammar.questions} onChecked={onDone} />
    </div>
  );
}

/* ---------------- 3. Nghe ---------------- */

const MAX_PLAYS = 3;

export function ListeningPart({ day, onDone }: { day: CourseDay; onDone: PartDone }) {
  const { speak, stop } = useSpeech();
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [checked, setChecked] = useState(false);
  const run = useRef(0);
  const { lines, questions, title } = day.listening;
  const speakers = useMemo(() => [...new Set(lines.map(([s]) => s))], [lines]);
  const questionList = useMemo(() => questions.map((q, i) => mcqToQuestion(q, `${day.id}-l${i}`)), [questions, day.id]);

  function playFrom(i: number, id: number) {
    if (id !== run.current) return;
    if (i >= lines.length) return setPlaying(false);
    const [who, text] = lines[i];
    const speaker = (speakers.indexOf(who) % 2) as 0 | 1;
    // Đọc nối từng câu; mỗi nhân vật một giọng (giọng máy thì đổi cao độ).
    speak(text, rate, { speaker, pitch: speaker ? 1.25 : 1, onEnd: () => playFrom(i + 1, id), onError: () => setPlaying(false) });
  }

  function toggle() {
    if (playing) {
      run.current++;
      stop();
      return setPlaying(false);
    }
    if (plays >= MAX_PLAYS) return;
    setPlays((n) => n + 1);
    setPlaying(true);
    playFrom(0, ++run.current);
  }

  return (
    <div className="space-y-5">
      <div className="card flex flex-wrap items-center gap-4 p-5">
        <button
          type="button"
          onClick={toggle}
          disabled={!playing && plays >= MAX_PLAYS}
          className="grid size-16 place-items-center rounded-full bg-primary text-primary-fg shadow-lg shadow-primary/30 transition hover:scale-105 disabled:opacity-40"
          aria-label={playing ? "Dừng" : "Nghe"}
        >
          {playing ? <Pause className="size-7" /> : <Play className="ml-1 size-7" />}
        </button>
        <div className="flex-1">
          <p lang="en" className="text-lg font-bold">
            {title}
          </p>
          <p className="text-sm text-muted">
            {plays}/{MAX_PLAYS}
          </p>
        </div>
        <div role="radiogroup" aria-label="Tốc độ" className="flex gap-1 rounded-xl bg-surface-2 p-1 text-sm">
          {[
            [0.75, "Chậm"],
            [1, "Thường"],
          ].map(([r, label]) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={rate === r}
              onClick={() => setRate(r as number)}
              className={`rounded-lg px-3 py-1.5 font-semibold ${rate === r ? "bg-surface shadow-sm" : "text-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Practice
        questions={questionList}
        locked={plays === 0}
        onChecked={(s) => {
          setChecked(true);
          onDone(s);
        }}
      />
      {checked && (
        <dl className="card space-y-2 p-5">
          {lines.map(([s, text], i) => (
            <div key={i} className="flex gap-3">
              <dt className="w-24 shrink-0 font-semibold text-primary">{s}</dt>
              <dd lang="en">{text}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ---------------- 4. Đọc ---------------- */

export function ReadingPart({ day, onDone }: { day: CourseDay; onDone: PartDone }) {
  const { speak } = useSpeech();
  const questions = useMemo(() => day.reading.questions.map((q, i) => mcqToQuestion(q, `${day.id}-r${i}`)), [day]);
  return (
    <div className="space-y-5">
      <article className="card p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 lang="en" className="text-xl font-extrabold">
            {day.reading.title}
          </h2>
          <button type="button" onClick={() => speak(day.reading.text, 0.9)} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-primary" aria-label="Nghe bài đọc">
            <Volume2 className="size-4" />
          </button>
        </div>
        <p lang="en" className="mt-3 text-lg leading-relaxed">
          {day.reading.text}
        </p>
      </article>
      <Practice questions={questions} onChecked={onDone} />
    </div>
  );
}

/* ---------------- 5. Viết ---------------- */

const ISSUE_TEXT: Record<WritingIssue, string> = {
  empty: "Chưa viết",
  capital: "Viết hoa chữ đầu câu",
  punctuation: "Thiếu dấu . ? ! cuối câu",
  lowercaseI: "Viết hoa \"I\"",
  tooShort: "Viết cả câu",
};

export function WritingPart({ day, onDone }: { day: CourseDay; onDone: PartDone }) {
  const [answers, setAnswers] = useState<string[]>(() => day.writing.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState<Set<number>>(new Set());

  return (
    <div className="space-y-5">
      <ol className="space-y-4">
        {day.writing.map((w, i) => {
          const issues = checked ? checkSentence(answers[i]) : [];
          return (
            <li key={i} className="card space-y-3 p-4 md:p-5">
              <label className="block">
                <span lang="en" className="mb-2 block font-semibold">
                  {i + 1}. {w.prompt}
                </span>
                <textarea
                  lang="en"
                  className={`input min-h-20 resize-y ${checked ? (issues.length ? "border-danger" : "border-success") : ""}`}
                  value={answers[i]}
                  onChange={(e) => {
                    setAnswers((a) => a.map((x, j) => (j === i ? e.target.value : x)));
                    setChecked(false);
                  }}
                  spellCheck={false}
                />
              </label>
              {checked &&
                (issues.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {issues.map((k) => (
                      <li key={k} className="chip bg-danger-soft text-danger">
                        {ISSUE_TEXT[k]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <CheckCircle2 className="size-5 text-success" aria-label="Đúng" />
                ))}
              {shown.has(i) ? (
                <p lang="en" className="rounded-xl bg-surface-2 px-3 py-2 text-sm">
                  {w.example}
                </p>
              ) : (
                <button type="button" className="text-sm font-semibold text-primary hover:underline" onClick={() => setShown((s) => new Set(s).add(i))}>
                  Câu mẫu
                </button>
              )}
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        className="btn-primary"
        disabled={answers.every((a) => !a.trim())}
        onClick={() => {
          setChecked(true);
          onDone(writingScore(answers));
        }}
      >
        Kiểm tra
      </button>
    </div>
  );
}

/* ---------------- 6. Nói ---------------- */

export function SpeakingPart({ day, onDone }: { day: CourseDay; onDone: PartDone }) {
  const { speak } = useSpeech();
  const recognition = useSpeechRecognition();
  const [active, setActive] = useState<number | null>(null);
  const [said, setSaid] = useState<Record<number, string>>({});
  const [shown, setShown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const canRecognise = recognition.status === "ready";
  const isPractised = (i: number) => (said[i] ?? "").split(/\s+/).filter(Boolean).length >= 2;
  const practised = day.speaking.filter((_, i) => isPractised(i)).length;

  async function record(i: number) {
    if (recognition.listening && active === i) return recognition.stop();
    setActive(i);
    const take = await recognition.listen({ continuous: false });
    if (take?.transcript) setSaid((s) => ({ ...s, [i]: take.transcript }));
  }

  return (
    <div className="space-y-5">
      <ol className="space-y-4">
        {day.speaking.map((s, i) => {
          const here = active === i;
          return (
            <li key={i} className="card space-y-3 p-4 md:p-5">
              <div className="flex items-start gap-3">
                <button type="button" onClick={() => speak(s.prompt, 0.9)} className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-primary" aria-label={`Nghe: ${s.prompt}`}>
                  <Volume2 className="size-5" />
                </button>
                <p lang="en" className="flex-1 pt-2 font-semibold">
                  {i + 1}. {s.prompt}
                </p>
                {isPractised(i) ? <CheckCircle2 className="mt-2 size-5 text-success" /> : <Circle className="mt-2 size-5 text-line" />}
              </div>
              {canRecognise && (
                <div className="flex flex-wrap items-center gap-3">
                  <RecordButton
                    listening={here && recognition.listening}
                    busy={here && recognition.recognizing}
                    disabled={recognition.listening && !here}
                    idleLabel="Nói"
                    onClick={() => record(i)}
                  />
                  {(here && recognition.live) || said[i] ? (
                    <p lang="en" className="text-sm italic">
                      “{here && recognition.listening ? recognition.live : said[i]}”
                    </p>
                  ) : null}
                </div>
              )}
              {here && recognition.error && (
                <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm">
                  {recognition.error}
                </p>
              )}
              {shown.has(i) ? (
                <p lang="en" className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm">
                  {s.example}
                  <button type="button" onClick={() => speak(s.example, 0.9)} className="grid size-6 shrink-0 place-items-center rounded-full bg-surface text-primary" aria-label="Nghe câu mẫu">
                    <Volume2 className="size-3.5" />
                  </button>
                </p>
              ) : (
                <button type="button" className="text-sm font-semibold text-primary hover:underline" onClick={() => setShown((x) => new Set(x).add(i))}>
                  Câu mẫu
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {/* Phần tự luyện: luôn cho đánh dấu xong. Điểm = số câu nhận dạng được; máy không nhận dạng được thì tính đủ. */}
      <button
        type="button"
        className="btn-primary"
        disabled={finished || recognition.listening}
        onClick={() => {
          setFinished(true);
          onDone(canRecognise ? Math.round((practised / day.speaking.length) * 100) : 100);
        }}
      >
        <CheckCircle2 className="size-4" /> Đã luyện {day.speaking.length} câu
      </button>
    </div>
  );
}

/* ---------------- 7. Tổng kết ---------------- */

export function CheckPart({ scores, onGo }: { scores: Partial<Record<EnCoursePart, number>>; onGo: (part: EnCoursePart) => void }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {EN_COURSE_PARTS.map((k) => {
        const s = scores[k];
        return (
          <li key={k}>
            <button type="button" onClick={() => onGo(k)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2">
              {s !== undefined ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-line" />}
              <span className="flex-1 font-semibold">{PART_LABEL[k]}</span>
              {s !== undefined && <span className="text-sm font-semibold text-success">{s}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
