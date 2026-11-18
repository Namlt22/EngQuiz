"use client";

/**
 * Bài pinyin 3 bước — Nghe & quan sát → Đọc theo → Luyện tai. Xong cả 3 thì app tự ghi nhận (không tự tích).
 * Logic chấm điểm và dựng câu hỏi nằm ở src/core/pinyin-lesson.ts.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Ear, PartyPopper, RotateCcw, Snail, Volume2, XCircle } from "lucide-react";
import { PINYIN_GROUP_INFO, PINYIN_LESSONS, type PinyinItem, type PinyinLesson } from "@/content/zh/pinyin-lessons";
import { charReadings } from "@/content/zh/vocab";
import { applySandhi, toneOf } from "@/core/pinyin";
import { PASS_PERCENT, buildDrill, drillPercent, itemDone, scoreSpoken, type Attempt, type DrillRound } from "@/core/pinyin-lesson";
import { progressActions } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { useSpeechRecognition } from "@/lib/speech-recognition";
import { RecordButton } from "@/components/speaking/RecordButton";
import { scoreTone } from "@/components/speaking/ScoreBadge";
import { ToneCurve } from "./ToneCurve";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

type Step = 1 | 2 | 3 | "done";
type Say = (hanzi: string, rate?: number) => void;
const STEPS = ["Nghe & quan sát", "Đọc theo", "Luyện tai"] as const;
const LESSON_XP = 10;
const NORMAL_RATE = 0.8;
const SLOW_RATE = 0.5;

export function PinyinLessonView({ lesson }: { lesson: PinyinLesson }) {
  const speech = useSpeech({ lang: "zh" });
  const say: Say = (hanzi, rate = NORMAL_RATE) => speech.speak(hanzi, rate);
  const [step, setStep] = useState<Step>(1);
  const [score, setScore] = useState(0);
  const info = PINYIN_GROUP_INFO[lesson.group];

  function finish(percent: number) {
    setScore(percent);
    progressActions.recordZhLesson("pinyin", lesson.id, percent, LESSON_XP);
    setStep("done");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/zh/pinyin" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Pinyin & thanh điệu
      </Link>
      <header>
        <span className={`chip ${info.chip}`}>{info.label}</span>
        <h1 className="mt-1 text-2xl font-extrabold">{lesson.title}</h1>
        <p className="text-muted">{lesson.goal}</p>
      </header>
      <ZhVoiceNotice speech={speech} />
      <Stepper step={step} />
      {step === 1 && <ObserveStep lesson={lesson} say={say} onNext={() => setStep(2)} />}
      {step === 2 && <RepeatStep lesson={lesson} say={say} onNext={() => setStep(3)} />}
      {step === 3 && <DrillStep lesson={lesson} say={say} onPass={finish} />}
      {step === "done" && <DoneCard lesson={lesson} percent={score} />}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const current = step === "done" ? STEPS.length + 1 : step;
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Các bước của bài">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="space-y-1.5">
            <div className={`h-1.5 rounded-full ${done ? "bg-success" : active ? "bg-primary" : "bg-line"}`} />
            <div className={`flex items-center gap-1 text-xs font-semibold ${active ? "text-primary" : done ? "text-success" : "text-muted"}`}>
              {done ? <Check className="size-3.5" /> : <span>{n}.</span>} {label}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Pinyin của mục, kèm dòng "đọc là" khi biến điệu làm cách đọc khác cách viết. */
function ItemPinyin({ item }: { item: PinyinItem }) {
  const spoken = applySandhi(item.hanzi, item.pinyin);
  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span className="text-lg font-bold">{item.pinyin}</span>
      <span className="text-lg" lang="zh-Hans">
        {item.hanzi}
      </span>
      {spoken !== item.pinyin && <span className="text-sm font-semibold text-primary">đọc là {spoken}</span>}
    </span>
  );
}

/* ---------------- Bước 1: nghe, đọc giải thích ---------------- */

function ObserveStep({ lesson, say, onNext }: { lesson: PinyinLesson; say: Say; onNext: () => void }) {
  const [heard, setHeard] = useState<Set<string>>(new Set());
  const all = lesson.items.every((i) => heard.has(i.hanzi));
  const play = (item: PinyinItem) => {
    say(item.hanzi);
    setHeard((h) => new Set(h).add(item.hanzi));
  };

  return (
    <section className="card space-y-4 p-5 md:p-6">
      <ul className="space-y-2">
        {lesson.points.map((p) => (
          <li key={p.label} className="rounded-2xl bg-surface-2 p-3">
            <div className="font-bold">{p.label}</div>
            <p className="text-sm leading-relaxed">{p.how}</p>
            {p.viLike && <p className="mt-1 text-sm text-muted">Gần giống: {p.viLike}</p>}
          </li>
        ))}
      </ul>
      {lesson.group === "tone" && lesson.id === "tones" && (
        <div className="flex justify-around text-primary" aria-hidden="true">
          {([1, 2, 3, 4] as const).map((t) => (
            <ToneCurve key={t} tone={t} />
          ))}
        </div>
      )}
      {lesson.tip && (
        <p className="flex gap-2 rounded-2xl border border-warning/30 bg-warning-soft p-3 text-sm leading-relaxed">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /> {lesson.tip}
        </p>
      )}
      <div>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Bấm nghe từng âm mẫu</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {lesson.items.map((item) => (
            <button
              key={item.hanzi}
              type="button"
              onClick={() => play(item)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${heard.has(item.hanzi) ? "border-success/40 bg-success/5" : "border-line hover:border-primary"}`}
            >
              <Volume2 className="size-5 shrink-0 text-primary" />
              <span className="min-w-0">
                <ItemPinyin item={item} />
                <span className="block text-xs text-muted">{item.vi}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">
          Đã nghe {lesson.items.filter((i) => heard.has(i.hanzi)).length}/{lesson.items.length}
        </span>
        <button type="button" onClick={onNext} disabled={!all} className="btn-primary">
          Tiếp: đọc theo <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

/* ---------------- Bước 2: đọc theo (máy nghe tiếng phổ thông) ---------------- */

function RepeatStep({ lesson, say, onNext }: { lesson: PinyinLesson; say: Say; onNext: () => void }) {
  const recognition = useSpeechRecognition({ lang: "zh-CN" });
  // Micro bị chặn / nhận dạng lỗi: chuyển sang chế độ "nghe và đọc theo" để người học không bị kẹt ở bước này.
  const [micFailed, setMicFailed] = useState(false);
  const canRecord = recognition.status === "ready" && !micFailed;
  const readings = useMemo(() => charReadings(), []);
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});
  const [heard, setHeard] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isDone = (item: PinyinItem) => (canRecord ? itemDone(attempts[item.hanzi]) : heard.has(item.hanzi));
  const doneCount = lesson.items.filter(isDone).length;

  async function record(item: PinyinItem) {
    if (recognition.listening) return recognition.stop();
    setActive(item.hanzi);
    setNotice(null);
    const result = await recognition.listen({ continuous: false });
    if (!result) {
      setAttempts((a) => ({ ...a, [item.hanzi]: { best: a[item.hanzi]?.best ?? 0, tries: (a[item.hanzi]?.tries ?? 0) + 1 } }));
      return setNotice("Chưa nghe được gì. Bấm nút, chờ chữ “Đang nghe…” rồi đọc to.");
    }
    const s = scoreSpoken(item, result.alternatives, readings);
    setAttempts((a) => ({ ...a, [item.hanzi]: { best: Math.max(a[item.hanzi]?.best ?? 0, s), tries: (a[item.hanzi]?.tries ?? 0) + 1 } }));
  }

  return (
    <section className="card space-y-4 p-5 md:p-6">
      <p className="text-sm text-muted">
        {canRecord
          ? "Nghe mẫu rồi bấm micro đọc to."
          : "Nghe từng âm và đọc to theo (cần Chrome hoặc Edge để máy chấm)."}
      </p>
      <ul className="space-y-2">
        {lesson.items.map((item) => {
          const a = attempts[item.hanzi];
          const done = isDone(item);
          return (
            <li key={item.hanzi} className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 ${done ? "border-success/40 bg-success/5" : "border-line"}`}>
              <button
                type="button"
                onClick={() => {
                  say(item.hanzi);
                  setHeard((h) => new Set(h).add(item.hanzi));
                }}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-fg"
                aria-label={`Nghe ${item.pinyin}`}
              >
                <Volume2 className="size-5" />
              </button>
              <button type="button" onClick={() => say(item.hanzi, SLOW_RATE)} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted hover:text-fg" aria-label={`Nghe chậm ${item.pinyin}`}>
                <Snail className="size-4" />
              </button>
              <div className="min-w-0 flex-1">
                <ItemPinyin item={item} />
                <div className="text-xs text-muted">
                  {item.vi}
                  {toneOf(item.pinyin) !== 5 && [...item.hanzi].length === 1 ? ` · thanh ${toneOf(item.pinyin)}` : ""}
                </div>
              </div>
              {a && <span className={`rounded-lg px-2 py-1 text-sm font-bold ${scoreTone(a.best)}`}>{a.best}%</span>}
              {done && <CheckCircle2 className="size-5 text-success" aria-label="Xong" />}
              {canRecord && (
                <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
                  <RecordButton
                    listening={recognition.listening && active === item.hanzi}
                    disabled={recognition.listening && active !== item.hanzi}
                    idleLabel={a ? "Đọc lại" : "Đọc"}
                    listeningLabel="Dừng"
                    onClick={() => record(item)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {recognition.listening && (
        <p className="text-sm text-muted">
          Đang nghe… <span lang="zh-Hans">{recognition.live}</span>
        </p>
      )}
      {(notice || recognition.error) && <p className="text-sm text-danger">{notice ?? recognition.error}</p>}
      {canRecord && recognition.error && (
        <button type="button" onClick={() => setMicFailed(true)} className="btn-ghost text-sm">
          Không dùng được micro? Chuyển sang chỉ nghe và đọc theo
        </button>
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">
          {doneCount}/{lesson.items.length} âm
        </span>
        <button type="button" onClick={onNext} disabled={doneCount < lesson.items.length} className="btn-primary">
          Tiếp: luyện tai <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

/* ---------------- Bước 3: luyện tai / trắc nghiệm ---------------- */

function DrillStep({ lesson, say, onPass }: { lesson: PinyinLesson; say: Say; onPass: (percent: number) => void }) {
  const [rounds, setRounds] = useState<DrillRound[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  function start() {
    const next = buildDrill(lesson);
    setRounds(next);
    setI(0);
    setPicked(null);
    setCorrect(0);
    if (next[0].say) say(next[0].say);
  }

  if (!rounds) {
    return (
      <section className="card space-y-4 p-6 text-center">
        <Ear className="mx-auto size-10 text-primary" />
        <p>Nghe và chọn đáp án đúng. Đúng từ {PASS_PERCENT}% là hoàn thành bài.</p>
        <button type="button" onClick={start} className="btn-primary mx-auto">
          Bắt đầu
        </button>
      </section>
    );
  }

  if (i >= rounds.length) {
    const percent = drillPercent(correct, rounds.length);
    const passed = percent >= PASS_PERCENT;
    return (
      <section className="card space-y-4 p-6 text-center" role="status">
        <p className="text-3xl font-extrabold">{percent}%</p>
        <p className="text-muted">
          Đúng {correct}/{rounds.length}. {passed ? "Bạn đã nắm được bài này!" : `Cần từ ${PASS_PERCENT}% — nghe lại âm mẫu ở bước 1 rồi thử lại.`}
        </p>
        <button type="button" onClick={passed ? () => onPass(percent) : start} className="btn-primary mx-auto">
          {passed ? (
            <>
              Hoàn thành bài <ArrowRight className="size-4" />
            </>
          ) : (
            <>
              <RotateCcw className="size-4" /> Làm lại
            </>
          )}
        </button>
      </section>
    );
  }

  const round = rounds[i];
  function choose(k: number) {
    if (picked !== null) return;
    setPicked(k);
    if (k === round.answer) setCorrect((n) => n + 1);
  }
  function next() {
    const n = i + 1;
    setI(n);
    setPicked(null);
    const r = rounds?.[n];
    if (r?.say) say(r.say);
  }

  return (
    <section className="card space-y-5 p-5 md:p-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Câu {i + 1}/{rounds.length}
        </span>
        <span>Đúng {correct}</span>
      </div>
      <div className="space-y-2 text-center">
        {round.say && (
          <button type="button" onClick={() => say(round.say!)} className="btn-ghost">
            <Volume2 className="size-4" /> Nghe lại
          </button>
        )}
        <p className="font-semibold">{round.prompt}</p>
      </div>
      <div className={`grid gap-3 ${round.options.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
        {round.options.map((o, k) => {
          const state = picked === null ? "" : k === round.answer ? "border-success bg-success/10" : k === picked ? "border-danger bg-danger-soft" : "opacity-60";
          return (
            <button key={o} type="button" onClick={() => choose(k)} disabled={picked !== null} className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 border-line p-4 transition ${state}`}>
              <span className="text-xl font-bold">{o}</span>
              {round.notes?.[k] && <span className="text-xs text-muted">{round.notes[k]}</span>}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="space-y-3" role="status">
          <p className={`flex items-start gap-1.5 font-semibold ${picked === round.answer ? "text-success" : "text-danger"}`}>
            {picked === round.answer ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <XCircle className="mt-0.5 size-5 shrink-0" />}
            <span>
              {picked === round.answer ? "Chính xác! " : "Chưa đúng. "}
              <span className="font-normal text-fg">{round.explain}</span>
            </span>
          </p>
          <div className="flex justify-end">
            <button type="button" onClick={next} className="btn-primary">
              Tiếp <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- Hoàn thành ---------------- */

function DoneCard({ lesson, percent }: { lesson: PinyinLesson; percent: number }) {
  const idx = PINYIN_LESSONS.findIndex((l) => l.id === lesson.id);
  const next = PINYIN_LESSONS[idx + 1];
  return (
    <section className="card animate-pop-in space-y-4 p-6 text-center" role="status">
      <PartyPopper className="mx-auto size-10 text-primary" />
      <h2 className="text-xl font-extrabold">Hoàn thành: {lesson.title}</h2>
      <p className="text-muted">Luyện tai đúng {percent}%. Bài đã được ghi nhận. +{LESSON_XP} XP (lần đầu)</p>
      <div className="flex flex-wrap justify-center gap-2">
        {next && (
          <Link href={`/zh/pinyin/${next.id}`} className="btn-primary">
            Bài tiếp: {next.title} <ArrowRight className="size-4" />
          </Link>
        )}
        <Link href="/zh/pinyin" className="btn-ghost">
          Danh sách bài
        </Link>
      </div>
    </section>
  );
}
