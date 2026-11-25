"use client";

/**
 * Phiên ôn thẻ dùng chung (Từ vựng EN/HSK, Sổ tay, Ôn thẻ hôm nay). Mỗi thẻ tự mang hàm chấm của nguồn nó.
 *  - "term":    mặt trước là từ → lật xem cách đọc, nghĩa → tự chấm Quên / Nhớ / Dễ;
 *  - "meaning": mặt trước là nghĩa tiếng Việt → lật xem từ → tự chấm;
 *  - "listen":  chỉ nghe → lật xem từ và nghĩa → tự chấm;
 *  - "type":    nghe + xem nghĩa → gõ lại từ; máy chấm (đúng = Nhớ, sai = Quên);
 *  - "reading": xem từ → gõ cách đọc (pinyin), thẻ phải có `checkReading`; máy chấm từng âm tiết.
 * Thẻ "Quên" được đưa xuống cuối phiên để ôn lại một lần.
 */
import { useEffect, useState } from "react";
import { CheckCircle2, Ear, RotateCcw, Volume2, XCircle } from "lucide-react";
import type { NewEntry } from "@/core/notebook";
import type { Grade } from "@/core/srs";
import type { CharMark } from "@/core/zh-dictation";
import type { CourseCode } from "@/lib/course";
import { SaveWordButton } from "@/components/notebook/SaveWordButton";
import { SessionHeader } from "@/components/ui/SessionHeader";

export interface ReadingCheck {
  correct: boolean;
  marks: CharMark[];
}

export interface Card {
  /** Khoá duy nhất trong phiên (vd "v:apple", "nb:abc123"). */
  id: string;
  term: string;
  meaning: string;
  reading?: string;
  example?: string;
  /** Nhãn từ loại ngắn, hiện trước nghĩa (vd "danh từ"). */
  tag?: string;
  /** Dòng phụ dưới cách đọc (vd "đọc là …", "Hán-Việt: …"). */
  notes?: string[];
  /** Có thì mặt sau hiện ngôi sao lưu vào Sổ tay (thẻ đã ở Sổ tay thì bỏ trống). */
  save?: NewEntry;
  /** Chấm kiểu "reading". */
  checkReading?: (typed: string) => ReadingCheck;
  grade: (g: Grade) => void;
}

export type CardMode = "term" | "meaning" | "listen" | "type" | "reading";

/** So khớp từ gõ vào: không phân biệt hoa thường, bỏ khoảng trắng / dấu câu thừa, ’ = '. */
export function sameTerm(typed: string, term: string, course: CourseCode): boolean {
  const norm = (s: string) =>
    course === "zh"
      ? s.replace(/[\s\p{P}\p{S}]/gu, "")
      : s.trim().toLowerCase().replace(/[’`]/g, "'").replace(/[.!?,]+$/g, "").replace(/\s+/g, " ");
  return norm(typed) !== "" && norm(typed) === norm(term);
}

const TYPED_MODES: readonly CardMode[] = ["type", "reading"];

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
  /** `total` = số thẻ đã ôn; bằng số thẻ của phiên khi ôn hết. */
  onExit: (stats: { total: number; again: number }) => void;
}) {
  const [queue, setQueue] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState<ReadingCheck | null>(null);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ again: 0, good: 0, easy: 0 });

  // Kiểu nghe / gõ từ: đọc to từ khi thẻ mới hiện ra.
  useEffect(() => {
    if ((mode === "type" || mode === "listen") && i < queue.length) speak(queue[i].term);
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
  const typing = TYPED_MODES.includes(mode);
  const revealed = flipped || checked !== null;
  const termClass = course === "zh" ? "text-6xl font-medium" : "text-4xl font-extrabold";

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

  function check() {
    if (!typed.trim()) return;
    const result =
      mode === "reading" && card.checkReading ? card.checkReading(typed) : { correct: sameTerm(typed, card.term, course), marks: [] };
    setChecked(result);
    speak(card.term);
  }

  function front() {
    if (mode === "term" || mode === "reading") {
      return (
        <span lang={lang} className={termClass}>
          {card.term}
        </span>
      );
    }
    if (mode === "listen") {
      return (
        <button type="button" onClick={() => speak(card.term)} className="grid size-24 place-items-center rounded-full bg-primary-soft text-primary" aria-label="Nghe lại">
          <Ear className="size-10" />
        </button>
      );
    }
    return (
      <>
        <span className="text-2xl font-bold">{card.meaning}</span>
        {mode === "type" && (
          <button type="button" onClick={() => speak(card.term)} className="btn-ghost" aria-label="Nghe lại">
            <Volume2 className="size-4" />
          </button>
        )}
      </>
    );
  }

  function back() {
    return (
      <>
        <span lang={lang} className={termClass}>
          {card.term}
        </span>
        {card.save && <SaveWordButton entry={card.save} />}
        <button type="button" onClick={() => speak(card.term)} className={`inline-flex items-center gap-1.5 text-primary ${course === "zh" ? "text-2xl font-bold" : "font-mono text-xl"}`}>
          <Volume2 className="size-5" /> {card.reading}
        </button>
        {card.notes?.map((n) => (
          <div key={n} className="text-sm text-muted">
            {n}
          </div>
        ))}
        <div className="text-lg">
          {card.tag && <span className="mr-1 text-xs text-muted">({card.tag})</span>}
          {card.meaning}
        </div>
        {card.example && (
          <button type="button" onClick={() => speak(card.example!)} lang={lang} className="flex items-center gap-1.5 text-sm italic text-muted hover:text-fg">
            <Volume2 className="size-3.5 shrink-0" /> {card.example}
          </button>
        )}
      </>
    );
  }

  return (
    <section className="space-y-4">
      <SessionHeader onExit={() => onExit({ total: i, again: stats.again })} value={(i / queue.length) * 100} current={i + 1} total={queue.length} />

      <div className="card flex min-h-72 flex-col items-center justify-center gap-3 p-6 text-center">
        {revealed ? back() : front()}
        {checked && checked.marks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5" aria-label="Kết quả từng âm tiết">
            {checked.marks.map((m, k) => (
              <span
                key={k}
                className={`chip font-semibold ${m.score === 1 ? "bg-success/10 text-success" : m.score > 0 ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"}`}
              >
                {m.char} {m.syllable}
              </span>
            ))}
          </div>
        )}
        {checked && (
          <p className={`flex items-center gap-1.5 font-semibold ${checked.correct ? "text-success" : "text-danger"}`}>
            {checked.correct ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {checked.correct ? "Chính xác" : typed}
          </p>
        )}
      </div>

      {typing ? (
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
              lang={mode === "reading" ? "en" : lang}
              placeholder={mode === "reading" ? "ni3 hao3" : undefined}
              className="input flex-1"
              aria-label={mode === "reading" ? "Gõ pinyin" : "Gõ từ"}
            />
            <button type="submit" disabled={!typed.trim()} className="btn-primary">
              Kiểm tra
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => next(checked.correct ? "good" : "again")} className="btn-primary w-full py-3 text-base" autoFocus>
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
