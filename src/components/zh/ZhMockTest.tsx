"use client";

/**
 * Bài thi thử: làm hết các câu như thi thật (không báo đúng/sai từng câu, phần nghe giới hạn số lần nghe),
 * rồi xem điểm từng phần và ôn lại đáp án. Đạt passPercent thì app ghi nhận (lộ trình tự tích bài thi thử).
 */
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Headphones, RotateCcw, Volume2, XCircle } from "lucide-react";
import type { MockItem, MockTest } from "@/content/zh/mock/hsk1";
import { plainText } from "@/core/zh-sentence";
import { progressActions } from "@/lib/progress";
import { seededShuffle } from "@/lib/seeded-shuffle";
import { useSpeech } from "@/lib/speech";
import { ZhText, hasHan } from "./ZhText";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

const MOCK_XP = 30;
const SECTION_LABEL: Record<MockItem["section"], string> = { listening: "Nghe", reading: "Đọc" };

export function ZhMockTest({ test }: { test: MockTest }) {
  const speech = useSpeech({ lang: "zh" });
  const [attempt, setAttempt] = useState(0);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [plays, setPlays] = useState(0);
  const orders = useMemo(() => test.items.map((q) => seededShuffle(q.options, `${q.id}:${attempt}`)), [test, attempt]);

  const play = (q: MockItem) => {
    if (!q.say || plays >= test.maxPlays) return;
    speech.speak(plainText(q.say), 0.85);
    setPlays((n) => n + 1);
  };

  if (!started) {
    const listening = test.items.filter((q) => q.section === "listening").length;
    return (
      <section className="card mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-extrabold">{test.title}</h1>
        <p className="text-muted">
          {test.items.length} câu: {listening} câu nghe, {test.items.length - listening} câu đọc. Mỗi câu nghe được nghe tối đa {test.maxPlays} lần. Không báo đúng/sai từng câu — xem kết quả ở cuối bài. Đạt từ {test.passPercent}% là qua.
        </p>
        <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">Bài mô phỏng cấu trúc nghe – đọc do EngQuiz soạn bằng từ vựng HSK 1, không phải đề thi chính thức.</p>
        <ZhVoiceNotice speech={speech} />
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            setI(0);
            setAnswers([]);
            setPlays(0);
          }}
          className="btn-primary"
        >
          Bắt đầu làm bài <ArrowRight className="size-4" />
        </button>
      </section>
    );
  }

  if (i >= test.items.length) return <MockResult test={test} answers={answers} onRetry={() => { setAttempt((a) => a + 1); setStarted(false); }} />;

  const q = test.items[i];
  function choose(o: string) {
    const next = [...answers];
    next[i] = o;
    setAnswers(next);
    setPlays(0);
    const n = i + 1;
    if (n >= test.items.length) {
      const correct = test.items.filter((item, k) => next[k] === item.options[0]).length;
      const percent = Math.round((correct / test.items.length) * 100);
      if (percent >= test.passPercent) progressActions.recordZhLesson("mock", test.id, percent, MOCK_XP);
    }
    setI(n);
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span className="chip bg-surface-2">
          Phần {SECTION_LABEL[q.section]} · Câu {i + 1}/{test.items.length}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-primary" style={{ width: `${(i / test.items.length) * 100}%` }} />
      </div>
      <div className="card space-y-4 p-5">
        {q.say && (
          <div className="text-center">
            <button type="button" onClick={() => play(q)} disabled={plays >= test.maxPlays} className="btn-primary">
              <Headphones className="size-4" /> Nghe ({test.maxPlays - plays} lần còn lại)
            </button>
          </div>
        )}
        {q.text && <ZhText text={q.text} className="justify-center text-2xl" />}
        {q.zhPrompt ? <ZhText text={q.prompt} className="justify-center text-2xl" /> : <p className="text-center text-lg font-semibold">{q.prompt}</p>}
        <div className="grid gap-2">
          {orders[i].map((o) => (
            <button key={o} type="button" onClick={() => choose(o)} className="rounded-xl border-2 border-line p-3 text-left font-medium transition hover:border-primary">
              {hasHan(o) ? <ZhText text={o} className="text-xl" /> : o}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MockResult({ test, answers, onRetry }: { test: MockTest; answers: string[]; onRetry: () => void }) {
  const ok = (k: number) => answers[k] === test.items[k].options[0];
  const correct = test.items.filter((_, k) => ok(k)).length;
  const percent = Math.round((correct / test.items.length) * 100);
  const passed = percent >= test.passPercent;
  const bySection = (["listening", "reading"] as const).map((sec) => {
    const idx = test.items.map((q, k) => (q.section === sec ? k : -1)).filter((k) => k >= 0);
    return { sec, total: idx.length, right: idx.filter(ok).length };
  });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="card space-y-3 p-6 text-center" role="status">
        <p className="text-4xl font-extrabold">{percent}%</p>
        <p className={`font-bold ${passed ? "text-success" : "text-danger"}`}>{passed ? `Đạt! (từ ${test.passPercent}%) — bài thi thử đã được ghi nhận.` : `Chưa đạt (cần ${test.passPercent}%).`}</p>
        <div className="flex justify-center gap-6 text-sm">
          {bySection.map((s) => (
            <div key={s.sec}>
              <div className="font-bold">
                {s.right}/{s.total}
              </div>
              <div className="text-muted">{SECTION_LABEL[s.sec]}</div>
            </div>
          ))}
        </div>
        <button type="button" onClick={onRetry} className="btn-ghost mx-auto">
          <RotateCcw className="size-4" /> Làm lại (thứ tự đáp án mới)
        </button>
      </section>
      <section className="space-y-2">
        <h2 className="font-bold">Xem lại đáp án</h2>
        {test.items.map((q, k) => (
          <div key={q.id} className={`rounded-xl border p-3 text-sm ${ok(k) ? "border-success/30" : "border-danger/40 bg-danger-soft/40"}`}>
            <div className="flex items-start gap-2">
              {ok(k) ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
              <div className="min-w-0 space-y-1">
                <div className="font-semibold">
                  {k + 1}. {q.zhPrompt ? <ZhText text={q.prompt} pinyin /> : q.prompt}
                </div>
                {(q.say ?? q.text) && (
                  <div className="flex items-center gap-1 text-muted">
                    {q.say && <Volume2 className="size-3.5" />}
                    <ZhText text={(q.say ?? q.text)!} pinyin />
                  </div>
                )}
                <div>
                  Đáp án: <b>{hasHan(q.options[0]) ? <ZhText text={q.options[0]} /> : q.options[0]}</b>
                  {!ok(k) && answers[k] && (
                    <span className="text-muted">
                      {" "}
                      · Bạn chọn: {hasHan(answers[k]) ? <ZhText text={answers[k]} /> : answers[k]}
                    </span>
                  )}
                </div>
                <div className="text-muted">{q.explanation}</div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
