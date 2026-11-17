"use client";

/** Câu hỏi đọc hiểu cuối bài đọc / hội thoại. Dữ liệu để đáp án đúng ở vị trí đầu; ở đây xáo thứ tự khi hiển thị. */
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { ZhTextQuestion } from "@/content/zh/texts";
import { PASS_PERCENT } from "@/lib/progress-calc";
import { seededShuffle } from "@/lib/seeded-shuffle";

export function ZhTextQuiz({ questions, onFinish }: { questions: ZhTextQuestion[]; onFinish: (percent: number, correct: number, total: number) => void }) {
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const orders = useMemo(() => questions.map((q) => seededShuffle(q.options, `${q.id}:${round}`)), [questions, round]);

  if (i >= questions.length) {
    const percent = Math.round((correct / questions.length) * 100);
    return (
      <div className="card space-y-3 p-6 text-center" role="status">
        <p className="text-3xl font-extrabold">{percent}%</p>
        <p className="text-muted">
          Đúng {correct}/{questions.length}. {percent >= PASS_PERCENT ? "Bài đã được ghi nhận." : `Cần từ ${PASS_PERCENT}% — nghe và đọc lại bài rồi thử lại.`}
        </p>
        <button
          type="button"
          onClick={() => {
            setRound((r) => r + 1);
            setI(0);
            setCorrect(0);
            setPicked(null);
          }}
          className="btn-ghost mx-auto"
        >
          <RotateCcw className="size-4" /> Làm lại
        </button>
      </div>
    );
  }

  const q = questions[i];
  const answer = q.options[0];

  function next() {
    const n = i + 1;
    setI(n);
    setPicked(null);
    if (n >= questions.length) onFinish(Math.round((correct / questions.length) * 100), correct, questions.length);
  }

  return (
    <div className="card space-y-4 p-5">
      <div className="flex justify-between text-sm text-muted">
        <span>
          Câu {i + 1}/{questions.length}
        </span>
        <span>Đúng {correct}</span>
      </div>
      <p className="text-lg font-semibold">{q.prompt}</p>
      <div className="grid gap-2">
        {orders[i].map((o) => {
          const state = picked === null ? "border-line hover:border-primary" : o === answer ? "border-success bg-success/10" : o === picked ? "border-danger bg-danger-soft" : "border-line opacity-60";
          return (
            <button
              key={o}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(o);
                if (o === answer) setCorrect((n) => n + 1);
              }}
              className={`rounded-xl border-2 p-3 text-left font-medium transition ${state}`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2" role="status">
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${picked === answer ? "text-success" : "text-danger"}`}>
            {picked === answer ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            <span lang="zh-Hans">{q.explanation}</span>
          </span>
          <button type="button" onClick={next} className="btn-primary">
            {i + 1 < questions.length ? "Câu tiếp" : "Xem kết quả"} <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
