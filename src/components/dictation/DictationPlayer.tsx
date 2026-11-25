"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DictationExercise } from "@/content/types";
import { checkDictation, type DictationCheck } from "@/core/dictation";
import { useSpeech } from "@/lib/speech";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { DictationAnswer, DictationAudioControls, DictationStart } from "./DictationControls";
import { DictationFeedback } from "./DictationFeedback";
import { DictationSummary, type SentenceResult } from "./DictationSummary";

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
      <SessionHeader exitHref="/dictation" value={((idx + (solved ? 1 : 0)) / total) * 100} current={idx + 1} total={total} />

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
          <DictationStart description={exercise.description} onStart={() => setStarted(true)} />
        ) : (
          <DictationAudioControls
            speaking={speaking}
            plays={plays}
            rate={rate}
            speeds={speeds}
            voiceOptions={voiceOptions}
            voiceId={voiceId}
            onPlay={play}
            onStop={stop}
            onRate={setRate}
            onVoice={chooseVoice}
          />
        )}
      </section>

      {started && (
        <>
          {/* Ô nhập */}
          <DictationAnswer
            text={sentence.text}
            input={input}
            result={result}
            solved={solved}
            showSkeleton={showSkeleton}
            inputRef={inputRef}
            onInput={setInput}
            onCheck={check}
            onHint={hint}
            onReveal={reveal}
            onSkip={goNext}
            onShowSkeleton={setShowSkeleton}
          />

          {/* Kết quả kiểm tra */}
          {result && (
            <section
              ref={feedbackRef}
              className={`animate-pop-in scroll-mb-6 rounded-2xl border-2 p-5 ${
                solved ? (revealed && !result.passed ? "border-warning/40 bg-warning-soft" : "border-success/40 bg-success-soft") : "border-line bg-surface"
              }`}
              role="status"
            >
              <DictationFeedback
                sentence={sentence}
                result={result}
                solved={solved}
                revealed={revealed}
                firstTry={current?.checks === 1}
                isLast={idx + 1 >= total}
                rate={rate}
                hinted={hinted}
                onNext={goNext}
              />
            </section>
          )}

        </>
      )}
    </div>
  );
}
