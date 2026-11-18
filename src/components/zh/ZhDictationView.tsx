"use client";

/**
 * Nghe chép tiếng Trung theo từng câu của một bài hội thoại / bài đọc.
 * Hai cách gõ: pinyin (số thanh hoặc dấu thanh) — hợp với HSK 1–2; chữ Hán (dùng bộ gõ của máy).
 * Chấm từng chữ/âm tiết (src/core/zh-dictation.ts); xong bài thì ghi điểm, đạt thì lộ trình tự tích.
 */
import { useEffect, useState } from "react";
import { ArrowRight, Check, Eye, Snail, Volume2 } from "lucide-react";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { ZH_TEXTS, type ZhTextLesson } from "@/content/zh/texts";
import { gradeDictation, type DictationMode, type DictationResult } from "@/core/zh-dictation";
import { plainText, sentencePinyin } from "@/core/zh-sentence";
import { PASS_PERCENT, progressActions } from "@/lib/progress";
import { ActivityResult } from "@/components/lesson/ActivityResult";
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
  const following = ZH_TEXTS[ZH_TEXTS.findIndex((t) => t.id === lesson.id) + 1];
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
      <div className="mx-auto max-w-2xl">
        <ActivityResult
          passed={percent >= PASS_PERCENT}
          percent={percent}
          onRetry={() => {
            setI(0);
            setScores([]);
          }}
          reviewLink={{ label: "Xem lại bài", href: `/zh/${lesson.kind === "dialogue" ? "dialogues" : "reading"}/${lesson.id}` }}
          next={following ? { label: following.title, href: `/zh/dictation/${following.id}` } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <SessionHeader exitHref="/zh/dictation" value={(i / lesson.lines.length) * 100} current={i + 1} total={lesson.lines.length} />
      <header>
        <h1 className="text-lg font-bold">{lesson.title}</h1>
        {lesson.speakers && line.speaker && <p className="text-muted">{lesson.speakers[line.speaker]}</p>}
      </header>
      <ZhVoiceNotice speech={speech} />

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
              <Eye className="size-4" /> Xem đáp án
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
