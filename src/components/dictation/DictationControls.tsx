"use client";

import { Eye, Gauge, Lightbulb, Play, RotateCcw, SkipForward, Square } from "lucide-react";
import { maskSentence, type DictationCheck } from "@/core/dictation";

/** Nút bắt đầu (trình duyệt chỉ cho phát tiếng sau thao tác của người dùng). */
export function DictationStart({ description, onStart }: { description: string; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <button
        type="button"
        onClick={onStart}
        className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105"
        aria-label="Bắt đầu nghe"
      >
        <Play className="ml-1 size-9" fill="currentColor" />
      </button>
      <p className="font-semibold">Bấm để bắt đầu nghe</p>
      <p className="max-w-sm text-sm text-muted">{description}</p>
    </div>
  );
}

export interface VoiceOption {
  id: string;
  label: string;
}

/** Trình phát: nghe / dừng, nghe lại, tốc độ, giọng đọc. */
export function DictationAudioControls({
  speaking,
  plays,
  rate,
  speeds,
  voiceOptions,
  voiceId,
  onPlay,
  onStop,
  onRate,
  onVoice,
}: {
  speaking: boolean;
  plays: number;
  rate: number;
  speeds: readonly number[];
  voiceOptions: readonly VoiceOption[];
  voiceId: string;
  onPlay: () => void;
  onStop: () => void;
  onRate: (rate: number) => void;
  onVoice: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={speaking ? onStop : onPlay}
          className={`grid size-16 place-items-center rounded-full text-white shadow-lg transition hover:scale-105 ${
            speaking ? "bg-danger shadow-danger/30" : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30"
          }`}
          aria-label={speaking ? "Dừng" : "Nghe"}
        >
          {speaking ? <Square className="size-6" fill="currentColor" /> : <Play className="ml-1 size-7" fill="currentColor" />}
        </button>
        <button type="button" onClick={onPlay} className="btn-ghost" title="Nghe lại (Ctrl + Space)">
          <RotateCcw className="size-4" /> Nghe lại
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <Gauge className="size-4 text-muted" />
        {speeds.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onRate(s)}
            className={`rounded-lg px-2.5 py-1 font-semibold transition ${rate === s ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
          >
            {s}x
          </button>
        ))}
        <span className="text-xs text-muted">· đã nghe {plays} lần</span>
      </div>
      {voiceOptions.length > 1 && (
        <select
          value={voiceId}
          onChange={(e) => onVoice(e.target.value)}
          className="max-w-full rounded-lg border border-line bg-surface px-2 py-1 text-sm text-muted"
          aria-label="Chọn giọng đọc"
        >
          {voiceOptions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

/** Ô nhập câu nghe được và các nút kiểm tra / gợi ý / đáp án / bỏ qua. */
export function DictationAnswer({
  text,
  input,
  result,
  solved,
  showSkeleton,
  inputRef,
  onInput,
  onCheck,
  onHint,
  onReveal,
  onSkip,
  onShowSkeleton,
}: {
  text: string;
  input: string;
  result: DictationCheck | null;
  solved: boolean;
  showSkeleton: boolean;
  inputRef: React.Ref<HTMLTextAreaElement>;
  onInput: (value: string) => void;
  onCheck: () => void;
  onHint: () => void;
  onReveal: () => void;
  onSkip: () => void;
  onShowSkeleton: (show: boolean) => void;
}) {
  return (
    <section className="space-y-3">
      {showSkeleton && !result && (
        <p className="rounded-xl bg-surface-2 px-4 py-2 font-mono text-sm tracking-wider text-muted" aria-label="Khung gợi ý số chữ">
          {maskSentence(text)}
        </p>
      )}
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => onInput(e.target.value)}
        disabled={solved}
        rows={3}
        placeholder="Gõ những gì bạn nghe được..."
        className="input resize-none font-mono text-[17px] leading-relaxed"
        aria-label="Nội dung bạn nghe được"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <div className="flex flex-wrap items-center gap-2">
        {!solved && (
          <button type="button" onClick={onCheck} disabled={!input.trim()} className="btn-primary px-6">
            Kiểm tra
          </button>
        )}
        {result && !solved && (
          <button type="button" onClick={onHint} className="btn-ghost" title="Hiện một từ đang bị che">
            <Lightbulb className="size-4" /> Gợi ý 1 từ
          </button>
        )}
        {!solved && (
          <>
            <button type="button" onClick={onReveal} className="btn-ghost">
              <Eye className="size-4" /> Hiện đáp án
            </button>
            <button type="button" onClick={onSkip} className="btn-ghost text-muted">
              <SkipForward className="size-4" /> Bỏ qua
            </button>
          </>
        )}
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={showSkeleton} onChange={(e) => onShowSkeleton(e.target.checked)} className="accent-[var(--primary)]" />
          Hiện số chữ
        </label>
      </div>
    </section>
  );
}
