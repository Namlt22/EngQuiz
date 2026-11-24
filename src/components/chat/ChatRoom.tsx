"use client";

/**
 * Một cuộc trò chuyện với AI. Lịch sử nằm ở trình duyệt; mỗi tin gửi kèm cả lịch sử lên /api/chat.
 * Câu mở đầu hiện sẵn (không tốn lượt). Tin đầu tiên mở cuộc = 1 lượt AI.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mic, PartyPopper, RotateCcw, Send, Sparkles, Square } from "lucide-react";
import { FREE_CHAT_OPENING } from "@/content/chat-scenarios";
import { CHAT_LIMITS, FREE_CHAT_ID, type ChatReply } from "@/lib/ai-chat";
import type { CourseCode } from "@/lib/course";
import type { ApiResponse } from "@/lib/learner-schema";
import { useSpeech } from "@/lib/speech";
import { useSpeechRecognition } from "@/lib/speech-recognition";
import { ChatBubble, correctionEntry, type UiMessage } from "./ChatBubble";
import { SaveWordButton } from "@/components/notebook/SaveWordButton";
import { progressActions } from "@/lib/progress";
import type { ChatChoice } from "./ChatPicker";

type Phase = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string; status: number };

const REQUEST_TIMEOUT_MS = 45_000;

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function isReply(d: unknown): d is ChatReply {
  const r = d as ChatReply | null;
  return !!r && typeof r.reply === "string" && typeof r.replyVi === "string" && typeof r.turnsLeft === "number";
}

export function ChatRoom({ course, choice, onExit }: { course: CourseCode; choice: ChatChoice; onExit: () => void }) {
  const opening = choice.scenario?.opening ?? FREE_CHAT_OPENING[course];
  const start = (): UiMessage[] => [{ id: newId(), role: "ai", text: opening.text, pinyin: opening.pinyin, vi: opening.vi }];
  const [conversationId, setConversationId] = useState(newId);
  const [messages, setMessages] = useState<UiMessage[]>(start);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [turnsLeft, setTurnsLeft] = useState<number>(CHAT_LIMITS.maxLearnerTurns);
  const [ended, setEnded] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const { speak, stop } = useSpeech({ lang: course });
  const recognition = useSpeechRecognition({ lang: course === "zh" ? "zh-CN" : "en-US" });
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, phase]);
  useEffect(() => () => abortRef.current?.abort(), []);

  const learnerCount = messages.filter((m) => m.role === "learner").length;
  const outOfTurns = turnsLeft <= 0 || learnerCount >= CHAT_LIMITS.maxLearnerTurns;
  const locked = phase.kind === "sending" || ended || outOfTurns;

  async function send(text: string) {
    const clean = text.trim().slice(0, CHAT_LIMITS.maxMessageChars);
    if (!clean || locked) return;
    stop();
    const learner: UiMessage = { id: newId(), role: "learner", text: clean };
    const history = [...messages, learner];
    setMessages(history);
    setInput("");
    setPhase({ kind: "sending" });
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = window.setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          course,
          scenarioId: choice.scenario?.id ?? FREE_CHAT_ID,
          level: choice.level,
          conversationId,
          messages: history.map((m) => ({ role: m.role, text: m.text })),
        }),
        signal: ctrl.signal,
      });
      const json = (await res.json().catch(() => null)) as ApiResponse<unknown> | null;
      if (!res.ok || !json?.success || !isReply(json.data)) {
        // Gửi lỗi: bỏ tin vừa gửi khỏi lịch sử để gửi lại không bị trùng, trả chữ về ô nhập.
        setMessages(messages);
        setInput(clean);
        setPhase({ kind: "error", status: res.status, message: json?.error ?? `Lỗi máy chủ (${res.status}). Hãy thử lại.` });
        return;
      }
      const r = json.data;
      setMessages([...messages, { ...learner, correction: r.correction }, { id: newId(), role: "ai", text: r.reply, pinyin: r.replyPinyin, vi: r.replyVi }]);
      setTurnsLeft(r.turnsLeft);
      setEnded(r.ended);
      setPhase({ kind: "idle" });
      speak(r.reply);
    } catch {
      if (ctrl.signal.aborted && abortRef.current !== ctrl) return; // rời trang / cuộc mới
      setMessages(messages);
      setInput(clean);
      setPhase({ kind: "error", status: 0, message: ctrl.signal.aborted ? "AI trả lời quá lâu. Hãy thử lại." : "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại." });
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function talk() {
    if (recognition.listening) return recognition.stop();
    stop();
    const result = await recognition.listen({ continuous: false });
    if (result) setInput((prev) => (prev ? `${prev} ${result.transcript}` : result.transcript));
  }

  function restart() {
    abortRef.current?.abort();
    abortRef.current = null;
    stop();
    setConversationId(newId());
    setMessages(start());
    setInput("");
    setTurnsLeft(CHAT_LIMITS.maxLearnerTurns);
    setEnded(false);
    setPhase({ kind: "idle" });
  }

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onExit} className="btn-ghost px-2" aria-label="Chọn tình huống khác">
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-bold">
            {choice.scenario ? `${choice.scenario.emoji} ${choice.scenario.title}` : "Trò chuyện tự do"} <span className="chip bg-surface-2 text-xs text-muted">{choice.level}</span>
          </h2>
          {choice.scenario && <p className="text-sm text-muted">Mục tiêu: {choice.scenario.goal}</p>}
        </div>
        {course === "zh" && (
          <button type="button" onClick={() => setShowPinyin((v) => !v)} aria-pressed={showPinyin} className="btn-ghost text-sm">
            Pinyin
          </button>
        )}
        <span className="text-xs text-muted">{Math.max(0, turnsLeft)} tin còn lại</span>
      </header>

      <div className="card space-y-3 p-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} course={course} showPinyin={showPinyin} onSpeak={(t) => speak(t)} />
        ))}
        {phase.kind === "sending" && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" /> AI đang trả lời…
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {phase.kind === "error" && <ChatError phase={phase} course={course} />}

      {ended || outOfTurns ? (
        <div className="card space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <PartyPopper className="size-6 text-primary" />
            <p className="flex-1 font-semibold">{ended ? "Hoàn thành cuộc trò chuyện!" : `Đã đủ ${CHAT_LIMITS.maxLearnerTurns} tin của cuộc này.`}</p>
            <button type="button" onClick={restart} className="btn-primary">
              <RotateCcw className="size-4" /> Cuộc mới
            </button>
          </div>
          <ChatSummary messages={messages} lang={course === "zh" ? "zh-Hans" : "en"} />
        </div>
      ) : (
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <button
            type="button"
            onClick={() => void talk()}
            disabled={phase.kind === "sending" || recognition.status !== "ready" || recognition.recognizing}
            aria-pressed={recognition.listening}
            aria-label={recognition.recognizing ? "Đang nhận dạng" : recognition.listening ? "Dừng nói" : "Nói"}
            className={`grid size-11 shrink-0 place-items-center rounded-xl border border-line ${recognition.listening ? "animate-pulse bg-danger text-white" : "bg-surface text-primary hover:bg-surface-2"} disabled:opacity-50`}
          >
            {recognition.recognizing ? <Loader2 className="size-4 animate-spin" /> : recognition.listening ? <Square className="size-4" /> : <Mic className="size-5" />}
          </button>
          <textarea
            value={recognition.listening ? recognition.live || input : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send(input);
              }
            }}
            maxLength={CHAT_LIMITS.maxMessageChars}
            rows={1}
            lang={course === "zh" ? "zh-Hans" : "en"}
            placeholder={course === "zh" ? "Gõ chữ Hán hoặc pinyin…" : "Type your message…"}
            className="input min-h-11 flex-1 resize-none py-2.5"
          />
          <button type="submit" disabled={!input.trim() || phase.kind === "sending"} className="btn-primary h-11 px-4" aria-label="Gửi">
            <Send className="size-4" />
          </button>
        </form>
      )}
      {recognition.error && <p className="text-sm text-danger">{recognition.error}</p>}
      <p className="text-xs text-muted">
        Không gửi thông tin cá nhân nhạy cảm ·{" "}
        <Link href="/legal/ai" className="font-semibold text-primary hover:underline">
          Điều khoản AI
        </Link>
      </p>
    </div>
  );
}

function ChatError({ phase, course }: { phase: Extract<Phase, { kind: "error" }>; course: CourseCode }) {
  const here = course === "zh" ? "/zh/chat" : "/chat";
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl bg-danger-soft p-3 text-sm">
      <p className="flex-1">{phase.message}</p>
      {phase.status === 401 && (
        <Link href={`/signin?callbackUrl=${encodeURIComponent(here)}`} className="btn-ghost">
          Đăng nhập
        </Link>
      )}
      {phase.status === 402 && (
        <Link href="/pricing#referral" className="btn-primary">
          <Sparkles className="size-4" /> Gói AI
        </Link>
      )}
    </div>
  );
}

/** Hết cuộc: các câu đã được sửa, lưu từng câu hoặc lưu tất cả vào Sổ tay. */
function ChatSummary({ messages, lang }: { messages: UiMessage[]; lang: string }) {
  const fixes = messages.flatMap((m) => (m.correction ? [m.correction] : []));
  if (!fixes.length) return null;
  return (
    <div className="space-y-2 border-t border-line pt-3">
      <ul className="space-y-1.5">
        {fixes.map((c, k) => (
          <li key={k} className="flex items-center gap-2 text-sm">
            <span lang={lang} className="flex-1 font-semibold">
              {c.corrected}
            </span>
            <SaveWordButton entry={correctionEntry(c)} className="size-7" />
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => fixes.forEach((c) => progressActions.addToNotebook(correctionEntry(c)))} className="btn-ghost text-sm">
        Lưu tất cả
      </button>
    </div>
  );
}
