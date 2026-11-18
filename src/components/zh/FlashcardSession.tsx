"use client";

/**
 * Một phiên ôn thẻ từ vựng HSK, 4 kiểu:
 *  - "hanzi":   thấy chữ Hán → nhớ cách đọc, nghĩa → lật thẻ → tự chấm Quên / Nhớ / Dễ;
 *  - "meaning": thấy nghĩa tiếng Việt → nhớ chữ, cách đọc → lật thẻ → tự chấm;
 *  - "listen":  chỉ nghe → nhớ chữ và nghĩa → lật thẻ → tự chấm;
 *  - "pinyin":  thấy chữ Hán → gõ pinyin; máy chấm từng âm tiết (đúng hết = Nhớ, còn sai = Quên).
 * Thẻ "Quên" được đưa xuống cuối phiên để ôn lại một lần.
 */
import { useEffect, useState } from "react";
import { CheckCircle2, Ear, RotateCcw, Volume2, XCircle } from "lucide-react";
import { getHskWord } from "@/content/zh/vocab";
import { POS_LABEL, vocabVi } from "@/content/zh/vocab-vi";
import { applySandhi } from "@/core/pinyin";
import type { Grade } from "@/core/srs";
import { gradeWordPinyin, type WordPinyinResult } from "@/core/zh-vocab-quiz";
import { progressActions } from "@/lib/progress";

export type CardMode = "hanzi" | "meaning" | "listen" | "pinyin";

interface Props {
  queue: string[];
  mode: CardMode;
  speak: (text: string) => void;
  onExit: () => void;
}

export function FlashcardSession({ queue: initial, mode, speak, onExit }: Props) {
  const [queue, setQueue] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ again: 0, good: 0, easy: 0 });
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState<WordPinyinResult | null>(null);

  // Kiểu "Nghe": đọc to từ ngay khi thẻ mới hiện ra.
  useEffect(() => {
    if (mode === "listen" && i < queue.length) speak(queue[i]);
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
  const hsk = getHskWord(word);
  const vi = vocabVi(word);
  const spoken = hsk ? applySandhi(hsk.hanzi, hsk.pinyin) : "";

  const revealed = flipped || checked !== null;

  function flip() {
    setFlipped(true);
    speak(word);
  }

  function check() {
    if (!typed.trim()) return;
    setChecked(gradeWordPinyin(word, typed));
    speak(word);
  }

  function grade(g: Grade) {
    progressActions.reviewWord(word, g);
    setStats((s) => ({ ...s, [g]: s[g] + 1 }));
    // Quên: ôn lại thẻ này ở cuối phiên (chỉ một lần, để phiên không kéo dài vô hạn).
    if (g === "again" && !requeued.has(word)) {
      setQueue((q) => [...q, word]);
      setRequeued((r) => new Set(r).add(word));
    }
    setFlipped(false);
    setTyped("");
    setChecked(null);
    // Thẻ cuối của lượt (không còn thẻ "Quên" nào phải ôn lại) → báo lộ trình đã ôn xong.
    const willRequeue = g === "again" && !requeued.has(word);
    if (i + 1 >= queue.length && !willRequeue) progressActions.finishVocabSession();
    setI((n) => n + 1);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Thẻ {i + 1}/{queue.length}
        </span>
        <button type="button" onClick={onExit} className="font-semibold hover:text-fg">
          Dừng
        </button>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-primary transition-all" style={{ width: `${(i / queue.length) * 100}%` }} />
      </div>

      <div className="card flex min-h-72 flex-col items-center justify-center gap-3 p-6 text-center">
        {mode === "hanzi" || mode === "pinyin" || revealed ? (
          <span className="text-6xl font-medium" lang="zh-Hans">
            {word}
          </span>
        ) : mode === "listen" ? (
          <button type="button" onClick={() => speak(word)} className="grid size-24 place-items-center rounded-full bg-primary-soft text-primary" aria-label="Nghe lại">
            <Ear className="size-10" />
          </button>
        ) : (
          <span className="text-2xl font-bold">{vi?.[1] ?? "—"}</span>
        )}
        {checked && (
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
            {checked.correct ? "Chính xác!" : `Bạn gõ: ${typed}`}
          </p>
        )}
        {revealed ? (
          <div className="space-y-1">
            <button type="button" onClick={() => speak(word)} className="inline-flex items-center gap-1.5 text-2xl font-bold text-primary">
              <Volume2 className="size-5" /> {hsk?.pinyin}
            </button>
            {spoken && spoken !== hsk?.pinyin && <div className="text-sm font-semibold text-primary">đọc là {spoken}</div>}
            {vi && (
              <>
                {vi[2] && <div className="text-sm uppercase tracking-wide text-muted">Hán-Việt: {vi[2]}</div>}
                <div className="text-lg">
                  <span className="mr-1 text-xs text-muted">({POS_LABEL[vi[0]]})</span>
                  {vi[1]}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted">
            {mode === "hanzi" ? "Nhớ cách đọc và nghĩa rồi lật thẻ" : mode === "meaning" ? "Nhớ chữ Hán và cách đọc rồi lật thẻ" : mode === "listen" ? "Nghe rồi nhớ chữ Hán và nghĩa" : "Gõ pinyin: dấu thanh (nǐ hǎo) hoặc số (ni3 hao3)"}
          </p>
        )}
      </div>

      {mode === "pinyin" ? (
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
              placeholder="ni3 hao3"
              className="input flex-1"
              aria-label="Gõ pinyin"
            />
            <button type="submit" disabled={!typed.trim()} className="btn-primary">
              Kiểm tra
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => grade(checked.correct ? "good" : "again")} className="btn-primary w-full py-3 text-base" autoFocus>
            Tiếp
          </button>
        )
      ) : flipped ? (
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => grade("again")} className="rounded-xl border-2 border-danger/40 bg-danger-soft p-3 font-bold text-danger">
            <RotateCcw className="mx-auto mb-0.5 size-4" /> Quên
          </button>
          <button type="button" onClick={() => grade("good")} className="rounded-xl border-2 border-primary/40 bg-primary-soft p-3 font-bold text-primary">
            Nhớ
          </button>
          <button type="button" onClick={() => grade("easy")} className="rounded-xl border-2 border-success/40 bg-success/10 p-3 font-bold text-success">
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
