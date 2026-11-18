"use client";

/**
 * Một phiên ôn thẻ từ vựng tiếng Anh, 3 kiểu:
 *  - "word":    thấy từ → nhớ nghĩa → lật thẻ → tự chấm Quên / Nhớ / Dễ;
 *  - "meaning": thấy nghĩa tiếng Việt → nhớ từ tiếng Anh → lật thẻ → tự chấm;
 *  - "spell":   nghe từ + xem nghĩa → gõ lại từ; máy chấm (đúng = Nhớ, sai = Quên).
 * Thẻ "Quên" được đưa xuống cuối phiên để ôn lại một lần. Tiến độ lưu chung bộ hộp Leitner (src/core/srs.ts).
 */
import { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, Volume2, XCircle } from "lucide-react";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { EN_POS_LABEL, getEnWord } from "@/content/vocab-en";
import type { Grade } from "@/core/srs";
import { progressActions } from "@/lib/progress";
import { SaveWordButton } from "@/components/notebook/SaveWordButton";

export type EnCardMode = "word" | "meaning" | "spell";

/** So khớp từ gõ vào: không phân biệt hoa thường, bỏ khoảng trắng thừa, chấp nhận ’ thay cho '. */
export function sameSpelling(typed: string, word: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ");
  return norm(typed) === norm(word);
}

interface Props {
  queue: string[];
  mode: EnCardMode;
  speak: (text: string, rate?: number) => void;
  onExit: () => void;
}

export function EnFlashcardSession({ queue: initial, mode, speak, onExit }: Props) {
  const [queue, setQueue] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ again: 0, good: 0, easy: 0 });

  // Kiểu "Gõ từ": đọc to từ ngay khi thẻ mới hiện ra.
  useEffect(() => {
    if (mode === "spell" && i < queue.length) speak(queue[i], 0.85);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ đọc khi sang thẻ mới
  }, [i, mode]);

  if (i >= queue.length) {
    return (
      <section className="card space-y-4 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <h2 className="text-xl font-extrabold">Xong lượt ôn!</h2>
        <p className="text-muted">
          {queue.length} thẻ · Nhớ {stats.good} · Dễ {stats.easy} · Quên {stats.again}
        </p>
        <button type="button" onClick={onExit} className="btn-primary mx-auto">
          Về danh sách từ
        </button>
      </section>
    );
  }

  const word = queue[i];
  const entry = getEnWord(word);
  if (!entry) return null;
  const [, pos, ipa, vi, example] = entry;
  const revealed = flipped || checked !== null;

  function next(g: Grade) {
    progressActions.reviewWord(word, g);
    setStats((s) => ({ ...s, [g]: s[g] + 1 }));
    if (g === "again" && !requeued.has(word)) {
      setQueue((q) => [...q, word]);
      setRequeued((r) => new Set(r).add(word));
    }
    setFlipped(false);
    setTyped("");
    setChecked(null);
    setI((n) => n + 1);
  }

  function flip() {
    setFlipped(true);
    speak(word, 0.9);
  }

  function check() {
    if (!typed.trim()) return;
    const ok = sameSpelling(typed, word);
    setChecked(ok);
    speak(word, 0.9);
  }

  return (
    <section className="space-y-4">
      <SessionHeader onExit={onExit} value={(i / queue.length) * 100} current={i + 1} total={queue.length} />

      <div className="card flex min-h-72 flex-col items-center justify-center gap-3 p-6 text-center">
        {mode === "word" || revealed ? (
          <span lang="en" className="text-4xl font-extrabold">
            {word}
          </span>
        ) : (
          <span className="text-2xl font-bold">{vi}</span>
        )}
        {mode === "spell" && !revealed && (
          <button type="button" onClick={() => speak(word, 0.85)} className="btn-ghost">
            <Volume2 className="size-4" /> Nghe lại
          </button>
        )}
        {revealed ? (
          <div className="space-y-1">
            <SaveWordButton entry={{ term: word, meaning: vi, reading: ipa, example, source: "vocab" }} className="mx-auto" />
            <button type="button" onClick={() => speak(word, 0.9)} className="inline-flex items-center gap-1.5 font-mono text-xl text-primary">
              <Volume2 className="size-5" /> {ipa}
            </button>
            <div className="text-lg">
              <span className="mr-1 text-xs text-muted">({EN_POS_LABEL[pos]})</span>
              {vi}
            </div>
            <button type="button" onClick={() => speak(example)} lang="en" className="mx-auto flex items-center gap-1.5 text-sm italic text-muted hover:text-fg">
              <Volume2 className="size-3.5 shrink-0" /> {example}
            </button>
          </div>
        ) : (
          mode !== "spell" && <p className="text-sm text-muted">{mode === "word" ? "Nhớ nghĩa rồi lật thẻ" : "Nhớ từ tiếng Anh rồi lật thẻ"}</p>
        )}
        {checked !== null && (
          <p className={`flex items-center gap-1.5 font-semibold ${checked ? "text-success" : "text-danger"}`}>
            {checked ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {checked ? "Chính xác!" : `Bạn gõ: ${typed}`}
          </p>
        )}
      </div>

      {mode === "spell" ? (
        checked === null ? (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              check();
            }}
          >
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
              lang="en"
              placeholder="Gõ từ tiếng Anh…"
              className="input flex-1"
              aria-label="Gõ từ tiếng Anh"
            />
            <button type="submit" disabled={!typed.trim()} className="btn-primary">
              Kiểm tra
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => next(checked ? "good" : "again")} className="btn-primary w-full py-3 text-base" autoFocus>
            Tiếp
          </button>
        )
      ) : flipped ? (
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => next("again")} className="rounded-xl border-2 border-danger/40 bg-danger-soft p-3 font-bold text-danger">
            <RotateCcw className="mx-auto mb-0.5 size-4" /> Quên
          </button>
          <button type="button" onClick={() => next("good")} className="rounded-xl border-2 border-primary/40 bg-primary-soft p-3 font-bold text-primary">
            Nhớ
          </button>
          <button type="button" onClick={() => next("easy")} className="rounded-xl border-2 border-success/40 bg-success/10 p-3 font-bold text-success">
            Dễ
          </button>
        </div>
      ) : (
        <button type="button" onClick={flip} className="btn-primary w-full py-3 text-base">
          Lật thẻ
        </button>
      )}
    </section>
  );
}
