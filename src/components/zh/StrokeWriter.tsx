"use client";

/**
 * Ô tập viết một chữ Hán: xem hoạt hình thứ tự nét, hoặc tự viết từng nét (máy kiểm tra hướng và thứ tự nét).
 * Dùng thư viện hanzi-writer (MIT); dữ liệu nét tự phục vụ từ public/hanzi (Arphic Public License).
 * Thư viện chỉ nạp ở trình duyệt (dynamic import) để không làm nặng các trang khác.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type HanziWriter from "hanzi-writer";
import { Eye, PenLine, Play, RotateCcw } from "lucide-react";
import { strokeDataUrl } from "@/content/zh/hanzi-chars";

const SIZE = 260;
/** Viết sai quá số nét này thì chưa tính là "đã viết được" (vẫn cho viết xong để học). */
export const MAX_MISTAKES_TO_PASS = 3;
const HINT_AFTER_MISSES = 2;

type Mode = "loading" | "ready" | "animating" | "quiz" | "error";

export interface WriteResult {
  mistakes: number;
  passed: boolean;
}

export function StrokeWriter({ char, onWritten }: { char: string; onWritten?: (r: WriteResult) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [mode, setMode] = useState<Mode>("loading");
  const [strokes, setStrokes] = useState(0);
  const [done, setDone] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<WriteResult | null>(null);
  const onWrittenRef = useRef(onWritten);
  onWrittenRef.current = onWritten;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    setMode("loading");
    setResult(null);
    host.innerHTML = "";
    const style = getComputedStyle(host);
    const ink = style.color;
    const accent = style.getPropertyValue("--primary").trim() || "#6366f1";

    import("hanzi-writer")
      .then(({ default: HW }) => {
        if (cancelled) return;
        writerRef.current = HW.create(host, char, {
          width: SIZE,
          height: SIZE,
          padding: 12,
          strokeColor: ink,
          radicalColor: accent,
          outlineColor: "rgba(127,127,127,0.25)",
          drawingColor: accent,
          highlightColor: accent,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 250,
          showCharacter: true,
          charDataLoader: (ch, onLoad, onError) => {
            fetch(strokeDataUrl(ch))
              .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
              .then((data: { strokes: string[] }) => {
                if (cancelled) return;
                setStrokes(data.strokes.length);
                setMode("ready");
                onLoad(data as never);
              })
              .catch((e: unknown) => {
                if (!cancelled) setMode("error");
                onError(e);
              });
          },
        });
      })
      .catch(() => !cancelled && setMode("error"));

    return () => {
      cancelled = true;
      writerRef.current?.cancelQuiz();
      writerRef.current = null;
      host.innerHTML = "";
    };
  }, [char]);

  const animate = useCallback(() => {
    const w = writerRef.current;
    if (!w) return;
    w.cancelQuiz();
    setMode("animating");
    w.showCharacter();
    void w.animateCharacter({ onComplete: () => setMode("ready") });
  }, []);

  const quiz = useCallback((withOutline: boolean) => {
    const w = writerRef.current;
    if (!w) return;
    setMode("quiz");
    setDone(0);
    setMistakes(0);
    setResult(null);
    if (withOutline) w.showOutline();
    else w.hideOutline();
    void w.quiz({
      showHintAfterMisses: HINT_AFTER_MISSES,
      onCorrectStroke: (d) => setDone(d.strokeNum + 1),
      onMistake: (d) => setMistakes(d.totalMistakes),
      onComplete: (d) => {
        const r = { mistakes: d.totalMistakes, passed: d.totalMistakes <= MAX_MISTAKES_TO_PASS };
        setResult(r);
        setMode("ready");
        w.showOutline();
        onWrittenRef.current?.(r);
      },
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative text-fg" style={{ width: SIZE, height: SIZE }}>
        {/* Ô chữ 米 kẻ ô giúp căn tỉ lệ nét */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full rounded-2xl border border-line bg-surface text-line" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="0.4" strokeDasharray="1.5 1.5">
            <line x1="0" y1="0" x2="100" y2="100" />
            <line x1="100" y1="0" x2="0" y2="100" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
          </g>
        </svg>
        <div ref={hostRef} className="absolute inset-0 touch-none" role="img" aria-label={`Chữ ${char}`} />
        {mode === "loading" && <div className="absolute inset-0 grid place-items-center text-sm text-muted">Đang tải nét chữ…</div>}
        {mode === "error" && <div className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-danger">Không tải được dữ liệu nét của chữ này.</div>}
      </div>

      <div className="text-sm text-muted" aria-live="polite">
        {mode === "quiz"
          ? `Viết nét ${Math.min(done + 1, strokes)}/${strokes} · sai ${mistakes}`
          : result
            ? result.passed
              ? `Viết đúng! Sai ${result.mistakes} lần.`
              : `Đã viết xong nhưng sai ${result.mistakes} lần — viết lại để ghi nhận (tối đa ${MAX_MISTAKES_TO_PASS} lần sai).`
            : strokes
              ? `${strokes} nét`
              : ""}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={animate} disabled={mode === "loading" || mode === "error" || mode === "animating"} className="btn-ghost">
          <Play className="size-4" /> Xem cách viết
        </button>
        <button type="button" onClick={() => quiz(true)} disabled={mode === "loading" || mode === "error"} className="btn-primary">
          {mode === "quiz" ? <RotateCcw className="size-4" /> : <PenLine className="size-4" />} {mode === "quiz" ? "Viết lại" : "Tô theo mẫu"}
        </button>
        <button type="button" onClick={() => quiz(false)} disabled={mode === "loading" || mode === "error"} className="btn-ghost">
          <Eye className="size-4" /> Viết không mẫu
        </button>
      </div>
    </div>
  );
}
