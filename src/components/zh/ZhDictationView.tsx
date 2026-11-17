"use client";

/**
 * Nghe chép tiếng Trung theo từng câu của một bài hội thoại / bài đọc.
 * Hai cách gõ: pinyin (số thanh hoặc dấu thanh) — hợp với HSK 1–2; chữ Hán (dùng bộ gõ của máy).
 * Chấm từng chữ/âm tiết (src/core/zh-dictation.ts); xong bài thì ghi điểm, đạt thì lộ trình tự tích.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, Snail, Volume2 } from "lucide-react";
import type { ZhTextLesson } from "@/content/zh/texts";
import { gradeDictation, type DictationMode, type DictationResult } from "@/core/zh-dictation";
import { plainText, sentencePinyin } from "@/core/zh-sentence";
import { progressActions } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

const RATE = 0.8;
const SLOW_RATE = 0.5;
const MODE_KEY = "engquiz:zh:dictation-mode";

function readMode(): DictationMode {
  try {
    return window.localStorage.getItem(MODE_KEY) === "hanzi" ? "hanzi" : "pinyin";
  } catch {
    return "pinyin";
  }
}

export function ZhDictationView({ lesson }: { lesson: ZhTextLesson }) {
  const speech = useSpeech({ lang: "zh" });
  const [mode, setMode] = useState<DictationMode>("pinyin");
  // Đọc cách gõ đã chọn sau khi hydrate (đọc trong lúc render sẽ lệch với bản dựng ở server).
  useEffect(() => setMode(readMode()), []);
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DictationResult | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const line = lesson.lines[i];

  const say = (rate: number) => speech.speak(plainText(line.zh), rate);

  function chooseMode(m: DictationMode) {
    setMode(m);
    setResult(null);
    try {
      window.localStorage.setItem(MODE_KEY, m);
    } catch {
      /* không lưu được lựa chọn thì thôi */
    }
  }

  function check() {
    const r = gradeDictation(mode, line.zh, input);
    setResult(r);
    setScores((s) => {
      const next = [...s];
      next[i] = r.percent;
      return next;
    });
  }

  function next() {
    const n = i + 1;
    if (n >= lesson.lines.length) {
      const total = lesson.lines.length;
      const percent = Math.round(scores.reduce((a, b) => a + (b ?? 0), 0) / total);
      progressActions.recordDictation(`zh-${lesson.id}`, undefined, percent, total, total);
    }
    setI(n);
    setInput("");
    setResult(null);
  }

  if (i >= lesson.lines.length) {
    const percent = Math.round(scores.reduce((a, b) => a + (b ?? 0), 0) / lesson.lines.length);
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <section className="card space-y-3 p-6 text-center" role="status">
          <p className="text-3xl font-extrabold">{percent}%</p>
          <p className="text-muted">Điểm trung bình {lesson.lines.length} câu. Kết quả đã được lưu.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setI(0);
                setScores([]);
              }}
              className="btn-ghost"
            >
              Làm lại
            </button>
            <Link href="/zh/dictation" className="btn-primary">
              Bài khác
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/zh/dictation" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Nghe chép
      </Link>
      <header>
        <h1 className="text-2xl font-extrabold">Nghe chép: {lesson.title}</h1>
        <p className="text-muted">
          Câu {i + 1}/{lesson.lines.length}
          {lesson.speakers && line.speaker ? ` · ${lesson.speakers[line.speaker]}` : ""}
        </p>
      </header>
      <ZhVoiceNotice supported={speech.supported} voiceCount={speech.voiceOptions.length} />

      <div role="radiogroup" aria-label="Cách gõ" className="flex gap-2">
        {(["pinyin", "hanzi"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => chooseMode(m)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${mode === m ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted"}`}
          >
            {m === "pinyin" ? "Gõ pinyin" : "Gõ chữ Hán"}
          </button>
        ))}
      </div>

      <section className="card space-y-4 p-5">
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => say(RATE)} className="btn-primary">
            <Volume2 className="size-4" /> Nghe
          </button>
          <button type="button" onClick={() => say(SLOW_RATE)} className="btn-ghost">
            <Snail className="size-4" /> Nghe chậm
          </button>
        </div>
        <label className="block space-y-1">
          <span className="text-sm text-muted">{mode === "pinyin" ? "Gõ pinyin, cách âm tiết bằng dấu cách; ghi thanh bằng số (ni3 hao3) hoặc dấu (nǐ hǎo). Gõ v thay cho ü." : "Gõ chữ Hán bằng bộ gõ tiếng Trung của máy (dấu câu không tính)."}</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !result && input.trim() && check()}
            disabled={!!result}
            lang={mode === "hanzi" ? "zh-Hans" : "en"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-lg outline-none focus:border-primary"
            placeholder={mode === "pinyin" ? "wo3 shi4 xue2sheng" : "我是学生"}
          />
        </label>
        {!result ? (
          <div className="flex justify-between gap-2">
            <button type="button" onClick={() => setResult(gradeDictation(mode, line.zh, ""))} className="btn-ghost text-sm">
              <Eye className="size-4" /> Bỏ qua, xem đáp án
            </button>
            <button type="button" onClick={check} disabled={!input.trim()} className="btn-primary">
              <Check className="size-4" /> Kiểm tra
            </button>
          </div>
        ) : (
          <div className="space-y-3" role="status">
            <div className="text-center text-3xl font-extrabold">{result.percent}%</div>
            <div className="flex flex-wrap justify-center gap-1" lang="zh-Hans">
              {result.marks.map((m, k) => (
                <span key={k} className={`flex flex-col items-center rounded-lg px-1.5 py-1 ${m.score === 1 ? "bg-success/10 text-success" : m.score > 0 ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"}`}>
                  <span className="text-xs">{m.syllable}</span>
                  <span className="text-2xl">{m.char}</span>
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-muted">
              Xanh: đúng · Vàng: đúng âm, sai thanh · Đỏ: sai hoặc thiếu
              <br />
              {sentencePinyin(line.zh)} — {line.vi}
            </p>
            <div className="flex justify-end">
              <button type="button" onClick={next} className="btn-primary">
                {i + 1 < lesson.lines.length ? "Câu tiếp" : "Xem kết quả"} <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
