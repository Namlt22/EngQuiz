"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, CheckCircle2, Ear, Lightbulb, MousePointerClick, RefreshCw, Snail, Volume2, X, XCircle,
} from "lucide-react";
import {
  ENDING_RULES, IPA_CHART, IPA_GROUP_INFO, IPA_MAP, IPA_SOUNDS, READING_RULES, type IpaExample, type IpaGroup, type IpaSound,
} from "@/content/ipa";
import { useSpeech } from "@/lib/speech";

/* Một nguồn TTS dùng chung cho cả trang để đổi giọng một lần là áp dụng mọi nơi. */
type Speak = (text: string, rate?: number) => void;
const SpeakCtx = createContext<Speak>(() => {});
const useSpeak = () => useContext(SpeakCtx);

export function IpaExplorer() {
  const speech = useSpeech({ prefer: "en-GB", storageKey: "engquiz:voice-ipa" });
  const [selected, setSelected] = useState<string | null>(null);

  // Đọc #id trên URL để có thể chia sẻ link tới một âm cụ thể.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (IPA_MAP[id]) setSelected(id);
  }, []);

  function select(id: string | null) {
    setSelected(id);
    history.replaceState(null, "", id ? `#${id}` : window.location.pathname);
  }

  const sound = selected ? IPA_MAP[selected] : null;

  // Esc để đóng bảng chi tiết trên điện thoại.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && select(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SpeakCtx.Provider value={speech.speak}>
      <div className="space-y-10">
        {/* Thanh công cụ: chú thích màu + chọn giọng */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Legend />
          {speech.voiceOptions.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-muted">
              <Volume2 className="size-4" /> Giọng đọc
              <select
                value={speech.voiceId}
                onChange={(e) => speech.chooseVoice(e.target.value)}
                className="max-w-56 rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-fg"
              >
                {speech.voiceOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {!speech.supported && (
          <p className="rounded-xl border border-danger/30 bg-danger-soft p-3 text-sm">
            Trình duyệt không hỗ trợ đọc văn bản. Hãy dùng Chrome, Edge hoặc Safari bản mới để nghe phát âm mẫu.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Bảng */}
          <div className="space-y-6">
            <ChartBlock title="Nguyên âm đơn" subtitle="12 âm · ngắn và dài" rows={IPA_CHART.monophthongs} cols={4} selected={selected} onSelect={select} />
            <ChartBlock title="Nguyên âm đôi" subtitle="8 âm · trượt từ âm này sang âm kia" rows={IPA_CHART.diphthongs} cols={3} selected={selected} onSelect={select} />
            <ChartBlock title="Phụ âm" subtitle="24 âm · phần lớn đi theo cặp vô thanh – hữu thanh" rows={IPA_CHART.consonants} cols={8} selected={selected} onSelect={select} />
            <p className="flex items-center gap-2 text-sm text-muted">
              <MousePointerClick className="size-4" /> Bấm vào một âm để xem cách đọc và nghe từ ví dụ.
            </p>
          </div>

          {/* Chi tiết: cột phải trên desktop, bottom sheet trên điện thoại */}
          <div className="lg:relative">
            {sound && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden" onClick={() => select(null)} aria-hidden />}
            <aside
              className={`${sound ? "fixed" : "hidden"} inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 shadow-2xl
                lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:rounded-3xl lg:shadow-sm`}
              aria-label="Chi tiết âm"
            >
              {sound ? <SoundDetail sound={sound} onClose={() => select(null)} onSelect={select} /> : <EmptyDetail />}
            </aside>
          </div>
        </div>

        <ReadingGuide />
        <MinimalPairPractice />
      </div>
    </SpeakCtx.Provider>
  );
}

/* ---------------- Bảng ---------------- */

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {(Object.keys(IPA_GROUP_INFO) as IpaGroup[]).map((g) => (
        <span key={g} className="inline-flex items-center gap-1.5 text-muted">
          <span className={`size-3 rounded-full ${IPA_GROUP_INFO[g].dot}`} /> {IPA_GROUP_INFO[g].label}
        </span>
      ))}
    </div>
  );
}

const COLS: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4", 8: "grid-cols-4 sm:grid-cols-8" };

function ChartBlock({
  title,
  subtitle,
  rows,
  cols,
  selected,
  onSelect,
}: {
  title: string;
  subtitle: string;
  rows: string[][];
  cols: number;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="card p-4 md:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-muted">{subtitle}</span>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className={`grid gap-2 ${COLS[cols]}`}>
            {row.map((id) => (
              <Cell key={id} sound={IPA_MAP[id]} active={selected === id} onClick={() => onSelect(id)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Cell({ sound, active, onClick }: { sound: IpaSound; active: boolean; onClick: () => void }) {
  const speak = useSpeak();
  const info = IPA_GROUP_INFO[sound.group];
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
        speak(sound.examples[0].word, 0.8);
      }}
      className={`group flex flex-col items-center justify-center rounded-xl px-1 py-2.5 ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${info.cell} ${
        active ? "ring-2 ring-offset-2 ring-offset-surface !ring-primary" : ""
      }`}
      aria-pressed={active}
      aria-label={`Âm /${sound.symbol}/, ví dụ ${sound.examples[0].word}`}
    >
      <span className="font-ipa text-2xl font-semibold leading-none md:text-[26px]">{sound.symbol}</span>
      <span className="mt-1.5 max-w-full truncate text-[11px] font-medium opacity-75">{sound.examples[0].word}</span>
    </button>
  );
}

/* ---------------- Chi tiết một âm ---------------- */

function EmptyDetail() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center text-muted">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface-2">
        <Ear className="size-7" />
      </span>
      <p className="font-semibold text-fg">Chọn một âm trong bảng</p>
      <p className="text-sm">Bạn sẽ thấy cách đặt môi, lưỡi, âm tiếng Việt gần giống, lỗi hay gặp và nghe từ ví dụ.</p>
    </div>
  );
}

function SoundDetail({ sound, onClose, onSelect }: { sound: IpaSound; onClose: () => void; onSelect: (id: string) => void }) {
  const info = IPA_GROUP_INFO[sound.group];
  const other = sound.pair ? IPA_MAP[sound.pair.with] : undefined;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.parentElement?.scrollTo({ top: 0 });
  }, [sound.id]);

  return (
    <div ref={ref} className="animate-pop-in space-y-5" key={sound.id}>
      <div className="mx-auto -mt-1 mb-1 h-1.5 w-12 rounded-full bg-line lg:hidden" />
      <div className="flex items-start gap-4">
        <span className={`grid size-20 shrink-0 place-items-center rounded-2xl font-ipa text-4xl font-semibold ring-1 ${info.cell}`}>{sound.symbol}</span>
        <div className="min-w-0 flex-1">
          <span className={`chip ${info.cell} ring-0`}>{info.label}</span>
          <h3 className="mt-1 font-ipa text-2xl font-bold">/{sound.symbol}/</h3>
        </div>
        <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg lg:hidden" aria-label="Đóng">
          <X className="size-5" />
        </button>
      </div>

      <section>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Từ ví dụ</h4>
        <ul className="space-y-2">
          {sound.examples.map((e) => (
            <ExampleRow key={e.word} e={e} symbol={sound.symbol} />
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-surface-2 p-4">
        <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">Cách phát âm</h4>
        <p className="leading-relaxed">{sound.guide}</p>
        {sound.viLike && (
          <p className="mt-2 text-sm">
            🇻🇳 <b>Gần giống:</b> {sound.viLike}
          </p>
        )}
      </section>

      {sound.tip && (
        <p className="flex gap-2 rounded-2xl border border-warning/30 bg-warning-soft p-3 text-sm leading-relaxed">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /> {sound.tip}
        </p>
      )}
      {sound.us && (
        <p className="flex gap-2 rounded-2xl border border-line p-3 text-sm leading-relaxed text-muted">
          <span>🇺🇸</span> {sound.us}
        </p>
      )}

      {sound.pair && other && (
        <section>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
            So sánh với{" "}
            <button type="button" onClick={() => onSelect(other.id)} className="font-ipa normal-case text-primary hover:underline">
              /{other.symbol}/
            </button>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <PairButton e={sound.pair.a} highlight />
            <PairButton e={sound.pair.b} />
          </div>
          <p className="mt-2 text-xs text-muted">Nghe lần lượt hai từ để nhận ra sự khác biệt.</p>
        </section>
      )}
    </div>
  );
}

/** Tô đậm ký hiệu đang học trong phiên âm: /ʃiːp/ → /ʃ<b>iː</b>p/ */
function HighlightIpa({ ipa, symbol }: { ipa: string; symbol: string }) {
  const i = ipa.indexOf(symbol);
  if (i < 0) return <>{ipa}</>;
  return (
    <>
      {ipa.slice(0, i)}
      <b className="rounded bg-primary-soft px-0.5 text-primary">{symbol}</b>
      {ipa.slice(i + symbol.length)}
    </>
  );
}

function ExampleRow({ e, symbol }: { e: IpaExample; symbol: string }) {
  const speak = useSpeak();
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line p-2.5">
      <button
        type="button"
        onClick={() => speak(e.word, 0.85)}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-fg transition hover:brightness-110"
        aria-label={`Nghe ${e.word}`}
      >
        <Volume2 className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-semibold">{e.word}</span>
          <span className="font-ipa text-sm text-muted">
            <HighlightIpa ipa={e.ipa} symbol={symbol} />
          </span>
        </div>
        <div className="text-xs text-muted">{e.vi}</div>
      </div>
      <button
        type="button"
        onClick={() => speak(e.word, 0.5)}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted transition hover:text-fg"
        aria-label={`Nghe chậm ${e.word}`}
        title="Nghe chậm"
      >
        <Snail className="size-4" />
      </button>
    </li>
  );
}

function PairButton({ e, highlight }: { e: IpaExample; highlight?: boolean }) {
  const speak = useSpeak();
  return (
    <button
      type="button"
      onClick={() => speak(e.word, 0.8)}
      className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 p-3 transition hover:-translate-y-0.5 ${
        highlight ? "border-primary/50 bg-primary-soft" : "border-line bg-surface"
      }`}
    >
      <Volume2 className="size-4 text-muted" />
      <span className="text-lg font-bold">{e.word}</span>
      <span className="font-ipa text-sm text-muted">{e.ipa}</span>
      <span className="text-xs text-muted">{e.vi}</span>
    </button>
  );
}

/* ---------------- Hướng dẫn đọc phiên âm ---------------- */

function ReadingGuide() {
  const speak = useSpeak();
  return (
    <section className="space-y-4" id="huong-dan">
      <h2 className="text-xl font-bold md:text-2xl">Cách đọc phiên âm trong từ điển</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {READING_RULES.map((r) => (
          <div key={r.title} className="card p-5">
            <h3 className="flex items-center gap-2 font-bold">
              <Lightbulb className="size-4 text-warning" /> {r.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
            {r.examples && (
              <div className="mt-3 flex flex-wrap gap-2">
                {r.examples.map((e) => (
                  <button
                    key={e.word}
                    type="button"
                    onClick={() => speak(e.word, 0.8)}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5 text-sm transition hover:border-primary/50"
                  >
                    <Volume2 className="size-3.5 text-primary" />
                    <b>{e.word}</b>
                    <span className="font-ipa text-muted">{e.ipa}</span>
                    <span className="text-xs text-muted">· {e.vi}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[ENDING_RULES.s, ENDING_RULES.ed].map((t) => (
          <div key={t.title} className="card overflow-hidden">
            <h3 className="border-b border-line bg-surface-2 px-5 py-3 font-bold">{t.title}</h3>
            <table className="w-full text-sm">
              <tbody>
                {t.rows.map(([sound, when, examples]) => (
                  <tr key={sound} className="border-b border-line last:border-0">
                    <td className="w-20 whitespace-nowrap px-5 py-3 align-top font-ipa text-lg font-bold text-primary">{sound}</td>
                    <td className="py-3 pr-5 align-top">
                      <div>{when}</div>
                      <div className="mt-1 font-ipa text-xs text-muted">{examples}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Luyện nghe phân biệt cặp âm ---------------- */

interface PairItem {
  a: IpaExample;
  b: IpaExample;
  focus: string;
}

function buildPairs(): PairItem[] {
  const seen = new Set<string>();
  const out: PairItem[] = [];
  for (const s of IPA_SOUNDS) {
    if (!s.pair) continue;
    const key = [s.pair.a.word, s.pair.b.word].sort().join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ a: s.pair.a, b: s.pair.b, focus: `/${s.symbol}/ – /${IPA_MAP[s.pair.with].symbol}/` });
  }
  return out;
}

function MinimalPairPractice() {
  const speak = useSpeak();
  const pairs = useMemo(buildPairs, []);
  const [idx, setIdx] = useState(0);
  const [target, setTarget] = useState<"a" | "b">("a");
  const [choice, setChoice] = useState<"a" | "b" | null>(null);
  const [heard, setHeard] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Chọn ngẫu nhiên sau khi mount để tránh lệch giữa server và trình duyệt.
  useEffect(() => {
    setIdx(Math.floor(Math.random() * pairs.length));
    setTarget(Math.random() < 0.5 ? "a" : "b");
  }, [pairs.length]);

  const item = pairs[idx];
  const word = item[target];

  function play() {
    speak(word.word, 0.8);
    setHeard(true);
  }

  function pick(c: "a" | "b") {
    if (choice) return;
    setChoice(c);
    setScore((s) => ({ correct: s.correct + (c === target ? 1 : 0), total: s.total + 1 }));
  }

  function next() {
    let n = Math.floor(Math.random() * pairs.length);
    if (pairs.length > 1 && n === idx) n = (n + 1) % pairs.length;
    setIdx(n);
    setTarget(Math.random() < 0.5 ? "a" : "b");
    setChoice(null);
    setHeard(false);
  }

  const correct = choice !== null && choice === target;

  return (
    <section className="card overflow-hidden" id="luyen-nghe">
      <div className="flex flex-col gap-1 border-b border-line bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Ear className="size-5" /> Luyện nghe phân biệt cặp âm
          </h2>
          <p className="text-sm text-white/85">Nghe một từ và chọn đúng từ bạn nghe được. {pairs.length} cặp từ dễ nhầm.</p>
        </div>
        <span className="chip w-fit bg-white/20 text-white">
          Đúng {score.correct}/{score.total}
        </span>
      </div>
      <div className="flex flex-col items-center gap-5 p-6">
        <span className="chip bg-surface-2 font-ipa text-muted">{item.focus}</span>
        <button
          type="button"
          onClick={play}
          className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105"
          aria-label="Nghe từ"
        >
          <Volume2 className="size-9" />
        </button>
        <p className="text-sm text-muted">{heard ? "Bạn nghe thấy từ nào?" : "Bấm loa để nghe"}</p>
        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          {(["a", "b"] as const).map((k) => {
            const e = item[k];
            const state = !choice ? "idle" : k === target ? "correct" : k === choice ? "wrong" : "idle";
            return (
              <button
                key={k}
                type="button"
                disabled={!heard || !!choice}
                onClick={() => pick(k)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 p-4 transition disabled:cursor-not-allowed ${
                  state === "correct"
                    ? "border-success bg-success-soft text-success"
                    : state === "wrong"
                      ? "animate-shake border-danger bg-danger-soft text-danger"
                      : "border-line bg-surface enabled:hover:border-primary/50 disabled:opacity-60"
                }`}
              >
                <span className="text-xl font-bold">{e.word}</span>
                <span className="font-ipa text-sm opacity-80">{e.ipa}</span>
                <span className="text-xs opacity-70">{e.vi}</span>
              </button>
            );
          })}
        </div>
        {choice && (
          <div className="animate-pop-in flex flex-col items-center gap-3">
            <p className={`flex items-center gap-2 font-bold ${correct ? "text-success" : "text-danger"}`}>
              {correct ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
              {correct ? "Chính xác!" : `Chưa đúng — đó là "${word.word}" ${word.ipa}`}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => speak(item.a.word, 0.8)} className="btn-ghost">
                <Volume2 className="size-4" /> {item.a.word}
              </button>
              <button type="button" onClick={() => speak(item.b.word, 0.8)} className="btn-ghost">
                <Volume2 className="size-4" /> {item.b.word}
              </button>
              <button type="button" onClick={next} className="btn-primary">
                <RefreshCw className="size-4" /> Câu khác
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
