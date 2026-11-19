"use client";

/**
 * Trang /zh/hanzi: 8 nét cơ bản, 7 quy tắc thứ tự nét, bộ thủ thường gặp, và bài kiểm tra bộ thủ.
 * Qua bài kiểm tra thì app tự ghi nhận ("hanzi-radicals" trong tiến độ khoá tiếng Trung).
 * Cuối trang là lưới chữ theo cấp HSK để mở trang tập viết từng chữ.
 */
import { Suspense, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { BASIC_STROKES, COMMON_RADICALS, STROKE_RULES, type Radical } from "@/content/zh/hanzi-basics";
import { RADICAL_PASS_PERCENT, buildRadicalQuiz, type RadicalRound } from "@/core/hanzi-quiz";
import { drillPercent } from "@/core/pinyin-lesson";
import { progressActions, useProgress } from "@/lib/progress";
import { HanziGrid } from "./HanziGrid";

const QUIZ_XP = 10;
const QUIZ_KEY = "radicals";

export function HanziBasics() {
  const progress = useProgress();
  const passed = !!progress.topics[`hanzi-${QUIZ_KEY}`]?.theoryRead;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <span className="chip bg-surface-2">Chặng 0 · Nhập môn</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">Chữ Hán: nét, thứ tự nét, bộ thủ</h1>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">8 nét cơ bản</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BASIC_STROKES.map((s) => (
            <div key={s.zh} className="card flex gap-3 p-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-surface-2 text-3xl" lang="zh-Hans">
                {s.shape}
              </span>
              <div className="min-w-0">
                <div className="font-bold">
                  {s.vi}{" "}
                  <span className="text-sm font-normal text-muted">
                    <span lang="zh-Hans">{s.zh}</span> {s.pinyin}
                  </span>
                </div>
                <p className="text-sm">{s.how}</p>
                <p className="text-sm text-muted">
                  Ví dụ: <span lang="zh-Hans">{s.examples}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">7 quy tắc thứ tự nét</h2>
        <ol className="grid gap-3 md:grid-cols-2">
          {STROKE_RULES.map((r, i) => (
            <li key={r.zh} className="card flex gap-3 p-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl text-primary" lang="zh-Hans">
                {r.example}
              </span>
              <div className="min-w-0">
                <div className="font-bold">
                  {i + 1}. {r.rule}{" "}
                  <span className="text-sm font-normal text-muted" lang="zh-Hans">
                    {r.zh}
                  </span>
                </div>
                <p className="text-sm">{r.explain}</p>
                <p className="text-sm text-muted">
                  <span lang="zh-Hans">{r.example}</span>: <span lang="zh-Hans">{r.order}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">{COMMON_RADICALS.length} bộ thủ thường gặp</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {COMMON_RADICALS.map((r) => (
            <RadicalCard key={r.form} r={r} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          Kiểm tra bộ thủ {passed && <CheckCircle2 className="size-5 text-success" aria-label="Đã qua" />}
        </h2>
        <RadicalQuiz />
      </section>

      <section id="tap-viet" className="scroll-mt-24 space-y-3">
        <h2 className="text-lg font-extrabold">Tập viết theo cấp</h2>
        <Suspense fallback={null}>
          <HanziGrid />
        </Suspense>
      </section>
    </div>
  );
}

function RadicalCard({ r }: { r: Radical }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface-2 text-2xl" lang="zh-Hans">
        {r.form}
      </span>
      <div className="min-w-0 text-sm">
        <div className="font-bold">
          {r.name}
          {r.full && (
            <span className="font-normal text-muted">
              {" "}
              (<span lang="zh-Hans">{r.full}</span>)
            </span>
          )}
        </div>
        <div className="text-muted">{r.meaning}</div>
        <div className="text-base" lang="zh-Hans">
          {r.examples}
        </div>
      </div>
    </div>
  );
}

function RadicalQuiz() {
  const [rounds, setRounds] = useState<RadicalRound[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const start = () => {
    setRounds(buildRadicalQuiz(COMMON_RADICALS));
    setI(0);
    setPicked(null);
    setCorrect(0);
  };

  if (!rounds) {
    return (
      <div className="card space-y-3 p-5 text-center">
        <p>Nhìn bộ thủ, chọn nghĩa đúng. Đúng từ {RADICAL_PASS_PERCENT}% là qua.</p>
        <button type="button" onClick={start} className="btn-primary mx-auto">
          Bắt đầu
        </button>
      </div>
    );
  }

  if (i >= rounds.length) {
    const percent = drillPercent(correct, rounds.length);
    const ok = percent >= RADICAL_PASS_PERCENT;
    return (
      <div className="card space-y-3 p-5 text-center" role="status">
        <p className="text-3xl font-extrabold">{percent}%</p>
        <p className="text-muted">
          Đúng {correct}/{rounds.length}. {ok ? `Đã ghi nhận. +${QUIZ_XP} XP (lần đầu)` : `Cần từ ${RADICAL_PASS_PERCENT}% — xem lại bảng bộ thủ rồi thử lại.`}
        </p>
        <button type="button" onClick={start} className="btn-ghost mx-auto">
          <RotateCcw className="size-4" /> Làm bài khác
        </button>
      </div>
    );
  }

  const round = rounds[i];
  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (k === round.answer) setCorrect((n) => n + 1);
  };
  const next = () => {
    const n = i + 1;
    if (n >= rounds.length) {
      const percent = drillPercent(correct, rounds.length);
      if (percent >= RADICAL_PASS_PERCENT) progressActions.recordZhLesson("hanzi", QUIZ_KEY, percent, QUIZ_XP);
    }
    setI(n);
    setPicked(null);
  };

  return (
    <div className="card space-y-4 p-5">
      <div className="flex justify-between text-sm text-muted">
        <span>
          Câu {i + 1}/{rounds.length}
        </span>
        <span>Đúng {correct}</span>
      </div>
      <div className="text-center">
        <span className="inline-grid size-20 place-items-center rounded-2xl bg-surface-2 text-5xl" lang="zh-Hans">
          {round.radical.form}
        </span>
        <p className="mt-2 font-semibold">Bộ thủ này mang nghĩa gì?</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {round.options.map((o, k) => {
          const state = picked === null ? "border-line hover:border-primary" : k === round.answer ? "border-success bg-success/10" : k === picked ? "border-danger bg-danger-soft" : "border-line opacity-60";
          return (
            <button key={o} type="button" disabled={picked !== null} onClick={() => choose(k)} className={`rounded-xl border-2 p-3 text-left font-semibold transition ${state}`}>
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2" role="status">
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${picked === round.answer ? "text-success" : "text-danger"}`}>
            {picked === round.answer ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {round.radical.name}: {round.radical.meaning} — <span lang="zh-Hans">{round.radical.examples}</span>
          </span>
          <button type="button" onClick={next} className="btn-primary">
            Tiếp <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
