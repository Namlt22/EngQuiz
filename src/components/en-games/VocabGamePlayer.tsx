"use client";

/**
 * Một ván game từ vựng tiếng Anh (5 kiểu). Không tự lưu: báo kết quả qua onFinish để nơi dùng quyết định
 * (game theo chủ đề, hay phần Từ vựng của một ngày trong khoá A1).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Volume2, XCircle } from "lucide-react";
import { buildVocabRound, checkWritten, shuffle, type GameWord, type VocabMode, type VocabQuestion } from "@/core/en-vocab-games";
import { useSpeech } from "@/lib/speech";
import { SessionHeader } from "@/components/ui/SessionHeader";

export interface WordResult {
  wordId: string;
  correct: boolean;
}

export const VOCAB_MODE_LABEL: Record<VocabMode, string> = {
  listen: "Nghe",
  choose: "Chọn nghĩa",
  fill: "Điền chỗ trống",
  match: "Nối từ",
  write: "Viết từ",
};

interface Props {
  words: GameWord[];
  mode: VocabMode;
  count?: number;
  onFinish: (results: WordResult[]) => void;
  onExit: () => void;
}

export function VocabGamePlayer({ words, mode, count = 10, onFinish, onExit }: Props) {
  const [questions] = useState(() => buildVocabRound(mode, words, count));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<WordResult[]>([]);
  const [answered, setAnswered] = useState(false);
  const { speak } = useSpeech();
  // `speak` đổi danh tính khi danh sách giọng tải xong; giữ bản mới nhất để không đọc lặp.
  const speakRef = useRef(speak);
  speakRef.current = speak;

  const q = questions[index];
  const total = mode === "match" ? questions.length * 5 : questions.length;
  const done = mode === "match" ? results.length : index;

  useEffect(() => {
    if (q && (q.mode === "listen" || q.mode === "write")) speakRef.current(q.word.word, 0.85);
  }, [q]);

  const answer = useCallback((r: WordResult[]) => {
    setResults((prev) => [...prev, ...r]);
    setAnswered(true);
  }, []);

  const next = useCallback(() => {
    if (index + 1 >= questions.length) return onFinish(results);
    setIndex((i) => i + 1);
    setAnswered(false);
  }, [index, questions.length, onFinish, results]);

  useEffect(() => {
    if (!answered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, next]);

  if (!q) return null;
  const last = results[results.length - 1];

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-32">
      <SessionHeader current={Math.min(done + 1, total)} total={total} value={total ? (done / total) * 100 : 0} onExit={onExit} />

      <div key={index} className="animate-pop-in">
        {q.mode === "match" ? (
          <MatchBoard q={q} onDone={answer} />
        ) : q.mode === "write" ? (
          <WriteQuestion q={q} answered={answered} onAnswer={(ok) => answer([{ wordId: q.word.id, correct: ok }])} onSpeak={speak} />
        ) : (
          <ChoiceQuestion q={q} answered={answered} onAnswer={(ok) => answer([{ wordId: q.word.id, correct: ok }])} onSpeak={speak} />
        )}
      </div>

      {answered && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
            {q.mode !== "match" &&
              (last?.correct ? (
                <CheckCircle2 className="size-7 text-success" aria-label="Đúng" />
              ) : (
                <p className="flex items-center gap-2 font-semibold text-danger">
                  <XCircle className="size-6 shrink-0" />
                  <span className="text-fg">
                    <b lang="en">{q.word.word}</b> · {q.word.vi}
                  </span>
                </p>
              ))}
            <button type="button" onClick={next} className="btn-primary ml-auto" autoFocus>
              Tiếp <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type OptionState = "idle" | "correct" | "wrong" | "dim";

function OptionTile({ state, children, ...rest }: { state: OptionState } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    idle: "border-line bg-surface hover:border-primary/50 hover:bg-surface-2",
    correct: "border-success bg-success-soft text-success",
    wrong: "border-danger bg-danger-soft text-danger animate-shake",
    dim: "border-line bg-surface opacity-50",
  }[state];
  return (
    <button type="button" className={`w-full rounded-2xl border-2 px-4 py-3.5 text-left text-base font-semibold transition ${styles}`} {...rest}>
      {children}
    </button>
  );
}

function BigSpeaker({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto grid size-24 place-items-center rounded-full bg-primary text-primary-fg shadow-lg shadow-primary/30 transition hover:scale-105 active:scale-95"
      aria-label="Nghe lại"
    >
      <Volume2 className="size-10" />
    </button>
  );
}

function ChoiceQuestion({
  q,
  answered,
  onAnswer,
  onSpeak,
}: {
  q: Extract<VocabQuestion, { mode: "listen" | "choose" | "fill" }>;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
  onSpeak: (text: string, rate?: number) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  function pick(id: string) {
    if (answered) return;
    setPicked(id);
    onAnswer(id === q.word.id);
    if (q.mode !== "listen") onSpeak(q.word.word, 0.85);
  }

  useEffect(() => {
    if (answered) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) pick(q.options[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const stateOf = (id: string): OptionState => (!answered ? "idle" : id === q.word.id ? "correct" : id === picked ? "wrong" : "dim");

  return (
    <div className="space-y-6">
      <div className="text-center">
        {q.mode === "listen" && <BigSpeaker onClick={() => onSpeak(q.word.word, 0.85)} />}
        {q.mode === "choose" && (
          <>
            <h2 lang="en" className="text-4xl font-extrabold">
              {q.word.word}
            </h2>
            <p className="mt-1 font-mono text-muted">{q.word.ipa}</p>
          </>
        )}
        {q.mode === "fill" && (
          <p lang="en" className="text-xl font-semibold leading-relaxed md:text-2xl">
            {q.before}
            <span className={`mx-1 inline-block min-w-20 border-b-4 px-1 ${answered ? "border-success text-success" : "border-primary/60"}`}>
              {answered ? q.gap : " "}
            </span>
            {q.after}
          </p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <OptionTile key={o.id} state={stateOf(o.id)} disabled={answered} onClick={() => pick(o.id)}>
            <span className="mr-2 text-xs text-muted">{i + 1}</span>
            {q.mode === "choose" ? o.vi : <span lang="en">{o.word}</span>}
          </OptionTile>
        ))}
      </div>
    </div>
  );
}

function WriteQuestion({
  q,
  answered,
  onAnswer,
  onSpeak,
}: {
  q: Extract<VocabQuestion, { mode: "write" }>;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
  onSpeak: (text: string, rate?: number) => void;
}) {
  const [text, setText] = useState("");
  const ok = answered && checkWritten(text, q.word);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);

  return (
    <form
      className="space-y-6 text-center"
      onSubmit={(e) => {
        e.preventDefault();
        if (!answered && text.trim()) onAnswer(checkWritten(text, q.word));
      }}
    >
      <BigSpeaker onClick={() => onSpeak(q.word.word, 0.8)} />
      <p className="text-xl font-bold">{q.word.vi}</p>
      <input
        ref={input}
        lang="en"
        className={`input text-center text-2xl font-bold ${answered ? (ok ? "border-success text-success" : "border-danger text-danger") : ""}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={answered}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Từ bạn nghe được"
      />
      {!answered && (
        <button type="submit" className="btn-primary w-full" disabled={!text.trim()}>
          Kiểm tra
        </button>
      )}
    </form>
  );
}

function MatchBoard({ q, onDone }: { q: Extract<VocabQuestion, { mode: "match" }>; onDone: (r: WordResult[]) => void }) {
  const [left] = useState(() => shuffle(q.words));
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<string | null>(null);

  function chooseRight(id: string) {
    if (!selected || matched.has(id)) return;
    if (id === selected) {
      const m = new Set(matched).add(id);
      setMatched(m);
      setSelected(null);
      // Cặp nào nối sai ít nhất một lần thì tính là sai.
      if (m.size === q.words.length) onDone(q.words.map((w) => ({ wordId: w.id, correct: !missed.has(w.id) })));
    } else {
      setMissed(new Set(missed).add(selected));
      setFlash(id);
      setTimeout(() => setFlash(null), 400);
    }
  }

  const tile = (active: boolean, done: boolean, bad: boolean) =>
    `w-full rounded-2xl border-2 px-4 py-3 text-left font-semibold transition ${
      done
        ? "border-success bg-success-soft text-success opacity-70"
        : bad
          ? "border-danger bg-danger-soft text-danger animate-shake"
          : active
            ? "border-primary bg-primary-soft ring-2 ring-primary/30"
            : "border-line bg-surface hover:border-primary/50"
    }`;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        {left.map((w) => (
          <button key={w.id} type="button" lang="en" disabled={matched.has(w.id)} onClick={() => setSelected(w.id)} className={tile(selected === w.id, matched.has(w.id), false)}>
            {w.word}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {q.shuffledVi.map((w) => (
          <button key={w.id} type="button" disabled={matched.has(w.id)} onClick={() => chooseRight(w.id)} className={tile(false, matched.has(w.id), flash === w.id)}>
            {w.vi}
          </button>
        ))}
      </div>
    </div>
  );
}
