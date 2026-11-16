"use client";

/**
 * Bài tập cuối bài ngữ pháp tiếng Trung: trắc nghiệm và sắp xếp từ thành câu.
 * Đạt PASS_PERCENT thì app tự ghi nhận bài (lộ trình tự tích), người học không tự đánh dấu.
 */
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Undo2, XCircle } from "lucide-react";
import type { ZhQuestion } from "@/content/zh/grammar";
import { sameOrder, tokenize } from "@/core/zh-sentence";
import { PASS_PERCENT } from "@/lib/progress-calc";
import { ZhText, hasHan } from "./ZhText";

type Rng = () => number;

function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Thẻ từ của câu sắp xếp: lấy từ đáp án đầu tiên, bỏ dấu câu, xáo sao cho khác thứ tự đúng. */
function tilesFor(answer: string): string[] {
  const words = tokenize(answer)
    .filter((t) => t.kind !== "punct")
    .map((t) => t.text);
  if (words.length < 2) return words;
  let out = shuffle(words);
  for (let k = 0; k < 5 && out.join() === words.join(); k++) out = shuffle(words);
  return out;
}

export function ZhGrammarQuiz({ questions, showPinyin, onFinish }: { questions: ZhQuestion[]; showPinyin: boolean; onFinish: (percent: number) => void }) {
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const q = questions[i];

  if (i >= questions.length) {
    const percent = Math.round((correct / questions.length) * 100);
    const passed = percent >= PASS_PERCENT;
    return (
      <div className="card space-y-3 p-6 text-center" role="status">
        <p className="text-3xl font-extrabold">{percent}%</p>
        <p className="text-muted">
          Đúng {correct}/{questions.length}. {passed ? "Bài đã được ghi nhận." : `Cần từ ${PASS_PERCENT}% — đọc lại phần lý thuyết rồi làm lại.`}
        </p>
        <button
          type="button"
          onClick={() => {
            setRound((r) => r + 1);
            setI(0);
            setCorrect(0);
            setResult(null);
          }}
          className="btn-ghost mx-auto"
        >
          <RotateCcw className="size-4" /> Làm lại
        </button>
      </div>
    );
  }

  function answered(ok: boolean) {
    setResult(ok);
    if (ok) setCorrect((n) => n + 1);
  }

  function next() {
    const n = i + 1;
    setI(n);
    setResult(null);
    if (n >= questions.length) onFinish(Math.round(((correct) / questions.length) * 100));
  }

  return (
    <div className="card space-y-4 p-5">
      <div className="flex justify-between text-sm text-muted">
        <span>
          Câu {i + 1}/{questions.length}
        </span>
        <span>Đúng {correct}</span>
      </div>
      {q.type === "mcq" ? (
        <McqQuestion key={`${round}-${q.id}`} q={q} showPinyin={showPinyin} locked={result !== null} onAnswer={answered} />
      ) : (
        <OrderQuestion key={`${round}-${q.id}`} q={q} showPinyin={showPinyin} locked={result !== null} onAnswer={answered} />
      )}
      {result !== null && (
        <div className="space-y-3" role="status">
          <p className={`flex items-start gap-1.5 text-sm font-semibold ${result ? "text-success" : "text-danger"}`}>
            {result ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <XCircle className="mt-0.5 size-5 shrink-0" />}
            <span>
              {result ? "Chính xác! " : "Chưa đúng. "}
              <span className="font-normal text-fg">{q.explanation}</span>
            </span>
          </p>
          {!result && q.type === "order" && (
            <p className="text-sm">
              Đáp án: <ZhText text={q.answers[0]} pinyin={showPinyin} className="text-lg" />
            </p>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={next} className="btn-primary">
              {i + 1 < questions.length ? "Câu tiếp" : "Xem kết quả"} <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function McqQuestion({ q, showPinyin, locked, onAnswer }: { q: Extract<ZhQuestion, { type: "mcq" }>; showPinyin: boolean; locked: boolean; onAnswer: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <>
      <div className="text-center">
        {q.zhPrompt ? <ZhText text={q.prompt} pinyin={showPinyin} className="justify-center text-2xl" /> : <p className="text-lg font-semibold">{q.prompt}</p>}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {q.options.map((o, k) => {
          const state = picked === null ? "border-line hover:border-primary" : k === q.answer ? "border-success bg-success/10" : k === picked ? "border-danger bg-danger-soft" : "border-line opacity-60";
          return (
            <button
              key={o}
              type="button"
              disabled={locked}
              onClick={() => {
                setPicked(k);
                onAnswer(k === q.answer);
              }}
              className={`rounded-xl border-2 p-3 text-center transition ${state}`}
            >
              {hasHan(o) ? <ZhText text={o} pinyin={showPinyin} className="justify-center text-xl" /> : o}
            </button>
          );
        })}
      </div>
    </>
  );
}

function OrderQuestion({ q, showPinyin, locked, onAnswer }: { q: Extract<ZhQuestion, { type: "order" }>; showPinyin: boolean; locked: boolean; onAnswer: (ok: boolean) => void }) {
  const tiles = useMemo(() => tilesFor(q.answers[0]), [q]);
  /** Vị trí thẻ đã chọn, theo thứ tự người học bấm */
  const [chosen, setChosen] = useState<number[]>([]);
  const built = chosen.map((k) => tiles[k]);
  const complete = chosen.length === tiles.length;

  return (
    <>
      <p className="text-center text-lg font-semibold">Sắp xếp thành câu: “{q.vi}”</p>
      <div className="flex min-h-14 flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-line p-2">
        {built.length ? (
          built.map((w, k) => (
            <span key={k} className="rounded-lg bg-primary-soft px-2.5 py-1.5 text-xl text-primary">
              <ZhText text={w} pinyin={showPinyin} />
            </span>
          ))
        ) : (
          <span className="text-sm text-muted">Bấm các từ bên dưới theo đúng thứ tự</span>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {tiles.map((w, k) => (
          <button
            key={k}
            type="button"
            disabled={locked || chosen.includes(k)}
            onClick={() => setChosen((c) => [...c, k])}
            className="rounded-lg border-2 border-line bg-surface px-2.5 py-1.5 text-xl transition hover:border-primary disabled:opacity-30"
          >
            <ZhText text={w} pinyin={showPinyin} />
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <button type="button" disabled={locked || !chosen.length} onClick={() => setChosen((c) => c.slice(0, -1))} className="btn-ghost">
          <Undo2 className="size-4" /> Bỏ từ cuối
        </button>
        <button type="button" disabled={locked || !complete} onClick={() => onAnswer(q.answers.some((a) => sameOrder(built, a)))} className="btn-primary">
          Kiểm tra
        </button>
      </div>
    </>
  );
}
