"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, LogIn, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import type { RoadmapGoal } from "@/content/roadmap-units";
import { GOAL_LABELS, SPEAKING_PROMPTS, getSpeakingPrompt, type SpeakingPrompt } from "@/content/speaking-prompts";
import { speechStats } from "@/core/speaking";
import type { ApiResponse } from "@/lib/learner-schema";
import { progressActions } from "@/lib/progress";
import { useRoadmapState } from "@/lib/roadmap-store";
import { useSpeech } from "@/lib/speech";
import { useSpeechRecognition, type ListenResult } from "@/lib/speech-recognition";
import { FEEDBACK_LIMITS, type SpeakingFeedback } from "@/lib/speaking-feedback";
import { FeedbackView } from "./FeedbackView";
import { RecordButton } from "./RecordButton";

/** Tự dừng ghi sau 3 phút để transcript không quá dài cho AI. */
const MAX_TALK_MS = 3 * 60_000;
/** Server chờ Claude tối đa ~2 phút (60 giây × 2 lần thử); quá thì báo lỗi thay vì quay mãi. */
const REQUEST_TIMEOUT_MS = 130_000;
const FEEDBACK_XP = 10;
const GOALS = Object.keys(GOAL_LABELS) as RoadmapGoal[];
const NO_SPEECH = "Chưa nghe được câu nào. Bấm “Bắt đầu nói”, chờ chữ “Đang nghe…” rồi nói to, rõ.";

type Phase =
  | { kind: "idle" }
  | { kind: "recorded"; take: ListenResult }
  | { kind: "sending"; take: ListenResult }
  | { kind: "feedback"; take: ListenResult; feedback: SpeakingFeedback }
  | { kind: "error"; take: ListenResult; message: string };

const firstPromptOf = (goal: RoadmapGoal) => SPEAKING_PROMPTS.find((p) => p.goal === goal)!.id;

/** Kiểm tra sơ bộ dữ liệu trả về trước khi hiển thị (tránh vỡ trang nếu server trả sai dạng). */
function isFeedback(v: unknown): v is SpeakingFeedback {
  const f = v as SpeakingFeedback | null;
  return !!f && typeof f.overall === "number" && !!f.scores && Array.isArray(f.corrections) && typeof f.improvedAnswer === "string";
}

async function requestFeedback(body: object, signal: AbortSignal): Promise<{ ok: true; feedback: SpeakingFeedback } | { ok: false; message: string }> {
  try {
    const res = await fetch("/api/speaking/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    const json = (await res.json().catch(() => null)) as ApiResponse<unknown> | null;
    if (!res.ok || !json?.success) return { ok: false, message: json?.error ?? `Lỗi máy chủ (${res.status}). Hãy thử lại.` };
    if (!isFeedback(json.data)) return { ok: false, message: "Kết quả chấm không hợp lệ. Hãy thử lại." };
    return { ok: true, feedback: json.data };
  } catch (e) {
    if (e instanceof DOMException && e.name === "TimeoutError") return { ok: false, message: "AI chấm quá lâu. Hãy thử lại sau ít phút." };
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    return { ok: false, message: "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại." };
  }
}

export function FreeTalk({ initialPromptId, aiEnabled }: { initialPromptId?: string; aiEnabled: boolean }) {
  const roadmap = useRoadmapState();
  const initial = initialPromptId ? getSpeakingPrompt(initialPromptId) : undefined;
  const [goal, setGoal] = useState<RoadmapGoal>(initial?.goal ?? roadmap.profile?.goal ?? "daily");
  const [promptId, setPromptId] = useState(initial?.id ?? firstPromptOf(goal));
  const prompt = getSpeakingPrompt(promptId)!;
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [notice, setNotice] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const { speak, supported: ttsSupported } = useSpeech();
  const recognition = useSpeechRecognition();
  /** Lượt ghi/gửi hiện tại: đổi đề hoặc rời trang thì kết quả của lượt cũ bị bỏ qua. */
  const runRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const { listening, stop } = recognition;

  useEffect(() => () => abortRef.current?.abort(), []);

  // Đồng hồ khi đang nói + tự dừng khi quá lâu.
  useEffect(() => {
    if (!listening) return;
    const started = Date.now();
    const timer = setInterval(() => {
      const ms = Date.now() - started;
      setElapsed(Math.floor(ms / 1000));
      if (ms >= MAX_TALK_MS) stop();
    }, 500);
    return () => clearInterval(timer);
  }, [listening, stop]);

  function choosePrompt(id: string) {
    runRef.current += 1;
    abortRef.current?.abort();
    recognition.cancel();
    setPromptId(id);
    setNotice(null);
    setPhase({ kind: "idle" });
  }

  function chooseGoal(g: RoadmapGoal) {
    setGoal(g);
    choosePrompt(firstPromptOf(g));
  }

  async function record() {
    if (listening) return stop();
    const run = ++runRef.current;
    setElapsed(0);
    setNotice(null);
    setPhase({ kind: "idle" });
    const take = await recognition.listen({ continuous: true });
    if (run !== runRef.current) return;
    if (take) setPhase({ kind: "recorded", take });
    else setNotice(NO_SPEECH);
  }

  async function askAi(take: ListenResult) {
    const run = ++runRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase({ kind: "sending", take });
    const level = roadmap.profile?.level;
    const body = { promptId, transcript: take.transcript, seconds: Math.min(FEEDBACK_LIMITS.maxSeconds, Math.round(take.durationMs / 1000)), ...(level ? { level } : {}) };
    let result;
    try {
      result = await requestFeedback(body, AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]));
    } catch {
      return; // bị hủy vì đổi đề / rời trang
    }
    if (run !== runRef.current) return;
    if (!result.ok) return setPhase({ kind: "error", take, message: result.message });
    progressActions.addXp(FEEDBACK_XP);
    setPhase({ kind: "feedback", take, feedback: result.feedback });
  }

  const busy = phase.kind === "sending";
  const take = phase.kind === "idle" ? null : phase.take;

  return (
    <div className="space-y-5">
      <PromptPicker goal={goal} promptId={promptId} disabled={busy} onGoal={chooseGoal} onPrompt={choosePrompt} />

      <section className="card space-y-5 p-5 md:p-7" aria-label="Nói tự do">
        <PromptHeader prompt={prompt} />
        <div className="flex flex-wrap items-center justify-center gap-2">
          {ttsSupported && (
            <button type="button" onClick={() => speak(prompt.text, 0.85)} className="btn-ghost">
              <Volume2 className="size-4" /> Nghe đề
            </button>
          )}
          <RecordButton
            listening={listening}
            disabled={recognition.status !== "ready" || busy}
            idleLabel={take ? "Nói lại từ đầu" : "Bắt đầu nói"}
            listeningLabel={`Dừng (${formatTime(elapsed)})`}
            onClick={record}
          />
        </div>

        <div aria-live="polite">
          {listening && (
            <p lang="en" className="min-h-12 rounded-xl bg-surface-2 p-3 text-center">
              {recognition.live || <span className="text-muted">Đang nghe… hãy bắt đầu nói.</span>}
            </p>
          )}
        </div>
        {(recognition.error || notice) && (
          <p role="alert" className={`rounded-xl p-3 text-sm ${recognition.error ? "bg-danger-soft" : "bg-warning-soft"}`}>
            {recognition.error ?? notice}
          </p>
        )}

        {take && !listening && (
          <TranscriptPanel take={take}>
            <AiAction phase={phase} take={take} aiEnabled={aiEnabled} onAsk={askAi} />
          </TranscriptPanel>
        )}
      </section>

      {phase.kind === "feedback" && <FeedbackView feedback={phase.feedback} transcript={phase.take.transcript} onSpeak={(t) => speak(t, 0.9)} />}
    </div>
  );
}

function PromptPicker({
  goal,
  promptId,
  disabled,
  onGoal,
  onPrompt,
}: {
  goal: RoadmapGoal;
  promptId: string;
  disabled: boolean;
  onGoal: (g: RoadmapGoal) => void;
  onPrompt: (id: string) => void;
}) {
  return (
    <div className="card space-y-3 p-4 md:p-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Mục tiêu">
        {GOALS.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={goal === g}
            disabled={disabled}
            onClick={() => onGoal(g)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold disabled:opacity-60 ${goal === g ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
          >
            {GOAL_LABELS[g]}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-muted">Đề nói (theo các chủ đề của lộ trình)</span>
        <select
          value={promptId}
          disabled={disabled}
          onChange={(e) => onPrompt(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-fg disabled:opacity-60"
        >
          {SPEAKING_PROMPTS.filter((p) => p.goal === goal).map((p) => (
            <option key={p.id} value={p.id}>
              {p.unitTitle} — {p.text}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function PromptHeader({ prompt }: { prompt: SpeakingPrompt }) {
  return (
    <div className="space-y-2 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-muted">{prompt.unitTitle}</p>
      <p lang="en" className="text-2xl font-bold leading-snug md:text-3xl">
        {prompt.text}
      </p>
      <p className="text-sm text-muted">Nói ít nhất 30 giây. Cố nói thành câu đầy đủ, thêm lý do (because…) và ví dụ.</p>
    </div>
  );
}

function TranscriptPanel({ take, children }: { take: ListenResult; children: React.ReactNode }) {
  const stats = speechStats(take.transcript, take.durationMs);
  return (
    <div className="space-y-3 rounded-2xl border border-line p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">Máy nghe được</p>
      <p lang="en" className="leading-relaxed">
        {take.transcript}
      </p>
      <p className="text-sm text-muted">
        {stats.words} từ · {formatTime(stats.seconds)} · {stats.wordsPerMinute} từ/phút
        {stats.seconds < 30 && " · thử nói dài hơn 30 giây"}
      </p>
      {children}
    </div>
  );
}

function AiAction({ phase, take, aiEnabled, onAsk }: { phase: Phase; take: ListenResult; aiEnabled: boolean; onAsk: (take: ListenResult) => void }) {
  const { status } = useSession();
  if (!aiEnabled) {
    return (
      <p className="rounded-xl bg-warning-soft p-3 text-sm">
        AI sửa lỗi chưa được bật trên server: cần đặt <code>ENGQUIZ_ANTHROPIC_API_KEY</code> trong file <code>.env</code> rồi khởi động lại.
      </p>
    );
  }
  if (status === "unauthenticated") {
    return (
      <Link href={`/signin?callbackUrl=${encodeURIComponent("/speaking?tab=talk")}`} className="btn-ghost">
        <LogIn className="size-4" /> Đăng nhập để AI chấm và sửa lỗi
      </Link>
    );
  }
  if (phase.kind === "feedback") return null;
  const sending = phase.kind === "sending";
  const Icon = sending ? Loader2 : phase.kind === "error" ? RotateCcw : Sparkles;
  return (
    <div className="space-y-2">
      {phase.kind === "error" && (
        <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm">
          {phase.message}
        </p>
      )}
      <button type="button" onClick={() => onAsk(take)} disabled={sending || status === "loading"} className="btn-primary">
        <Icon className={`size-4 ${sending ? "animate-spin" : ""}`} />
        {sending ? "AI đang chấm…" : phase.kind === "error" ? "Thử lại" : "AI chấm & sửa lỗi"}
      </button>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
