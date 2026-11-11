"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Question } from "@/content/types";
import type { QuizResponse } from "@/core/grading";

export interface QuestionViewProps {
  q: Question;
  response: QuizResponse | null;
  onChange: (r: QuizResponse) => void;
  /** Đã bấm kiểm tra → khóa thao tác và tô màu đáp án. */
  checked: boolean;
}

export const TYPE_LABELS: Record<Question["type"], string> = {
  mcq: "Chọn đáp án đúng",
  verb_form: "Chia động từ trong ngoặc",
  gap_fill: "Điền từ vào chỗ trống",
  error_id: "Tìm lỗi sai",
  transform: "Viết lại câu sao cho nghĩa không đổi",
  word_order: "Sắp xếp thành câu đúng",
  matching: "Nối cho phù hợp",
};

/** Khởi tạo câu trả lời rỗng cho từng dạng. */
export function emptyResponse(q: Question): QuizResponse | null {
  switch (q.type) {
    case "transform":
      return { type: "transform", text: q.starter ? `${q.starter} ` : "" };
    case "word_order":
      return { type: "word_order", order: [] };
    case "matching":
      return { type: "matching", pairs: q.left.map(() => -1) };
    default:
      return null;
  }
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuestionView(props: QuestionViewProps) {
  const { q } = props;
  switch (q.type) {
    case "mcq":
      return <Mcq {...props} q={q} />;
    case "verb_form":
    case "gap_fill":
      return <InlineGap {...props} q={q} />;
    case "error_id":
      return <ErrorId {...props} q={q} />;
    case "transform":
      return <Transform {...props} q={q} />;
    case "word_order":
      return <WordOrder {...props} q={q} />;
    case "matching":
      return <Matching {...props} q={q} />;
  }
}

type P<T extends Question["type"]> = QuestionViewProps & { q: Extract<Question, { type: T }> };

/* ---------------- Trắc nghiệm ---------------- */

function Mcq({ q, response, onChange, checked }: P<"mcq">) {
  const choice = response?.type === "mcq" ? response.choice : -1;
  return (
    <div className="space-y-5">
      <p className="text-xl font-semibold leading-relaxed md:text-2xl">{renderBlank(q.prompt)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const state = checked ? (i === q.answer ? "correct" : i === choice ? "wrong" : "idle") : i === choice ? "selected" : "idle";
          return (
            <OptionButton key={i} label={String(i + 1)} state={state} disabled={checked} onClick={() => onChange({ type: "mcq", choice: i })}>
              {opt}
            </OptionButton>
          );
        })}
      </div>
    </div>
  );
}

function OptionButton({
  label,
  state,
  children,
  ...rest
}: {
  label: string;
  state: "idle" | "selected" | "correct" | "wrong";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    idle: "border-line bg-surface hover:border-primary/50 hover:bg-surface-2",
    selected: "border-primary bg-primary-soft ring-2 ring-primary/30",
    correct: "border-success bg-success-soft text-success",
    wrong: "border-danger bg-danger-soft text-danger animate-shake",
  }[state];
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-base font-medium transition ${styles}`}
      {...rest}
    >
      <kbd className="grid size-7 shrink-0 place-items-center rounded-lg border border-current/20 text-xs font-bold opacity-70">{label}</kbd>
      <span>{children}</span>
    </button>
  );
}

/* ---------------- Điền / chia động từ (ô nhập nằm trong câu) ---------------- */

function InlineGap({ q, response, onChange, checked }: P<"verb_form" | "gap_fill">) {
  const text = response && "text" in response ? response.text : "";
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [q.id]);
  const [before, after] = q.prompt.split("___");
  const hint = q.type === "verb_form" ? q.base : q.hint;
  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold leading-[2.6] md:text-2xl">
        {before}
        <input
          ref={ref}
          value={text}
          disabled={checked}
          onChange={(e) => onChange({ type: q.type, text: e.target.value })}
          className="mx-1 inline-block w-40 rounded-lg border-b-4 border-primary bg-primary-soft px-2 py-0.5 text-center font-mono text-lg text-primary outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-90 md:w-48"
          aria-label="Câu trả lời"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {after}
      </p>
      {hint && (
        <p className="text-sm text-muted">
          Gợi ý: <span className="chip bg-warning-soft text-warning">({hint})</span>
        </p>
      )}
    </div>
  );
}

/* ---------------- Tìm lỗi sai ---------------- */

function ErrorId({ q, response, onChange, checked }: P<"error_id">) {
  const choice = response?.type === "error_id" ? response.choice : -1;
  let letter = 0;
  return (
    <div className="space-y-4">
      <p className="text-xl font-medium leading-[2.4] md:text-2xl">
        {q.segments.map((seg, i) => {
          if (!seg.underline) return <span key={i}>{seg.text}</span>;
          const l = LETTERS[letter++];
          const state = checked ? (i === q.answer ? "correct" : i === choice ? "wrong" : "idle") : i === choice ? "selected" : "idle";
          const cls = {
            idle: "decoration-primary/50 hover:bg-primary-soft",
            selected: "bg-primary-soft text-primary decoration-primary",
            correct: "bg-success-soft text-success decoration-success",
            wrong: "bg-danger-soft text-danger decoration-danger",
          }[state];
          return (
            <button
              key={i}
              type="button"
              disabled={checked}
              onClick={() => onChange({ type: "error_id", choice: i })}
              className={`relative mx-0.5 rounded-md px-1 underline decoration-2 underline-offset-[6px] transition ${cls}`}
            >
              {seg.text}
              <sup className="ml-0.5 text-xs font-bold text-muted">{l}</sup>
            </button>
          );
        })}
      </p>
      <p className="text-sm text-muted">Bấm vào phần gạch chân bị sai.</p>
      {checked && (
        <p className="text-sm">
          Sửa: <b className="text-success">{q.correction}</b>
        </p>
      )}
    </div>
  );
}

/* ---------------- Viết lại câu ---------------- */

function Transform({ q, response, onChange, checked }: P<"transform">) {
  const text = response?.type === "transform" ? response.text : "";
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [q.id]);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface-2 p-4 text-lg font-medium">{q.prompt}</div>
      <textarea
        ref={ref}
        value={text}
        disabled={checked}
        onChange={(e) => onChange({ type: "transform", text: e.target.value })}
        onKeyDown={(e) => {
          // Enter = kiểm tra (do QuizPlayer xử lý); chặn xuống dòng.
          if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
        }}
        rows={3}
        className="input resize-none font-mono text-base"
        placeholder="Viết lại câu..."
        aria-label="Câu viết lại"
        autoCapitalize="off"
        spellCheck={false}
      />
      {q.starter && <p className="text-sm text-muted">Bắt đầu bằng: <b className="text-fg">{q.starter}...</b></p>}
    </div>
  );
}

/* ---------------- Sắp xếp từ ---------------- */

function WordOrder({ q, response, onChange, checked }: P<"word_order">) {
  // Lưu chỉ số các từ đã chọn để xử lý từ trùng lặp (vd "you" xuất hiện 2 lần).
  const [picked, setPicked] = useState<number[]>([]);
  useEffect(() => setPicked([]), [q.id]);
  useEffect(() => {
    if (response?.type === "word_order" && response.order.length === 0 && picked.length) setPicked([]);
  }, [response, picked.length]);

  function update(next: number[]) {
    setPicked(next);
    onChange({ type: "word_order", order: next.map((i) => q.words[i]) });
  }

  return (
    <div className="space-y-5">
      <div className="flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-line p-3">
        {picked.length === 0 && <span className="px-1 text-sm text-muted">Bấm vào các từ bên dưới theo đúng thứ tự</span>}
        {picked.map((wi, pos) => (
          <button
            key={`${wi}-${pos}`}
            type="button"
            disabled={checked}
            onClick={() => update(picked.filter((_, k) => k !== pos))}
            className="animate-pop-in rounded-xl border border-primary/30 bg-primary-soft px-3 py-2 font-medium text-primary transition hover:brightness-95"
          >
            {q.words[wi]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {q.words.map((w, i) => {
          const used = picked.includes(i);
          return (
            <button
              key={i}
              type="button"
              disabled={checked || used}
              onClick={() => update([...picked, i])}
              className={`rounded-xl border px-3 py-2 font-medium shadow-sm transition ${
                used ? "border-transparent bg-surface-2 text-transparent shadow-none" : "border-line bg-surface hover:-translate-y-0.5 hover:border-primary/50"
              }`}
            >
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Nối ---------------- */

function Matching({ q, response, onChange, checked }: P<"matching">) {
  const pairs = response?.type === "matching" ? response.pairs : q.left.map(() => -1);
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [q.id]);

  function assign(rightIdx: number) {
    const next = pairs.map((p) => (p === rightIdx ? -1 : p));
    next[active] = rightIdx;
    onChange({ type: "matching", pairs: next });
    const nextEmpty = next.findIndex((p) => p < 0);
    if (nextEmpty >= 0) setActive(nextEmpty);
  }

  function clear(i: number) {
    const next = [...pairs];
    next[i] = -1;
    onChange({ type: "matching", pairs: next });
    setActive(i);
  }

  return (
    <div className="space-y-5">
      <p className="text-lg font-semibold">{q.prompt}</p>
      <ul className="space-y-2">
        {q.left.map((l, i) => {
          const r = pairs[i];
          const ok = checked && r === q.pairs[i];
          const bad = checked && r !== q.pairs[i];
          return (
            <li key={i}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => !checked && setActive(i)}
                onKeyDown={(e) => e.key === " " && !checked && setActive(i)}
                className={`flex flex-col gap-2 rounded-2xl border-2 p-3 transition sm:flex-row sm:items-center ${
                  ok ? "border-success bg-success-soft" : bad ? "border-danger bg-danger-soft" : active === i ? "border-primary bg-primary-soft/50" : "border-line bg-surface"
                }`}
              >
                <span className="font-medium sm:w-1/2">{l}</span>
                <span className="flex items-center gap-2 sm:w-1/2">
                  {r >= 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-surface px-2.5 py-1 text-sm font-semibold ring-1 ring-line">
                      {q.right[r]}
                      {!checked && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); clear(i); }} aria-label="Bỏ chọn" className="text-muted hover:text-danger">
                          <X className="size-3.5" />
                        </button>
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-muted">{active === i ? "← chọn bên dưới" : "Chưa nối"}</span>
                  )}
                  {bad && <span className="text-sm font-semibold text-success">→ {q.right[q.pairs[i]]}</span>}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {!checked && (
        <div className="flex flex-wrap gap-2">
          {q.right.map((r, i) => {
            const used = pairs.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => assign(i)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  used ? "border-line bg-surface-2 text-muted" : "border-line bg-surface shadow-sm hover:border-primary/50"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- Tiện ích ---------------- */

function renderBlank(prompt: string) {
  const parts = prompt.split("___");
  return parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 && <span className="mx-1 inline-block w-16 border-b-4 border-primary/60 align-baseline" />}
    </span>
  ));
}

/** Mô tả câu trả lời của người học để hiển thị ở màn hình kết quả. */
export function describeResponse(q: Question, r: QuizResponse | null): string {
  if (!r) return "(bỏ trống)";
  switch (r.type) {
    case "mcq":
      return q.type === "mcq" ? q.options[r.choice] ?? "" : "";
    case "error_id":
      return q.type === "error_id" ? q.segments[r.choice]?.text.trim() ?? "" : "";
    case "word_order":
      return r.order.join(" ");
    case "matching":
      return q.type === "matching" ? q.left.map((l, i) => `${l} — ${r.pairs[i] >= 0 ? q.right[r.pairs[i]] : "?"}`).join(" · ") : "";
    default:
      return r.text.trim() || "(bỏ trống)";
  }
}
