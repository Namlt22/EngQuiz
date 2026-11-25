"use client";

/**
 * Bộ câu hỏi ngắn đặt ngay dưới bài đọc / bài hội thoại (không chiếm cả màn hình như QuizPlayer).
 * Dùng chung QuestionView và bộ chấm của Quiz; xong bài thì báo điểm qua onFinish.
 */
import { useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import type { Question } from "@/content/types";
import { correctAnswerText, gradeQuestion, isResponseComplete, type QuizResponse } from "@/core/grading";
import { PASS_PERCENT } from "@/lib/progress";
import { QuestionView, TYPE_LABELS, emptyResponse } from "@/components/quiz/QuestionView";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { StepLinkInput } from "@/lib/next-step";
import { ActivityResult } from "./ActivityResult";

export interface LessonScore {
  percent: number;
  correct: number;
  total: number;
}

export function LessonQuiz({ questions, title, onFinish, nextLink }: { questions: Question[]; title: string; onFinish: (score: LessonScore) => void; nextLink?: StepLinkInput }) {
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<QuizResponse | null>(() => emptyResponse(questions[0]));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const q = questions[index];
  const finished = results.length === questions.length && checked && index === questions.length - 1;
  const lastCorrect = results[results.length - 1];

  function check() {
    if (checked || !isResponseComplete(q, response)) return;
    setResults((r) => [...r, gradeQuestion(q, response!)]);
    setChecked(true);
  }

  function next() {
    if (index + 1 >= questions.length) {
      const correct = results.filter(Boolean).length;
      onFinish({ percent: Math.round((correct / questions.length) * 100), correct, total: questions.length });
      setIndex(questions.length); // sang màn kết quả
      return;
    }
    setIndex(index + 1);
    setResponse(emptyResponse(questions[index + 1]));
    setChecked(false);
  }

  function restart() {
    setRound((r) => r + 1);
    setIndex(0);
    setResponse(emptyResponse(questions[0]));
    setChecked(false);
    setResults([]);
  }

  if (index >= questions.length) return <LessonResult results={results} onRestart={restart} nextLink={nextLink} />;

  return (
    <section className="card space-y-5 p-5 md:p-6" aria-label={title}>
      <div className="flex items-center gap-3">
        <h2 className="shrink-0 text-lg font-bold">{title}</h2>
        <ProgressBar value={((index + (checked ? 1 : 0)) / questions.length) * 100} className="h-2" label="Tiến độ bài tập" />
        <span className="shrink-0 text-sm font-semibold text-muted">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div key={`${round}-${index}`} className="animate-pop-in space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{TYPE_LABELS[q.type]}</p>
        <QuestionView q={q} response={response} onChange={setResponse} checked={checked} />
      </div>

      {checked && (
        <div role="status" className={`animate-pop-in space-y-1.5 rounded-2xl p-4 ${lastCorrect ? "bg-success-soft" : "bg-danger-soft"}`}>
          <p className={`flex items-center gap-2 font-bold ${lastCorrect ? "text-success" : "text-danger"}`}>
            {lastCorrect ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {lastCorrect ? "Chính xác!" : "Chưa đúng"}
          </p>
          {!lastCorrect && (
            <p className="text-sm">
              Đáp án đúng: <b>{correctAnswerText(q)}</b>
            </p>
          )}
          <p className="text-sm leading-relaxed text-fg/80">{q.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {checked ? (
          <button type="button" onClick={next} className="btn-primary w-full sm:w-auto sm:px-8">
            {finished ? "Xem kết quả" : "Tiếp tục"} <ArrowRight className="size-4" />
          </button>
        ) : (
          <button type="button" onClick={check} disabled={!isResponseComplete(q, response)} className="btn-primary w-full sm:w-auto sm:px-8">
            Kiểm tra
          </button>
        )}
      </div>
    </section>
  );
}

function LessonResult({ results, onRestart, nextLink }: { results: boolean[]; onRestart: () => void; nextLink?: StepLinkInput }) {
  const correct = results.filter(Boolean).length;
  const percent = Math.round((correct / results.length) * 100);
  return <ActivityResult passed={percent >= PASS_PERCENT} percent={percent} detail={`${correct}/${results.length}`} onRetry={onRestart} next={nextLink} />;
}
