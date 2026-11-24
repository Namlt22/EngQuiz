"use client";

/**
 * Bài hội thoại: nghe cả bài (hai nhân vật hai cao độ giọng), nghe từng câu, và NHẬP VAI —
 * người học chọn một nhân vật; câu của nhân vật kia máy tự đọc, câu của mình thì người học nói và được chấm từng từ.
 */
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Eye, Languages, Pause, Play, Theater } from "lucide-react";
import type { Dialogue } from "@/content/types";
import { scoreReadAloud, type ReadAloudResult } from "@/core/speaking";
import { progressActions } from "@/lib/progress";
import { SPEECH_ERROR_NOTICE, useSpeech } from "@/lib/speech";
import { listenLabel, useSpeechRecognition } from "@/lib/speech-recognition";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { RecordButton } from "@/components/speaking/RecordButton";
import { ScoreBadge } from "@/components/speaking/ScoreBadge";
import { LessonQuiz } from "./LessonQuiz";
import { SelectionSave } from "@/components/notebook/SelectionSave";

const LINE_RATE = 0.9;
/** Cao độ giọng của hai nhân vật — cùng một giọng máy nhưng nghe ra hai người. */
const SPEAKER_PITCH: [number, number] = [1.15, 0.85];
const BUBBLE: [string, string] = ["bg-primary-soft", "bg-surface-2"];

type Mode = "listen" | "roleplay";

export function DialoguePlayer({ dialogue }: { dialogue: Dialogue }) {
  const [mode, setMode] = useState<Mode>("listen");
  const [showVi, setShowVi] = useState(true);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/dialogues" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Tất cả hội thoại
      </Link>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={dialogue.level} />
          <span className="chip bg-surface-2 text-muted">{dialogue.speakers.join(" & ")}</span>
        </div>
        <h1 className="text-2xl font-extrabold md:text-3xl">{dialogue.title}</h1>
        <p className="text-muted">{dialogue.situation}</p>
      </header>

      <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Cách học">
        {(
          [
            ["listen", "Nghe & đọc", "Nghe cả bài hoặc từng câu", Play],
            ["roleplay", "Nhập vai", "Bạn nói lời một nhân vật", Theater],
          ] as const
        ).map(([id, label, hint, Icon]) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
              mode === id ? "border-primary bg-primary-soft" : "border-line bg-surface hover:border-primary/50"
            }`}
          >
            <Icon className={`size-6 shrink-0 ${mode === id ? "text-primary" : "text-muted"}`} />
            <span>
              <span className="block font-bold">{label}</span>
              <span className="text-sm text-muted">{hint}</span>
            </span>
          </button>
        ))}
      </div>

      {mode === "listen" ? <ListenMode dialogue={dialogue} showVi={showVi} onToggleVi={() => setShowVi((v) => !v)} /> : <RolePlay dialogue={dialogue} />}

      <section className="card space-y-3 p-5">
        <h2 className="text-lg font-bold">Mẫu câu nên thuộc</h2>
        <ul className="space-y-2">
          {dialogue.phrases.map((p) => (
            <li key={p.en} className="flex items-center gap-2 rounded-xl bg-surface-2 p-2.5 text-sm">
              <SpeakButton text={p.en} rate={0.85} />
              <span>
                <b lang="en">{p.en}</b> — {p.vi}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <LessonQuiz
        title="Bài tập hội thoại"
        questions={dialogue.questions}
        onFinish={({ percent, correct, total }) => progressActions.recordDialogue(dialogue.id, percent, correct, total)}
      />
    </div>
  );
}

/* ---------------- Nghe & đọc ---------------- */

function ListenMode({ dialogue, showVi, onToggleVi }: { dialogue: Dialogue; showVi: boolean; onToggleVi: () => void }) {
  const { speak, stop, supported } = useSpeech();
  const [playing, setPlaying] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const runRef = useRef(0);
  const fail = (run: number) => () => {
    if (run !== runRef.current) return;
    setPlaying(null);
    setNotice(SPEECH_ERROR_NOTICE);
  };

  function playFrom(i: number, run: number) {
    if (run !== runRef.current) return;
    const line = dialogue.lines[i];
    if (!line) return setPlaying(null);
    setPlaying(i);
    setNotice(null);
    speak(line.en, LINE_RATE, { pitch: SPEAKER_PITCH[line.speaker], speaker: line.speaker, onEnd: () => playFrom(i + 1, run), onError: fail(run) });
  }

  function toggleAll() {
    runRef.current++;
    if (playing !== null) {
      stop();
      return setPlaying(null);
    }
    playFrom(0, runRef.current);
  }

  function playOne(i: number) {
    runRef.current++;
    setPlaying(i);
    const line = dialogue.lines[i];
    const run = runRef.current;
    setNotice(null);
    speak(line.en, LINE_RATE, { pitch: SPEAKER_PITCH[line.speaker], speaker: line.speaker, onEnd: () => run === runRef.current && setPlaying(null), onError: fail(run) });
  }

  return (
    <section className="card space-y-4 p-4 md:p-6" aria-label="Lời thoại">
      <div className="flex flex-wrap gap-2">
        {supported && (
          <button type="button" onClick={toggleAll} className="btn-primary">
            {playing !== null ? <Pause className="size-4" /> : <Play className="size-4" />}
            {playing !== null ? "Dừng" : "Nghe cả bài"}
          </button>
        )}
        <button type="button" onClick={onToggleVi} aria-pressed={showVi} className="btn-ghost">
          <Languages className="size-4" /> {showVi ? "Ẩn bản dịch" : "Hiện bản dịch"}
        </button>
      </div>
      {notice && (
        <p role="alert" className="text-sm text-danger">
          {notice}
        </p>
      )}
      <SelectionSave course="en" source={`dialogue:${dialogue.id}`}>
      <ol className="space-y-3">
        {dialogue.lines.map((line, i) => (
          <li key={i} className={`flex gap-2 ${line.speaker === 1 ? "flex-row-reverse text-right" : ""}`}>
            <button
              type="button"
              onClick={() => playOne(i)}
              disabled={!supported}
              className={`max-w-[85%] rounded-2xl p-3 text-left transition ${BUBBLE[line.speaker]} ${playing === i ? "ring-2 ring-primary" : "hover:brightness-95"}`}
              aria-label={`Nghe câu của ${dialogue.speakers[line.speaker]}`}
            >
              <span className="block text-xs font-semibold text-muted">{dialogue.speakers[line.speaker]}</span>
              <span lang="en" className="block select-text leading-relaxed">
                {line.en}
              </span>
              {showVi && <span className="mt-0.5 block text-sm text-muted">{line.vi}</span>}
            </button>
          </li>
        ))}
      </ol>
      </SelectionSave>
    </section>
  );
}

/* ---------------- Nhập vai ---------------- */

interface Turn {
  result: ReadAloudResult;
  best: number;
}

const NO_SPEECH = "Chưa nghe được gì. Bấm nút, chờ chữ “Đang nghe…” rồi nói to cả câu.";

function RolePlay({ dialogue }: { dialogue: Dialogue }) {
  const [role, setRole] = useState<0 | 1 | null>(null);
  const [idx, setIdx] = useState(0);
  const [turns, setTurns] = useState<Record<number, Turn>>({});
  const [peek, setPeek] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { speak, stop, supported: ttsSupported } = useSpeech();
  const recognition = useSpeechRecognition();
  const attemptRef = useRef(0);

  const line = dialogue.lines[idx];
  const finished = idx >= dialogue.lines.length;
  const mine = role !== null && line?.speaker === role;
  const myLines = dialogue.lines.map((l, i) => [l, i] as const).filter(([l]) => l.speaker === role);
  const average = myLines.length ? Math.round(myLines.reduce((s, [, i]) => s + (turns[i]?.best ?? 0), 0) / myLines.length) : 0;

  /** Sang câu i; nếu là lời của nhân vật kia thì máy đọc rồi tự sang câu sau. */
  function goTo(i: number, who: 0 | 1 | null = role) {
    attemptRef.current++;
    recognition.cancel();
    setNotice(null);
    setPeek(false);
    setIdx(i);
    const next = dialogue.lines[i];
    if (!next || who === null || next.speaker === who) {
      stop(); // bấm "Tiếp" khi máy đang đọc dở: dừng hẳn để micro không thu lại tiếng máy
      return;
    }
    const attempt = attemptRef.current;
    if (!ttsSupported) return;
    speak(next.en, LINE_RATE, {
      pitch: SPEAKER_PITCH[next.speaker],
      speaker: next.speaker,
      onEnd: () => attempt === attemptRef.current && goTo(i + 1, who),
      // Không đọc được lời nhân vật kia: dừng tự chuyển câu, người học đọc chữ rồi bấm "Tiếp".
      onError: () => attempt === attemptRef.current && setNotice(SPEECH_ERROR_NOTICE),
    });
  }

  function start(r: 0 | 1) {
    setRole(r);
    setTurns({});
    goTo(0, r);
  }

  async function record() {
    if (recognition.listening) return recognition.stop();
    const attempt = ++attemptRef.current;
    const at = { idx, text: line.en };
    setNotice(null);
    const heard = await recognition.listen({ continuous: false, expected: [line.en] });
    if (attempt !== attemptRef.current) return;
    if (!heard) return setNotice(NO_SPEECH);
    const result = scoreReadAloud(at.text, heard.alternatives);
    setTurns((prev) => ({ ...prev, [at.idx]: { result, best: Math.max(prev[at.idx]?.best ?? 0, result.score) } }));
  }

  if (recognition.status !== "ready") {
    return (
      <p className="card p-5 text-sm text-muted">
        Nhập vai cần micro và nhận dạng giọng nói — hãy mở trang bằng <b>Chrome</b>, <b>Edge</b> hoặc <b>Safari</b> qua https://.
      </p>
    );
  }

  if (role === null) {
    return (
      <section className="card space-y-4 p-5 text-center">
        <h2 className="text-lg font-bold">Bạn muốn nói lời của ai?</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {dialogue.speakers.map((name, i) => (
            <button key={name} type="button" onClick={() => start(i as 0 | 1)} className="btn-primary">
              {name}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (finished) {
    return (
      <section className="card animate-pop-in space-y-4 p-6 text-center" role="status">
        <ScoreBadge score={average} label="điểm nói trung bình" />
        <p className="text-muted">
          Bạn đã nói {myLines.filter(([, i]) => turns[i]).length}/{myLines.length} câu của {dialogue.speakers[role]}.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => start(role)} className="btn-ghost">
            Nhập vai lại
          </button>
          <button type="button" onClick={() => start(role === 0 ? 1 : 0)} className="btn-primary">
            Đổi vai: {dialogue.speakers[role === 0 ? 1 : 0]}
          </button>
        </div>
      </section>
    );
  }

  const turn = turns[idx];
  return (
    <section className="card space-y-5 p-5 md:p-6" aria-label="Nhập vai">
      <p className="text-sm text-muted">
        Câu {idx + 1}/{dialogue.lines.length} · Bạn là <b className="text-fg">{dialogue.speakers[role]}</b>
      </p>

      <div className={`rounded-2xl p-4 ${BUBBLE[line.speaker]}`}>
        <p className="text-xs font-semibold text-muted">{dialogue.speakers[line.speaker]}</p>
        {mine && !peek && !turn ? (
          <p className="mt-1 text-lg font-semibold">{line.vi}</p>
        ) : (
          <>
            <p lang="en" className="mt-1 text-lg font-semibold">
              {line.en}
            </p>
            <p className="text-sm text-muted">{line.vi}</p>
          </>
        )}
      </div>

      {mine ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <RecordButton listening={recognition.listening} busy={recognition.recognizing} idleLabel={turn ? "Nói lại" : "Bấm và nói"} onClick={record} />
            {!peek && !turn && (
              <button type="button" onClick={() => setPeek(true)} className="btn-ghost">
                <Eye className="size-4" /> Xem câu gốc
              </button>
            )}
            {ttsSupported && (turn || peek) && (
              <button type="button" onClick={() => speak(line.en, 0.8)} className="btn-ghost">
                Nghe mẫu
              </button>
            )}
          </div>
          {recognition.listening && <p className="text-sm text-muted">{listenLabel(recognition)} {recognition.live}</p>}
          {notice && <p className="text-sm text-danger">{notice}</p>}
          {recognition.error && <p className="text-sm text-danger">{recognition.error}</p>}
          {turn && (
            <div className="animate-pop-in space-y-1" role="status">
              <ScoreBadge score={turn.result.score} label={turn.result.passed ? "Tốt lắm!" : "Thử nói lại nhé"} />
              <p className="text-sm text-muted">Máy nghe được: “{turn.result.heard}”</p>
            </div>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={() => goTo(idx + 1)} className={turn ? "btn-primary" : "btn-ghost"}>
              {turn ? "Câu tiếp" : "Bỏ qua"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={`text-sm ${notice ? "text-danger" : "text-muted"}`}>
            {notice ? `${notice} Đọc lời nhân vật kia rồi bấm Tiếp.` : ttsSupported ? "Máy đang đọc lời nhân vật kia…" : "Đọc lời nhân vật kia rồi bấm Tiếp."}
          </p>
          <button type="button" onClick={() => goTo(idx + 1)} className="btn-ghost">
            Tiếp
          </button>
        </div>
      )}
    </section>
  );
}
