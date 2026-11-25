"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DICTATIONS, getDictation } from "@/content/dictations";
import type { DictationExercise } from "@/content/types";
import type { WordStatus } from "@/core/dictation";
import { READ_ALOUD_PASS, averageScore, scoreReadAloud, type ReadAloudResult } from "@/core/speaking";
import { progressActions, useProgress } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { pronounceScore, type PronounceResult } from "@/lib/pronounce";
import { pronouncePhaseLabel, scoredMicState } from "@/lib/mic-state";
import { usePronounceCheck } from "@/lib/pronounce-client";
import { listenLabel, useSpeechRecognition } from "@/lib/speech-recognition";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PronounceFeedback } from "./PronounceFeedback";
import { RecordButton } from "./RecordButton";
import { ScoreBadge } from "./ScoreBadge";

const MODEL_RATE = 0.85;
const SLOW_RATE = 0.6;
const NO_SPEECH = "Chưa nghe được gì. Bấm nút, chờ chữ “Đang nghe…” rồi đọc to cả câu.";

const WORD_STYLE: Record<WordStatus, string> = {
  correct: "bg-success-soft text-success",
  near: "bg-warning-soft text-warning",
  wrong: "bg-danger-soft text-danger",
  missing: "bg-surface-2 text-muted line-through",
};

const WORD_HINT: Record<WordStatus, string> = {
  correct: "máy nghe đúng",
  near: "gần đúng",
  wrong: "máy nghe thành từ khác",
  missing: "máy không nghe thấy",
};

interface SentenceScore {
  best: number;
  passed: boolean;
  last: ReadAloudResult;
  /** Lượt cuối chấm tới từng âm (khi đã đăng nhập và máy chủ chấm được). */
  sounds?: PronounceResult;
}

/** Bỏ dấu câu ở hai đầu để đọc riêng một từ. */
const bareWord = (w: string) => w.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, "");

export function ReadAloud({ initialSetId }: { initialSetId?: string }) {
  const [setId, setSetId] = useState(() => (initialSetId && getDictation(initialSetId) ? initialSetId : DICTATIONS[0].id));
  const exercise = getDictation(setId) ?? DICTATIONS[0];
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<Record<number, SentenceScore>>({});
  const [notice, setNotice] = useState<string | null>(null);
  /** Tăng mỗi khi đổi câu/bộ câu: kết quả nhận dạng của lượt cũ về muộn sẽ bị bỏ qua. */
  const attemptRef = useRef(0);
  const { speak, supported: ttsSupported } = useSpeech();
  const recognition = useSpeechRecognition();
  // Đã đăng nhập: chấm tới từng âm trên máy chủ; còn lại dùng nhận dạng giọng nói của trình duyệt.
  const pron = usePronounceCheck();
  const mic = scoredMicState(pron, recognition);
  const { recording, canRecord } = mic;
  const savedBest = useProgress().speaking?.[setId]?.best;
  const total = exercise.sentences.length;
  const sentence = exercise.sentences[idx];
  const current = scores[idx];

  // Lưu tiến độ sau mỗi lần chấm (không gọi trong hàm cập nhật state — StrictMode có thể gọi hai lần).
  useEffect(() => {
    const done = Object.values(scores);
    if (!done.length) return;
    const bests = Array.from({ length: total }, (_, i) => scores[i]?.best);
    progressActions.recordSpeaking(setId, averageScore(bests), done.filter((s) => s.passed).length, total);
  }, [scores, setId, total]);

  function resetContext() {
    attemptRef.current += 1;
    recognition.cancel();
    setNotice(null);
  }

  function chooseSet(id: string) {
    resetContext();
    setSetId(id);
    setIdx(0);
    setScores({});
  }

  function go(delta: number) {
    resetContext();
    setIdx((i) => Math.min(total - 1, Math.max(0, i + delta)));
  }

  function saveScore(at: { idx: number }, result: ReadAloudResult, sounds?: PronounceResult) {
    setScores((prev) => {
      const old = prev[at.idx];
      return { ...prev, [at.idx]: { best: Math.max(old?.best ?? 0, result.score), passed: !!old?.passed || result.passed, last: result, sounds } };
    });
  }

  async function record() {
    const at = { idx, text: sentence.text };
    if (pron.available) {
      if (pron.busy) return pron.stop();
      const attempt = ++attemptRef.current;
      setNotice(null);
      const sounds = await pron.check(at.text, "sentence");
      if (attempt !== attemptRef.current || !sounds) return;
      // Chấm theo từng âm (có âm sai thì chưa đạt); phần tô màu từ của cách chấm cũ không dùng tới.
      const words = scoreReadAloud(at.text, [at.text]);
      const score = pronounceScore(sounds, READ_ALOUD_PASS);
      return saveScore(at, { ...words, score, passed: score >= READ_ALOUD_PASS }, sounds);
    }
    if (recognition.listening) return recognition.stop();
    const attempt = ++attemptRef.current;
    setNotice(null);
    const heard = await recognition.listen({ continuous: false, expected: [sentence.text] });
    if (attempt !== attemptRef.current) return;
    if (!heard) {
      setNotice(NO_SPEECH);
      return;
    }
    saveScore(at, scoreReadAloud(at.text, heard.alternatives));
  }

  return (
    <div className="space-y-5">
      <SetPicker exercise={exercise} savedBest={savedBest} onChoose={chooseSet} />

      <section className="card space-y-5 p-5 md:p-7" aria-label="Đọc theo câu mẫu">
        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <span>
            Câu {idx + 1}/{total}
          </span>
          <ProgressBar value={((idx + 1) / total) * 100} className="max-w-48 flex-1" />
        </div>

        <div className="space-y-2 text-center">
          <p lang="en" className="text-2xl font-bold leading-snug md:text-3xl">
            {sentence.text}
          </p>
          <p className="text-muted">{sentence.vi}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {ttsSupported && (
            <>
              <button type="button" onClick={() => speak(sentence.text, MODEL_RATE)} className="btn-ghost">
                Nghe mẫu
              </button>
              <button type="button" onClick={() => speak(sentence.text, SLOW_RATE)} className="btn-ghost">
                Nghe chậm
              </button>
            </>
          )}
          <RecordButton
            listening={recording}
            busy={mic.busy}
            busyLabel={mic.busyLabel}
            disabled={!canRecord}
            idleLabel={current ? "Nói lại" : "Bấm và đọc to"}
            onClick={record}
          />
        </div>

        <p className="min-h-5 text-center text-sm text-muted" aria-live="polite">
          {pron.available
            ? pronouncePhaseLabel(pron.phase)
            : recognition.listening && (
                <>
                  {listenLabel(recognition)} {recognition.live && <span lang="en" className="text-fg">“{recognition.live}”</span>}
                </>
              )}
        </p>
        {(pron.error || recognition.error || notice) && (
          <p role="alert" className={`rounded-xl p-3 text-sm ${pron.error || recognition.error ? "bg-danger-soft" : "bg-warning-soft"}`}>
            {pron.error ?? recognition.error ?? notice}
          </p>
        )}

        {current && !recording && <AttemptResult score={current} onSpeakWord={(w) => speak(w, MODEL_RATE)} recording={pron.lastRecording} />}

        <div className="flex items-center justify-between border-t border-line pt-4">
          <button type="button" onClick={() => go(-1)} disabled={idx === 0} className="btn-ghost">
            <ChevronLeft className="size-4" /> Câu trước
          </button>
          <button type="button" onClick={() => go(1)} disabled={idx === total - 1} className="btn-ghost">
            Câu sau <ChevronRight className="size-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function SetPicker({
  exercise,
  savedBest,
  onChoose,
}: {
  exercise: DictationExercise;
  savedBest?: number;
  onChoose: (id: string) => void;
}) {
  const groups = useMemo(() => {
    const byLevel = new Map<string, DictationExercise[]>();
    for (const d of DICTATIONS) byLevel.set(d.level, [...(byLevel.get(d.level) ?? []), d]);
    return [...byLevel.entries()];
  }, []);

  return (
    <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:p-5">
      <label className="flex flex-1 flex-col gap-1 text-sm">
        <span className="font-semibold text-muted">Bộ câu (lấy từ bài Nghe &amp; chép)</span>
        <select value={exercise.id} onChange={(e) => onChoose(e.target.value)} className="rounded-lg border border-line bg-surface px-3 py-2 text-fg">
          {groups.map(([level, list]) => (
            <optgroup key={level} label={level}>
              {list.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-3 text-sm text-muted">
        <LevelBadge level={exercise.level} />
        {savedBest !== undefined && (
          <span>
            Điểm cao nhất: <b className="text-fg">{savedBest}%</b>
          </span>
        )}
      </div>
    </div>
  );
}

function AttemptResult({ score, onSpeakWord, recording }: { score: SentenceScore; onSpeakWord: (word: string) => void; recording: string | null }) {
  const { last } = score;
  if (score.sounds) {
    return (
      <div className="space-y-3 rounded-2xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ScoreBadge score={last.score} label={last.passed ? "Đạt" : "Chưa đạt"} />
          {score.best > last.score && <span className="text-sm text-muted">Tốt nhất câu này: {score.best}%</span>}
        </div>
        <PronounceFeedback result={score.sounds} onSpeak={onSpeakWord} recording={recording} />
      </div>
    );
  }
  return (
    <div className="space-y-3 rounded-2xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ScoreBadge score={last.score} label={last.passed ? "Đạt" : "Chưa đạt"} />
        {score.best > last.score && <span className="text-sm text-muted">Tốt nhất câu này: {score.best}%</span>}
      </div>
      <p className="flex flex-wrap gap-1.5" lang="en">
        {last.check.words.map((w, i) => {
          const heardAs = w.typed && w.status !== "correct" ? `, máy nghe thành “${w.typed}”` : "";
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSpeakWord(bareWord(w.display))}
              aria-label={`${w.display}: ${WORD_HINT[w.status]}${heardAs}. Bấm để nghe từ này`}
              title={`${WORD_HINT[w.status]}${heardAs}`}
              className={`rounded-lg px-2 py-1 text-lg font-semibold ${WORD_STYLE[w.status]}`}
            >
              {w.display}
            </button>
          );
        })}
      </p>
      <p className="text-sm text-muted">
        Máy nghe được: <span lang="en" className="text-fg">“{last.heard}”</span>
      </p>
      {last.check.extras.length > 0 && (
        <p className="text-sm text-muted">
          Từ thừa: <span lang="en">{last.check.extras.join(", ")}</span>
        </p>
      )}
    </div>
  );
}
