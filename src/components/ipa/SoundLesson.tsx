"use client";

/**
 * Bài học phát âm một âm IPA theo 3 bước — Nghe & quan sát → Đọc theo → Nghe phân biệt.
 * Xong cả 3 bước thì app tự ghi nhận (lộ trình tự tích bài "Phát âm"); người học luôn thấy mình đang ở bước nào và còn thiếu gì.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Ear, RotateCcw, Snail, Volume2, XCircle } from "lucide-react";
import { IPA_GROUP_INFO, IPA_SOUNDS, type IpaExample, type IpaSound } from "@/content/ipa";
import { LISTEN_PASS_PERCENT, LISTEN_ROUNDS, buildListenRounds, listenPercent, wordDone, type ListenRound, type WordAttempt } from "@/core/ipa-lesson";
import { READ_ALOUD_PASS, scoreReadAloud } from "@/core/speaking";
import { useIpaSoundPlayer } from "@/lib/ipa-player";
import { getProgressState, progressActions } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { usePronounceCheck } from "@/lib/pronounce-client";
import { ipaCarrier, type PronounceResult } from "@/lib/pronounce";
import { checkTaughtSound, type TaughtSoundCheck } from "@/lib/pronounce-ipa";
import { PronounceFeedback } from "@/components/speaking/PronounceFeedback";
import { MicLevel } from "@/components/speaking/MicLevel";
import { useSpeechRecognition } from "@/lib/speech-recognition";
import { RecordButton } from "@/components/speaking/RecordButton";
import { scoreTone } from "@/components/speaking/ScoreBadge";
import { ActivityResult } from "@/components/lesson/ActivityResult";

type Step = 1 | 2 | 3 | "done";
const STEPS = ["Nghe & quan sát", "Đọc theo", "Nghe phân biệt"] as const;
const LESSON_XP = 10;

export function SoundLesson({ sound }: { sound: IpaSound }) {
  const speech = useSpeech({ storageKey: "engquiz:voice-ipa-us" });
  const preload = useMemo(() => [sound], [sound]);
  const play = useIpaSoundPlayer(speech.speak, preload);
  const [step, setStep] = useState<Step>(1);
  const [listenScore, setListenScore] = useState(0);
  const [gainedXp, setGainedXp] = useState(0);
  const info = IPA_GROUP_INFO[sound.group];

  function finish(percent: number) {
    setListenScore(percent);
    const before = getProgressState("en").xp;
    progressActions.markSound(sound.id);
    progressActions.addXp(LESSON_XP);
    setGainedXp(getProgressState("en").xp - before);
    setStep("done");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/ipa" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Bảng IPA
      </Link>
      <header className="flex items-center gap-4">
        <span className={`grid size-16 shrink-0 place-items-center rounded-2xl font-ipa text-3xl font-semibold ring-1 ${info.cell}`}>{sound.symbol}</span>
        <div>
          <span className={`chip ${info.cell} ring-0`}>{info.label}</span>
          <h1 className="mt-1 text-2xl font-extrabold">Bài phát âm /{sound.symbol}/</h1>
        </div>
      </header>

      <Stepper step={step} />

      {step === 1 && <ObserveStep sound={sound} onPlay={() => play(sound)} onNext={() => setStep(2)} />}
      {step === 2 && <RepeatStep sound={sound} speak={speech.speak} onNext={() => setStep(3)} />}
      {step === 3 && <ListenStep sound={sound} speak={speech.speak} onPass={finish} />}
      {step === "done" && <DoneCard sound={sound} percent={listenScore} xp={gainedXp} onRetry={() => setStep(1)} />}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const current = step === "done" ? STEPS.length + 1 : step;
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Các bước của bài">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="space-y-1.5">
            <div className={`h-1.5 rounded-full ${done ? "bg-success" : active ? "bg-primary" : "bg-line"}`} />
            <div className={`flex items-center gap-1 text-xs font-semibold ${active ? "text-primary" : done ? "text-success" : "text-muted"}`}>
              {done ? <Check className="size-3.5" /> : <span>{n}.</span>} {label}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- Bước 1: nghe âm, xem khẩu hình ---------------- */

function ObserveStep({ sound, onPlay, onNext }: { sound: IpaSound; onPlay: () => void; onNext: () => void }) {
  const [plays, setPlays] = useState(0);
  return (
    <section className="card space-y-4 p-5 md:p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <button
          type="button"
          onClick={() => {
            onPlay();
            setPlays((n) => n + 1);
          }}
          className="btn-primary px-6 py-3 text-base"
        >
          <Volume2 className="size-5" /> Nghe âm /{sound.symbol}/
        </button>
        <span className="text-xs text-muted">{plays ? `Đã nghe ${plays} lần — nghe thêm vài lần và đọc theo khẽ` : "Bấm nghe âm ít nhất một lần để sang bước tiếp"}</span>
      </div>
      <div className="rounded-2xl bg-surface-2 p-4">
        <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">Cách đặt môi, lưỡi</h2>
        <p className="leading-relaxed">{sound.guide}</p>
        {sound.viLike && (
          <p className="mt-2 text-sm">
            🇻🇳 <b>Gần giống:</b> {sound.viLike}
          </p>
        )}
      </div>
      {sound.tip && (
        <p className="flex gap-2 rounded-2xl border border-warning/30 bg-warning-soft p-3 text-sm leading-relaxed">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /> {sound.tip}
        </p>
      )}
      {sound.us && <p className="rounded-2xl border border-line p-3 text-sm text-muted">🇺🇸 {sound.us}</p>}
      <div className="flex justify-end">
        <button type="button" onClick={onNext} disabled={!plays} className="btn-primary">
          Tiếp: đọc theo <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

/* ---------------- Bước 2: đọc theo từ ví dụ (máy chấm) ---------------- */

function RepeatStep({ sound, speak, onNext }: { sound: IpaSound; speak: (t: string, r?: number) => void; onNext: () => void }) {
  const recognition = useSpeechRecognition();
  // Đã đăng nhập: chấm tới từng âm trên máy chủ; còn lại dùng nhận dạng giọng nói của trình duyệt.
  const pron = usePronounceCheck();
  const canRecord = pron.available || recognition.status === "ready";
  const recording = pron.available ? pron.busy : recognition.listening;
  const [attempts, setAttempts] = useState<Record<string, WordAttempt>>({});
  const [feedback, setFeedback] = useState<Record<string, { result: PronounceResult; taught: TaughtSoundCheck }>>({});
  const [heardFor, setHeardFor] = useState<Record<string, true>>({});
  const [active, setActive] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Không có micro / trình duyệt không nhận dạng được: bước này chỉ yêu cầu nghe từng từ.
  const isDone = (w: string) => (canRecord ? wordDone(attempts[w], READ_ALOUD_PASS) : !!heardFor[w]);
  const allDone = sound.examples.every((e) => isDone(e.word));

  function hear(word: string, rate: number) {
    speak(word, rate);
    setHeardFor((h) => ({ ...h, [word]: true }));
  }

  const addAttempt = (word: string, score: number) =>
    setAttempts((a) => ({ ...a, [word]: { best: Math.max(a[word]?.best ?? 0, score), tries: (a[word]?.tries ?? 0) + 1, last: score } }));

  async function record(word: string) {
    setActive(word);
    setNotice(null);
    if (pron.available) {
      if (pron.busy) return pron.stop();
      // Đọc từ trong câu khung (chấm chính xác hơn đọc trơ một từ), chỉ xét âm đang học.
      const result = await pron.check(ipaCarrier(word), "ipa", word);
      if (!result) return;
      const taught = checkTaughtSound(result, word, sound.symbol);
      setFeedback((f) => ({ ...f, [word]: { result, taught } }));
      return addAttempt(word, taughtScore(result, taught));
    }
    if (recognition.listening) return recognition.stop();
    const result = await recognition.listen({ continuous: false, expected: [word] });
    if (!result) return setNotice("Chưa nghe được gì. Bấm nút, chờ chữ “Đang nghe…” rồi đọc to từ đó.");
    addAttempt(word, scoreReadAloud(word, result.alternatives).score);
  }

  return (
    <section className="card space-y-4 p-5 md:p-6">
      <p className="text-sm text-muted">
        {canRecord
          ? "Nghe từng từ rồi bấm micro đọc to."
          : "Nghe từng từ và đọc to theo (cần Chrome hoặc Edge để máy chấm)."}
      </p>
      <ul className="space-y-2">
        {sound.examples.map((e) => (
          <WordRow
            key={e.word}
            e={e}
            symbol={sound.symbol}
            attempt={attempts[e.word]}
            done={isDone(e.word)}
            canRecord={canRecord}
            listening={recording && active === e.word}
            disabled={recording && active !== e.word}
            onHear={(rate) => hear(e.word, rate)}
            onRecord={() => record(e.word)}
            feedback={feedback[e.word]}
            recordingUrl={pron.lastRecording}
            onSpeak={(t) => speak(t, 0.85)}
            carrier={pron.available ? ipaCarrier(e.word) : undefined}
            onHearCarrier={() => speak(ipaCarrier(e.word), 0.85)}
          />
        ))}
      </ul>
      {pron.available ? (
        pron.phase !== "idle" && (
          <div className="flex items-center gap-3 text-sm text-muted">
            {pron.phase === "scoring" ? "Đang chấm…" : pron.phase === "recording" ? "Đang nghe…" : "Chuẩn bị…"}
            {pron.phase === "recording" && <MicLevel level={pron.level} />}
          </div>
        )
      ) : (
        recognition.listening && <p className="text-sm text-muted">{recognition.ready ? "Đang nghe…" : "Chuẩn bị…"} {recognition.live}</p>
      )}
      {(notice || pron.error || recognition.error) && <p className="text-sm text-danger">{notice ?? pron.error ?? recognition.error}</p>}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">
          {sound.examples.filter((e) => isDone(e.word)).length}/{sound.examples.length} từ
        </span>
        <button type="button" onClick={onNext} disabled={!allDone} className="btn-primary">
          Tiếp: nghe phân biệt <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

function WordRow(props: {
  e: IpaExample;
  symbol: string;
  attempt?: WordAttempt;
  done: boolean;
  canRecord: boolean;
  listening: boolean;
  disabled: boolean;
  onHear: (rate: number) => void;
  onRecord: () => void;
  feedback?: { result: PronounceResult; taught: TaughtSoundCheck };
  recordingUrl: string | null;
  onSpeak: (text: string) => void;
  /** Câu cần đọc khi chấm từng âm (vd "Say sheep now."). */
  carrier?: string;
  onHearCarrier: () => void;
}) {
  const { e, symbol, attempt, done, canRecord } = props;
  const i = e.ipa.indexOf(symbol);
  return (
    <li className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 ${done ? "border-success/40 bg-success/5" : "border-line"}`}>
      <button type="button" onClick={() => props.onHear(0.85)} className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-fg" aria-label={`Nghe ${e.word}`}>
        <Volume2 className="size-5" />
      </button>
      <button type="button" onClick={() => props.onHear(0.5)} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted hover:text-fg" aria-label={`Nghe chậm ${e.word}`}>
        <Snail className="size-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-semibold" lang="en">
            {e.word}
          </span>
          <span className="font-ipa text-sm text-muted">
            {i < 0 ? e.ipa : (
              <>
                {e.ipa.slice(0, i)}
                <b className="rounded bg-primary-soft px-0.5 text-primary">{symbol}</b>
                {e.ipa.slice(i + symbol.length)}
              </>
            )}
          </span>
        </div>
        <div className="text-xs text-muted">{e.vi}</div>
        {props.carrier && (
          <button type="button" onClick={props.onHearCarrier} lang="en" className="mt-0.5 inline-flex items-center gap-1 text-sm text-primary">
            <Volume2 className="size-3.5" /> {props.carrier}
          </button>
        )}
      </div>
      {attempt && <span className={`rounded-lg px-2 py-1 text-sm font-bold ${scoreTone(attempt.last ?? attempt.best)}`}>{attempt.last ?? attempt.best}%</span>}
      {done && <CheckCircle2 className="size-5 text-success" aria-label="Xong" />}
      {canRecord && (
        // Điện thoại: nút ghi âm xuống hàng riêng, rộng hết dòng (để không đè lên chữ).
        <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
          <RecordButton listening={props.listening} disabled={props.disabled} idleLabel={attempt ? "Đọc lại" : "Đọc"} listeningLabel="Dừng" onClick={props.onRecord} />
        </div>
      )}
      {props.feedback && (
        <div className="w-full">
          <PronounceFeedback result={props.feedback.result} onlyWord={e.word} onSpeak={props.onSpeak} recording={props.recordingUrl} />
        </div>
      )}
    </li>
  );
}

/* ---------------- Bước 3: nghe phân biệt ---------------- */

function ListenStep({ sound, speak, onPass }: { sound: IpaSound; speak: (t: string, r?: number) => void; onPass: (percent: number) => void }) {
  const [rounds, setRounds] = useState<ListenRound[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<0 | 1 | null>(null);
  const [correct, setCorrect] = useState(0);

  function start() {
    const next = buildListenRounds(sound);
    setRounds(next);
    setI(0);
    setPicked(null);
    setCorrect(0);
    speak(next[0].options[next[0].answer].word, 0.8);
  }

  if (!rounds) {
    return (
      <section className="card space-y-4 p-6 text-center">
        <Ear className="mx-auto size-10 text-primary" />
        <p>
          Máy đọc một từ, bạn chọn đúng từ vừa nghe. {LISTEN_ROUNDS} vòng, đúng từ {LISTEN_PASS_PERCENT}% là hoàn thành bài.
        </p>
        <button type="button" onClick={start} className="btn-primary mx-auto">
          Bắt đầu nghe
        </button>
      </section>
    );
  }

  const finished = i >= rounds.length;
  if (finished) {
    const percent = listenPercent(correct, rounds.length);
    const passed = percent >= LISTEN_PASS_PERCENT;
    return (
      <section className="card space-y-4 p-6 text-center" role="status">
        <p className="text-3xl font-extrabold">{percent}%</p>
        <p className="text-muted">
          Đúng {correct}/{rounds.length} vòng. {passed ? "Bạn đã phân biệt được âm này!" : `Cần từ ${LISTEN_PASS_PERCENT}% — nghe lại từ ví dụ ở bước 1, 2 rồi thử lại.`}
        </p>
        {passed ? (
          <button type="button" onClick={() => onPass(percent)} className="btn-primary mx-auto">
            Hoàn thành bài <ArrowRight className="size-4" />
          </button>
        ) : (
          <button type="button" onClick={start} className="btn-primary mx-auto">
            <RotateCcw className="size-4" /> Làm lại
          </button>
        )}
      </section>
    );
  }

  const round = rounds[i];
  const target = round.options[round.answer];
  function pick(c: 0 | 1) {
    if (picked !== null) return;
    setPicked(c);
    if (c === round.answer) setCorrect((n) => n + 1);
  }
  function next() {
    const n = i + 1;
    setI(n);
    setPicked(null);
    if (rounds && n < rounds.length) speak(rounds[n].options[rounds[n].answer].word, 0.8);
  }

  return (
    <section className="card space-y-5 p-5 md:p-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Vòng {i + 1}/{rounds.length}
        </span>
        <span>Đúng {correct}</span>
      </div>
      <div className="text-center">
        <button type="button" onClick={() => speak(target.word, 0.8)} className="btn-ghost">
          <Volume2 className="size-4" /> Nghe lại
        </button>
        <p className="mt-2 font-semibold">Bạn vừa nghe từ nào?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {round.options.map((o, k) => {
          const state = picked === null ? "" : k === round.answer ? "border-success bg-success/10" : k === picked ? "border-danger bg-danger-soft" : "opacity-60";
          return (
            <button
              key={o.word}
              type="button"
              onClick={() => pick(k as 0 | 1)}
              disabled={picked !== null}
              className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 border-line p-4 transition ${state}`}
            >
              <span className="text-xl font-bold" lang="en">
                {o.word}
              </span>
              <span className="font-ipa text-sm text-muted">{o.ipa}</span>
              <span className="text-xs text-muted">{o.vi}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="flex items-center justify-between gap-2" role="status">
          <span className={`flex items-center gap-1.5 font-semibold ${picked === round.answer ? "text-success" : "text-danger"}`}>
            {picked === round.answer ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {picked === round.answer ? "Chính xác!" : `Từ đọc lên là “${target.word}”`}
          </span>
          <button type="button" onClick={next} className="btn-primary">
            Tiếp <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </section>
  );
}

/* ---------------- Hoàn thành ---------------- */

function DoneCard({ sound, percent, xp, onRetry }: { sound: IpaSound; percent: number; xp: number; onRetry: () => void }) {
  const idx = IPA_SOUNDS.findIndex((s) => s.id === sound.id);
  const next = IPA_SOUNDS[(idx + 1) % IPA_SOUNDS.length];
  return (
    <ActivityResult
      passed
      percent={percent}
      xp={xp}
      onRetry={onRetry}
      next={{ label: `Âm tiếp theo /${next.symbol}/`, href: `/ipa/${next.id}` }}
      secondary={{ label: "Bảng IPA", href: "/ipa" }}
    />
  );
}

/** Điểm một lượt đọc từ IPA: âm đang học đúng → ít nhất mức đạt; sai → dưới mức đạt. */
function taughtScore(result: PronounceResult, taught: TaughtSoundCheck): number {
  const score = Math.round(result.score);
  return taught.ok ? Math.max(score, READ_ALOUD_PASS) : Math.min(score, READ_ALOUD_PASS - 1);
}
