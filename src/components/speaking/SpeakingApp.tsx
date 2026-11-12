"use client";

import { useState } from "react";
import { BookOpenText, MessagesSquare, ShieldAlert } from "lucide-react";
import { useSpeechRecognition } from "@/lib/speech-recognition";
import { FreeTalk } from "./FreeTalk";
import { ReadAloud } from "./ReadAloud";

export type SpeakingTab = "read" | "talk";

const TABS: { id: SpeakingTab; label: string; hint: string; icon: typeof BookOpenText }[] = [
  { id: "read", label: "Đọc theo câu mẫu", hint: "Chấm từng từ máy nghe được", icon: BookOpenText },
  { id: "talk", label: "Nói tự do + AI sửa lỗi", hint: "Trả lời câu hỏi, AI chấm và sửa", icon: MessagesSquare },
];

export function SpeakingApp({
  initialTab,
  initialSetId,
  initialPromptId,
  aiEnabled,
}: {
  initialTab: SpeakingTab;
  initialSetId?: string;
  initialPromptId?: string;
  aiEnabled: boolean;
}) {
  const [tab, setTab] = useState<SpeakingTab>(initialTab);
  const { status } = useSpeechRecognition();

  function choose(next: SpeakingTab) {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    history.replaceState(null, "", url);
  }

  return (
    <div className="space-y-5">
      {status !== "ready" && <SupportNotice status={status} />}

      <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Kiểu luyện nói">
        {TABS.map(({ id, label, hint, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => choose(id)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
              tab === id ? "border-primary bg-primary-soft" : "border-line bg-surface hover:border-primary/50"
            }`}
          >
            <Icon className={`size-6 shrink-0 ${tab === id ? "text-primary" : "text-muted"}`} />
            <span>
              <span className="block font-bold">{label}</span>
              <span className="text-sm text-muted">{hint}</span>
            </span>
          </button>
        ))}
      </div>

      {tab === "read" ? <ReadAloud initialSetId={initialSetId} /> : <FreeTalk initialPromptId={initialPromptId} aiEnabled={aiEnabled} />}
    </div>
  );
}

function SupportNotice({ status }: { status: "unsupported" | "insecure" }) {
  return (
    <p className="flex gap-2 rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm leading-relaxed">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-danger" />
      {status === "unsupported" ? (
        <span>
          Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Hãy dùng <b>Chrome</b> hoặc <b>Edge</b> (máy tính, Android) hoặc <b>Safari</b> (iPhone,
          iPad).
        </span>
      ) : (
        <span>
          Micro chỉ dùng được khi trang mở bằng <b>https://</b> hoặc trên chính máy chạy server (localhost). Hãy mở địa chỉ https của EngQuiz (xem
          README, mục “Dùng từ máy khác trong cùng mạng”).
        </span>
      )}
    </p>
  );
}
