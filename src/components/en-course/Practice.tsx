"use client";

/** Luyện nhiều câu trên cùng một trang: trả lời hết rồi "Kiểm tra" một lần, xem đúng/sai và giải thích từng câu. */
import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { CourseMcq } from "@/content/en-course";
import type { Question } from "@/content/types";
import { correctAnswerText, gradeQuestion, isResponseComplete, type QuizResponse } from "@/core/grading";
import { QuestionView, emptyResponse } from "@/components/quiz/QuestionView";

export const mcqToQuestion = (m: CourseMcq, id: string): Question => ({ id, type: "mcq", prompt: m.q, options: m.options, answer: m.answer, explanation: "" });

export function Practice({ questions, locked, onChecked }: { questions: Question[]; locked?: boolean; onChecked: (score: number) => void }) {
  const [responses, setResponses] = useState<(QuizResponse | null)[]>(() => questions.map(emptyResponse));
  const [checked, setChecked] = useState(false);
  const [round, setRound] = useState(0);

  const results = questions.map((q, i) => (responses[i] ? gradeQuestion(q, responses[i]!) : false));
  const correct = results.filter(Boolean).length;
  const allAnswered = questions.every((q, i) => isResponseComplete(q, responses[i]));

  return (
    <div className="space-y-4">
      <ol className={`space-y-4 ${locked ? "pointer-events-none opacity-50" : ""}`} aria-disabled={locked}>
        {questions.map((q, i) => (
          <li key={`${round}-${q.id}`} className="card p-4 md:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-muted">
              <span className="grid size-6 place-items-center rounded-full bg-surface-2 text-xs">{i + 1}</span>
              {checked && (results[i] ? <CheckCircle2 className="size-5 text-success" /> : <XCircle className="size-5 text-danger" />)}
            </div>
            <QuestionView q={q} response={responses[i]} checked={checked} onChange={(r) => setResponses((rs) => rs.map((x, j) => (j === i ? r : x)))} />
            {checked && !results[i] && <p className="mt-3 font-semibold text-success">{correctAnswerText(q)}</p>}
            {checked && q.explanation && <p className="mt-2 text-sm leading-relaxed text-muted">{q.explanation}</p>}
          </li>
        ))}
      </ol>
      {checked ? (
        <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-4">
          <span className="text-lg font-extrabold">
            {correct}/{questions.length}
          </span>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg"
            onClick={() => {
              setResponses(questions.map(emptyResponse));
              setChecked(false);
              setRound((r) => r + 1);
            }}
          >
            <RotateCcw className="size-3.5" /> Làm lại
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-primary"
          disabled={locked || !allAnswered}
          onClick={() => {
            setChecked(true);
            onChecked(Math.round((correct / questions.length) * 100));
          }}
        >
          Kiểm tra
        </button>
      )}
    </div>
  );
}
