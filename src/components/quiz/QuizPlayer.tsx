"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Headphones, RotateCcw, Trophy, X, XCircle } from "lucide-react";
import { getTopicMeta } from "@/content/catalog";
import { dictationsForTopic } from "@/content/dictations";
import { correctAnswerText, gradeQuestion, isResponseComplete, type QuizResponse } from "@/core/grading";
import { PASS_PERCENT, progressActions } from "@/lib/progress";
import type { QuizItem, QuizSet } from "@/lib/quiz-sets";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionView, TYPE_LABELS, describeResponse, emptyResponse } from "./QuestionView";

interface Answered {
  item: QuizItem;
  response: QuizResponse | null;
  correct: boolean;
}

export function QuizPlayer({ set }: { set: QuizSet }) {
  const [items, setItems] = useState<QuizItem[]>(set.items);
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<QuizResponse | null>(() => emptyResponse(set.items[0].question));
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [done, setDone] = useState(false);

  const item = items[index];
  const q = item.question;
  const lastAnswer = answers[answers.length - 1];
  const isCorrect = checked && lastAnswer?.correct;
  const canCheck = isResponseComplete(q, response);

  const check = useCallback(() => {
    if (checked || !canCheck) return;
    const correct = gradeQuestion(q, response!);
    setAnswers((a) => [...a, { item, response, correct }]);
    setChecked(true);
  }, [checked, canCheck, q, response, item]);

  const next = useCallback(() => {
    if (!checked) return;
    if (index + 1 >= items.length) {
      setDone(true);
      return;
    }
    const n = index + 1;
    setIndex(n);
    setResponse(emptyResponse(items[n].question));
    setChecked(false);
  }, [checked, index, items]);

  // Phím tắt: Enter = kiểm tra / tiếp tục; 1–4 = chọn đáp án trắc nghiệm.
  useEffect(() => {
    if (done) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (checked) next();
        else check();
        return;
      }
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const n = Number(e.key);
      if (!checked && n >= 1 && n <= 6) {
        if (q.type === "mcq" && n <= q.options.length) setResponse({ type: "mcq", choice: n - 1 });
        if (q.type === "error_id") {
          const idx = q.segments.map((s, i) => (s.underline ? i : -1)).filter((i) => i >= 0)[n - 1];
          if (idx !== undefined) setResponse({ type: "error_id", choice: idx });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [check, next, checked, done, q]);

  function restart(onlyWrong: boolean) {
    const list = onlyWrong ? answers.filter((a) => !a.correct).map((a) => a.item) : set.items;
    setItems(list);
    setRound((r) => r + 1);
    setIndex(0);
    setResponse(emptyResponse(list[0].question));
    setChecked(false);
    setAnswers([]);
    setDone(false);
  }

  if (done) {
    return <QuizResult set={set} answers={answers} isRetryRound={items.length !== set.items.length} onRestart={restart} />;
  }

  const progress = ((index + (checked ? 1 : 0)) / items.length) * 100;
  const topicMeta = getTopicMeta(item.topicSlug);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-2xl flex-col">
      {/* Thanh trên cùng */}
      <div className="flex items-center gap-3">
        <Link href="/quiz" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg" aria-label="Thoát">
          <X className="size-5" />
        </Link>
        <ProgressBar value={progress} className="h-3" label="Tiến độ bài quiz" />
        <span className="shrink-0 text-sm font-semibold text-muted">
          {index + 1}/{items.length}
        </span>
      </div>

      {/* Câu hỏi */}
      <div className="flex-1 py-8" key={`${round}-${index}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <span className="text-primary">{TYPE_LABELS[q.type]}</span>
          {set.kind !== "topic" && topicMeta && <span className="chip bg-surface-2 normal-case tracking-normal">{topicMeta.titleEn}</span>}
        </div>
        <div className="animate-pop-in">
          <QuestionView q={q} response={response} onChange={setResponse} checked={checked} />
        </div>
      </div>

      {/* Thanh phản hồi / nút kiểm tra */}
      <div
        className={`sticky bottom-0 -mx-4 border-t px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 transition-colors ${
          !checked ? "border-line bg-bg" : isCorrect ? "border-success/30 bg-success-soft" : "border-danger/30 bg-danger-soft"
        }`}
      >
        {checked && (
          <div className="animate-pop-in mb-4 space-y-1.5" role="status">
            <div className={`flex items-center gap-2 text-lg font-bold ${isCorrect ? "text-success" : "text-danger"}`}>
              {isCorrect ? <CheckCircle2 className="size-6" /> : <XCircle className="size-6" />}
              {isCorrect ? "Chính xác!" : "Chưa đúng"}
            </div>
            {!isCorrect && (
              <p className="text-sm">
                Đáp án đúng: <b>{correctAnswerText(q)}</b>
              </p>
            )}
            <p className="text-sm leading-relaxed text-fg/80">{q.explanation}</p>
            {!isCorrect && (
              <Link href={`/grammar/${item.topicSlug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                <BookOpen className="size-4" /> Xem lại lý thuyết
              </Link>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="hidden text-xs text-muted sm:block">
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Enter</kbd> {checked ? "tiếp tục" : "kiểm tra"}
          </span>
          {checked ? (
            <button type="button" onClick={next} className={`ml-auto w-full py-3 sm:w-auto sm:px-8 ${isCorrect ? "btn-success" : "btn bg-danger text-white hover:brightness-110 dark:text-bg"}`}>
              Tiếp tục <ArrowRight className="size-4" />
            </button>
          ) : (
            <button type="button" onClick={check} disabled={!canCheck} className="btn-primary ml-auto w-full py-3 sm:w-auto sm:px-8">
              Kiểm tra
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Màn hình kết quả ---------------- */

function QuizResult({
  set,
  answers,
  isRetryRound,
  onRestart,
}: {
  set: QuizSet;
  answers: Answered[];
  isRetryRound: boolean;
  onRestart: (onlyWrong: boolean) => void;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const total = answers.length;
  const percent = Math.round((correct / total) * 100);
  const wrong = answers.filter((a) => !a.correct);

  const byTopic = useMemo(() => {
    const m = new Map<string, { correct: number; total: number }>();
    for (const a of answers) {
      const cur = m.get(a.item.topicSlug) ?? { correct: 0, total: 0 };
      cur.total++;
      if (a.correct) cur.correct++;
      m.set(a.item.topicSlug, cur);
    }
    return [...m.entries()];
  }, [answers]);

  // Lưu tiến độ một lần khi hiển thị kết quả (vòng làm lại câu sai không tính điểm chủ điểm).
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    if (isRetryRound) {
      progressActions.addXp(correct);
      return;
    }
    if (set.kind === "topic") {
      progressActions.recordQuiz(byTopic[0][0], percent, correct);
    } else {
      progressActions.addXp(correct * 2);
    }
  }, [isRetryRound, set.kind, byTopic, percent, correct]);

  const passed = percent >= PASS_PERCENT;
  const topicSlug = set.kind === "topic" ? byTopic[0][0] : undefined;
  const dictation = topicSlug ? dictationsForTopic(topicSlug)[0] : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="card animate-pop-in overflow-hidden text-center">
        <div className={`bg-gradient-to-br p-8 text-white ${passed ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-violet-500"}`}>
          <Trophy className="mx-auto size-12" />
          <div className="mt-3 text-5xl font-black">{percent}%</div>
          <p className="mt-1 text-white/90">
            Đúng {correct}/{total} câu {isRetryRound && "(vòng làm lại)"}
          </p>
          <p className="mt-3 font-semibold">
            {passed ? "Tuyệt vời! Bạn đã nắm chắc phần này 🎉" : `Cố lên! Đạt ${PASS_PERCENT}% để hoàn thành chủ điểm.`}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-4">
          {wrong.length > 0 && (
            <button type="button" onClick={() => onRestart(true)} className="btn-primary">
              <RotateCcw className="size-4" /> Làm lại {wrong.length} câu sai
            </button>
          )}
          <button type="button" onClick={() => onRestart(false)} className="btn-ghost">
            <RotateCcw className="size-4" /> Làm lại từ đầu
          </button>
          {dictation && (
            <Link href={`/dictation/${dictation.id}`} className="btn-ghost">
              <Headphones className="size-4" /> Nghe & chép
            </Link>
          )}
          <Link href={set.level ? `/levels/${set.level.toLowerCase()}` : "/quiz"} className="btn-ghost">
            Về lộ trình
          </Link>
        </div>
      </section>

      {byTopic.length > 1 && (
        <section className="card p-5">
          <h2 className="mb-3 font-bold">Điểm theo chủ điểm</h2>
          <ul className="space-y-3">
            {byTopic.map(([slug, s]) => {
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <li key={slug}>
                  <div className="mb-1 flex justify-between text-sm">
                    <Link href={`/grammar/${slug}`} className="font-medium hover:underline">
                      {getTopicMeta(slug)?.title}
                    </Link>
                    <span className="text-muted">
                      {s.correct}/{s.total}
                    </span>
                  </div>
                  <ProgressBar value={pct} barClassName={pct >= PASS_PERCENT ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-danger"} />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {wrong.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold">Các câu chưa đúng</h2>
          {wrong.map(({ item, response }) => (
            <div key={item.question.id} className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{TYPE_LABELS[item.question.type]}</p>
              <p className="mt-1 font-medium">{questionText(item.question)}</p>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-danger">
                <XCircle className="mt-0.5 size-4 shrink-0" /> {describeResponse(item.question, response)}
              </p>
              <p className="flex items-start gap-1.5 text-sm font-semibold text-success">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> {correctAnswerText(item.question)}
              </p>
              <p className="mt-2 text-sm text-muted">{item.question.explanation}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function questionText(q: QuizItem["question"]): string {
  switch (q.type) {
    case "error_id":
      return q.segments.map((s) => s.text).join("");
    case "word_order":
      return q.words.join(" / ");
    case "matching":
      return q.prompt;
    default:
      return q.prompt;
  }
}
