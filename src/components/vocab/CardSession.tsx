"use client";

/**
 * Phiên ôn thẻ dùng chung (Sổ tay, Ôn thẻ hôm nay). Mỗi thẻ tự mang hàm chấm của nguồn nó (bộ từ chuẩn hay Sổ tay).
 *  - "meaning": mặt trước là nghĩa tiếng Việt → lật xem từ, phiên âm, ví dụ → tự chấm Quên / Nhớ / Dễ;
 *  - "type":    nghe + xem nghĩa → gõ lại từ; máy chấm (đúng = Nhớ, sai = Quên).
 * Thẻ "Quên" được đưa xuống cuối phiên để ôn lại một lần.
 */
import { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, Volume2, XCircle } from "lucide-react";
import type { Grade } from "@/core/srs";
import type { CourseCode } from "@/lib/course";

export interface Card {
  /** Khoá duy nhất trong phiên (vd "vocab:apple", "nb:abc123"). */
  id: string;
  term: string;
  meaning: string;
  reading?: string;
  example?: string;
  grade: (g: Grade) => void;
}

export type CardMode = "meaning" | "type";

/** So khớp từ gõ vào: không phân biệt hoa thường, bỏ khoảng trắng / dấu câu thừa, ’ = '. */
export function sameTerm(typed: string, term: string, course: CourseCode): boolean {
  const norm = (s: string) =>
    course === "zh"
      ? s.replace(/[\s\p{P}\p{S}]/gu, "")
      : s.trim().toLowerCase().replace(/[’`]/g, "'").replace(/[.!?,]+$/g, "").replace(/\s+/g, " ");
  return norm(typed) !== "" && norm(typed) === norm(term);
}

export function CardSession({
  cards: initial,
  mode,
  course,
  speak,
  onExit,
}: {
  cards: Card[];
  mode: CardMode;
  course: CourseCode;
  speak: (text: string) => void;
  onExit: (stats: { total: number; again: number }) => void;
}) {
  const [queue, setQueue] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ again: 0, good: 0, easy: 0 });

  // Kiểu gõ: đọc to từ khi thẻ mới hiện ra.
  useEffect(() => {
    if (mode === "type" && i < queue.length) speak(queue[i].term);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ đọc khi sang thẻ mới
  }, [i, mode]);

  const lang = course === "zh" ? "zh-Hans" : "en";

  if (i >= queue.length) {
    return (
      <section className="card space-y-4 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <h2 className="text-xl font-extrabold">Xong lượt ôn</h2>
        <p className="text-muted">
          Nhớ {stats.good + stats.easy} · Quên {stats.again}
        </p>
        <button type="button" onClick={() => onExit({ total: queue.length, again: stats.again })} className="btn-primary mx-auto">
          Xong
        </button>
      </section>
    );
  }

  const card = queue[i];
  const revealed = flipped || checked !== null;

  function next(g: Grade) {
    card.grade(g);
    setStats((s) => ({ ...s, [g]: s[g] + 1 }));
    if (g === "again" && !requeued.has(card.id)) {
      setQueue((q) => [...q, card]);
      setRequeued((r) => new Set(r).add(card.id));
    }
    setFlipped(false);
    setTyped("");
    setChecked(null);
    setI((n) => n + 1);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-muted">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-primary transition-all" style={{ width: `${(i / queue.length) * 100}%` }} />
        </div>
        <span>
          {i + 1}/{queue.length}
        </span>
        <button type="button" onClick={() => onExit({ total: i, again: stats.again })} className="font-semibold hover:text-fg">
          Dừng
        </button>
      </div>

      <div className="card flex min-h-72 flex-col items-center justify-center gap-3 p-6 text-center">
        {revealed ? (
          <>
            <span lang={lang} className={course === "zh" ? "text-5xl font-medium" : "text-4xl font-extrabold"}>
              {card.term}
            </span>
            <button type="button" onClick={() => speak(card.term)} className="inline-flex items-center gap-1.5 text-lg text-primary">
              <Volume2 className="size-5" /> {card.reading}
            </button>
            <div className="text-lg">{card.meaning}</div>
            {card.example && (
              <button type="button" onClick={() => speak(card.example!)} lang={lang} className="flex items-center gap-1.5 text-sm italic text-muted hover:text-fg">
                <Volume2 className="size-3.5 shrink-0" /> {card.example}
              </button>
            )}
            {checked !== null && (
              <p className={`flex items-center gap-1.5 font-semibold ${checked ? "text-success" : "text-danger"}`}>
                {checked ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
                {checked ? "Chính xác" : typed}
              </p>
            )}
          </>
        ) : (
          <>
            <span className="text-2xl font-bold">{card.meaning}</span>
            {mode === "type" && (
              <button type="button" onClick={() => speak(card.term)} className="btn-ghost" aria-label="Nghe lại">
                <Volume2 className="size-4" />
              </button>
            )}
          </>
        )}
      </div>

      {mode === "type" ? (
        checked === null ? (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!typed.trim()) return;
              setChecked(sameTerm(typed, card.term, course));
              speak(card.term);
            }}
          >
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
              lang={lang}
              className="input flex-1"
              aria-label="Gõ từ"
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
        <button
          type="button"
          onClick={() => {
            setFlipped(true);
            speak(card.term);
          }}
          className="btn-primary w-full py-3 text-base"
        >
          Lật thẻ
        </button>
      )}
    </section>
  );
}
