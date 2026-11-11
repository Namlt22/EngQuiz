"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, CheckCircle2, Eye, Gauge, Headphones, Lightbulb, Play, RotateCcw, SkipForward, Square, Trophy, X,
} from "lucide-react";
import type { DictationExercise } from "@/content/types";
import { checkDictation, maskSentence, maskWord, type DictationCheck } from "@/core/dictation";
import { useSpeech } from "@/lib/speech";
import { PASS_PERCENT, progressActions } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { LevelBadge } from "@/components/ui/LevelBadge";

interface SentenceResult {
  /** Độ chính xác ở lần kiểm tra ĐẦU TIÊN (0..1) — phản ánh đúng khả năng nghe. */
  firstAccuracy: number;
  checks: number;
  revealed: boolean;
  plays: number;
}

const BASE_SPEEDS = [0.6, 0.75, 1, 1.25];

export function DictationPlayer({ exercise }: { exercise: DictationExercise }) {
  const { speak, stop, speaking, supported, voiceOptions, voiceId, chooseVoice } = useSpeech();
  const [rate, setRate] = useState(exercise.rate);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DictationCheck | null>(null);
  const [hinted, setHinted] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(exercise.level === "A1");
  const [results, setResults] = useState<SentenceResult[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [plays, setPlays] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const feedbackRef = useRef<HTMLElement>(null);
  const speeds = useMemo(() => [...new Set([...BASE_SPEEDS, exercise.rate])].sort((a, b) => a - b), [exercise.rate]);

  // Đưa phần phản hồi vào tầm nhìn sau mỗi lần kiểm tra (quan trọng trên điện thoại).
  useEffect(() => {
    if (result) feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [result]);

  const sentence = exercise.sentences[idx];
  const total = exercise.sentences.length;
  const solved = !!result?.passed || revealed;
  const current: SentenceResult | undefined = results[idx];

  const play = useCallback(() => {
    speak(sentence.text, rate);
    setPlays((n) => n + 1);
    inputRef.current?.focus();
  }, [speak, sentence, rate]);

  // Tự phát câu mới (sau khi người học đã bấm bắt đầu — trình duyệt yêu cầu thao tác người dùng).
  useEffect(() => {
    if (started && !finished) {
      const t = setTimeout(play, 250);
      return () => clearTimeout(t);
    }
    // chỉ chạy khi đổi câu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, started]);

  function saveResult(patch: Partial<SentenceResult>) {
    setResults((rs) => {
      const copy = [...rs];
      const prev = copy[idx] ?? { firstAccuracy: 0, checks: 0, revealed: false, plays: 0 };
      copy[idx] = { ...prev, ...patch, plays };
      return copy;
    });
  }

  function check() {
    if (solved || !input.trim()) return;
    const r = checkDictation(sentence.text, input);
    setResult(r);
    const checks = (current?.checks ?? 0) + 1;
    saveResult(checks === 1 ? { firstAccuracy: r.accuracy, checks } : { checks });
  }

  function hint() {
    if (!result) return;
    const i = result.words.findIndex((w, k) => (w.status === "wrong" || w.status === "missing") && !hinted.has(k));
    if (i >= 0) setHinted(new Set(hinted).add(i));
  }

  function reveal() {
    setRevealed(true);
    setResult(checkDictation(sentence.text, input));
    saveResult({ revealed: true, ...(current?.checks ? {} : { firstAccuracy: 0, checks: 0 }) });
  }

  function goNext() {
    if (!results[idx]) saveResult({ firstAccuracy: 0, checks: 0 }); // bỏ qua câu chưa làm
    stop();
    if (idx + 1 >= total) {
      setFinished(true);
      return;
    }
    setIdx(idx + 1);
    setInput("");
    setResult(null);
    setHinted(new Set());
    setRevealed(false);
    setPlays(0);
  }

  function restart() {
    setIdx(0);
    setInput("");
    setResult(null);
    setHinted(new Set());
    setRevealed(false);
    setResults([]);
    setPlays(0);
    setFinished(false);
  }

  // Phím tắt: Ctrl+Space / Ctrl+Enter? → nghe lại; Enter → kiểm tra / câu tiếp.
  useEffect(() => {
    if (!started || finished) return;
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        e.preventDefault();
        play();
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (solved) goNext();
        else check();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (finished) {
    return <DictationSummary exercise={exercise} results={results} onRestart={restart} />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Đầu trang */}
      <div className="flex items-center gap-3">
        <Link href="/dictation" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg" aria-label="Thoát">
          <X className="size-5" />
        </Link>
        <ProgressBar value={((idx + (solved ? 1 : 0)) / total) * 100} className="h-3" barClassName="bg-success" label="Tiến độ" />
        <span className="shrink-0 text-sm font-semibold text-muted">
          {idx + 1}/{total}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LevelBadge level={exercise.level} />
        <h1 className="text-lg font-bold">{exercise.title}</h1>
      </div>

      {!supported && (
        <div className="rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm">
          Trình duyệt của bạn không hỗ trợ đọc văn bản (Web Speech). Hãy dùng Chrome, Edge hoặc Safari bản mới.
        </div>
      )}

      {/* Trình phát */}
      <section className="card p-5">
        {!started ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105"
              aria-label="Bắt đầu nghe"
            >
              <Play className="ml-1 size-9" fill="currentColor" />
            </button>
            <p className="font-semibold">Bấm để bắt đầu nghe</p>
            <p className="max-w-sm text-sm text-muted">{exercise.description} Nghe từng câu và gõ lại chính xác những gì bạn nghe được.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={speaking ? stop : play}
                className={`grid size-16 place-items-center rounded-full text-white shadow-lg transition hover:scale-105 ${
                  speaking ? "bg-danger shadow-danger/30" : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30"
                }`}
                aria-label={speaking ? "Dừng" : "Nghe"}
              >
                {speaking ? <Square className="size-6" fill="currentColor" /> : <Play className="ml-1 size-7" fill="currentColor" />}
              </button>
              <button type="button" onClick={play} className="btn-ghost" title="Nghe lại (Ctrl + Space)">
                <RotateCcw className="size-4" /> Nghe lại
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <Gauge className="size-4 text-muted" />
              {speeds.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRate(s)}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${rate === s ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
                >
                  {s}x
                </button>
              ))}
              <span className="text-xs text-muted">· đã nghe {plays} lần</span>
            </div>
            {voiceOptions.length > 1 && (
              <select
                value={voiceId}
                onChange={(e) => chooseVoice(e.target.value)}
                className="max-w-full rounded-lg border border-line bg-surface px-2 py-1 text-sm text-muted"
                aria-label="Chọn giọng đọc"
              >
                {voiceOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </section>

      {started && (
        <>
          {/* Ô nhập */}
          <section className="space-y-3">
            {showSkeleton && !result && (
              <p className="rounded-xl bg-surface-2 px-4 py-2 font-mono text-sm tracking-wider text-muted" aria-label="Khung gợi ý số chữ">
                {maskSentence(sentence.text)}
              </p>
            )}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="Gõ những gì bạn nghe được..."
              className="input resize-none font-mono text-[17px] leading-relaxed"
              aria-label="Nội dung bạn nghe được"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <div className="flex flex-wrap items-center gap-2">
              {!solved && (
                <button type="button" onClick={check} disabled={!input.trim()} className="btn-primary px-6">
                  Kiểm tra
                </button>
              )}
              {result && !solved && (
                <button type="button" onClick={hint} className="btn-ghost" title="Hiện một từ đang bị che">
                  <Lightbulb className="size-4" /> Gợi ý 1 từ
                </button>
              )}
              {!solved && (
                <>
                  <button type="button" onClick={reveal} className="btn-ghost">
                    <Eye className="size-4" /> Hiện đáp án
                  </button>
                  <button type="button" onClick={goNext} className="btn-ghost text-muted">
                    <SkipForward className="size-4" /> Bỏ qua
                  </button>
                </>
              )}
              <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={showSkeleton} onChange={(e) => setShowSkeleton(e.target.checked)} className="accent-[var(--primary)]" />
                Hiện số chữ
              </label>
            </div>
          </section>

          {/* Kết quả kiểm tra */}
          {result && (
            <section
              ref={feedbackRef}
              className={`animate-pop-in scroll-mb-6 rounded-2xl border-2 p-5 ${
                solved ? (revealed && !result.passed ? "border-warning/40 bg-warning-soft" : "border-success/40 bg-success-soft") : "border-line bg-surface"
              }`}
              role="status"
            >
              {solved ? (
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 font-bold ${revealed && !result.passed ? "text-warning" : "text-success"}`}>
                    {revealed && !result.passed ? <Eye className="size-5" /> : <CheckCircle2 className="size-5" />}
                    {revealed && !result.passed ? "Đáp án" : current?.checks === 1 ? "Hoàn hảo ngay lần đầu! 🎉" : "Chính xác!"}
                  </div>
                  <div className="flex items-start gap-2">
                    <SpeakButton text={sentence.text} rate={rate} />
                    <div>
                      <p className="text-lg font-semibold">{sentence.text}</p>
                      <p className="text-sm text-muted">{sentence.vi}</p>
                    </div>
                  </div>
                  {result.nearTokens > 0 && !revealed && (
                    <p className="text-sm text-warning">Có {result.nearTokens} lỗi chính tả nhỏ — xem các từ màu vàng bên dưới.</p>
                  )}
                  {!revealed && <WordFeedback result={result} hinted={hinted} />}
                  <button type="button" onClick={goNext} className="btn-success w-full py-3 sm:w-auto sm:px-8">
                    {idx + 1 >= total ? "Xem kết quả" : "Câu tiếp theo"} <ArrowRight className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      Đúng {result.correctTokens}/{result.totalTokens} từ
                    </span>
                    <span className="text-muted">Sửa lại các từ bị che rồi kiểm tra tiếp</span>
                  </div>
                  <WordFeedback result={result} hinted={hinted} />
                  {result.extras.length > 0 && (
                    <p className="text-sm text-danger">
                      Từ thừa: <span className="font-mono line-through">{result.extras.join(" ")}</span>
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          <p className="text-center text-xs text-muted">
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Ctrl</kbd> +{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Space</kbd> nghe lại ·{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Enter</kbd> kiểm tra / câu tiếp
          </p>
        </>
      )}
    </div>
  );
}

/** Hiển thị câu gốc: từ đúng hiện ra, từ sai/thiếu bị che ***, từ gợi ý hiện màu xanh. */
function WordFeedback({ result, hinted }: { result: DictationCheck; hinted: Set<number> }) {
  return (
    <p className="flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-lg leading-relaxed">
      {result.words.map((w, i) => {
        if (w.status === "correct") return <span key={i} className="text-success">{w.display}</span>;
        if (w.status === "near")
          return (
            <span key={i} className="text-warning underline decoration-wavy underline-offset-4" title={`Bạn gõ: ${w.typed}`}>
              {w.display}
            </span>
          );
        if (hinted.has(i)) return <span key={i} className="rounded bg-primary-soft px-1 text-primary">{w.display}</span>;
        return (
          <span
            key={i}
            className={`rounded px-1 ${w.status === "missing" ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"}`}
            title={w.status === "missing" ? "Thiếu từ" : `Sai: ${w.typed}`}
          >
            {maskWord(w.display)}
          </span>
        );
      })}
    </p>
  );
}

/* ---------------- Tổng kết ---------------- */

function DictationSummary({
  exercise,
  results,
  onRestart,
}: {
  exercise: DictationExercise;
  results: SentenceResult[];
  onRestart: () => void;
}) {
  const percent = Math.round((results.reduce((s, r) => s + (r?.firstAccuracy ?? 0), 0) / exercise.sentences.length) * 100);
  const perfect = results.filter((r) => r && r.checks === 1 && r.firstAccuracy === 1 && !r.revealed).length;
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    progressActions.recordDictation(exercise.id, exercise.topicSlug, percent, exercise.sentences.length, exercise.sentences.length);
  }, [exercise, percent]);

  const passed = percent >= PASS_PERCENT;
  const verdict = useMemo(
    () => (percent >= 95 ? "Đôi tai vàng! 👂✨" : passed ? "Rất tốt! Bạn nghe khá chuẩn." : percent >= 50 ? "Khá ổn, luyện thêm chút nữa nhé." : "Đừng nản — nghe chậm (0.75x) và thử lại."),
    [percent, passed],
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="card animate-pop-in overflow-hidden text-center">
        <div className={`bg-gradient-to-br p-8 text-white ${passed ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-violet-500"}`}>
          <Trophy className="mx-auto size-12" />
          <div className="mt-3 text-5xl font-black">{percent}%</div>
          <p className="mt-1 text-white/90">
            Chính xác ở lần kiểm tra đầu · {perfect}/{exercise.sentences.length} câu hoàn hảo
          </p>
          <p className="mt-3 font-semibold">{verdict}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-4">
          <button type="button" onClick={onRestart} className="btn-primary">
            <RotateCcw className="size-4" /> Làm lại
          </button>
          {exercise.topicSlug && (
            <Link href={`/grammar/${exercise.topicSlug}`} className="btn-ghost">
              <BookOpen className="size-4" /> Lý thuyết
            </Link>
          )}
          <Link href="/dictation" className="btn-ghost">
            <Headphones className="size-4" /> Bài khác
          </Link>
        </div>
      </section>

      <section className="card divide-y divide-line">
        <h2 className="p-4 font-bold">Toàn bộ nội dung</h2>
        {exercise.sentences.map((s, i) => {
          const r = results[i];
          const pct = Math.round((r?.firstAccuracy ?? 0) * 100);
          return (
            <div key={i} className="flex items-start gap-3 p-4">
              <SpeakButton text={s.text} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{s.text}</p>
                <p className="text-sm text-muted">{s.vi}</p>
              </div>
              <span
                className={`chip shrink-0 ${
                  r?.revealed && !r.checks ? "bg-surface-2 text-muted" : pct >= PASS_PERCENT ? "bg-success-soft text-success" : pct >= 50 ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"
                }`}
              >
                {r?.revealed && !r.checks ? "xem đáp án" : `${pct}%`}
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
