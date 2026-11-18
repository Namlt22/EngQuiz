"use client";

/** Một tin nhắn trong cuộc trò chuyện: của AI (nghe lại, pinyin, bản dịch) hoặc của người học (kèm sửa lỗi). */
import { useState } from "react";
import { CheckCircle2, Languages, Volume2 } from "lucide-react";
import type { ChatCorrection } from "@/lib/ai-chat";
import type { CourseCode } from "@/lib/course";
import { SaveWordButton } from "@/components/notebook/SaveWordButton";

export interface UiMessage {
  id: string;
  role: "learner" | "ai";
  text: string;
  pinyin?: string;
  vi?: string;
  correction?: ChatCorrection | null;
}

export function ChatBubble({ msg, course, showPinyin, onSpeak }: { msg: UiMessage; course: CourseCode; showPinyin: boolean; onSpeak: (text: string) => void }) {
  const [showVi, setShowVi] = useState(false);
  const lang = course === "zh" ? "zh-Hans" : "en";

  if (msg.role === "learner") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <p lang={lang} className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-fg">
          {msg.text}
        </p>
        {msg.correction && (
          <div className="max-w-[85%] rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
            <p className="flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <span lang={lang} className="font-semibold">
                {msg.correction.corrected}
              </span>
            </p>
            {msg.correction.explanationVi && <p className="mt-1 text-muted">{msg.correction.explanationVi}</p>}
            <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted">
              Do AI tạo, có thể sai
              <SaveWordButton entry={correctionEntry(msg.correction)} className="size-7" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-surface-2 px-4 py-2.5">
        {showPinyin && msg.pinyin && <p className="text-sm text-muted">{msg.pinyin}</p>}
        <p lang={lang} className={course === "zh" ? "text-lg" : ""}>
          {msg.text}
        </p>
        {showVi && msg.vi && <p className="mt-1 border-t border-line pt-1 text-sm text-muted">{msg.vi}</p>}
      </div>
      <div className="flex gap-1 pl-1">
        <button type="button" onClick={() => onSpeak(msg.text)} className="grid size-7 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg" aria-label="Nghe">
          <Volume2 className="size-4" />
        </button>
        {msg.vi && (
          <button
            type="button"
            onClick={() => setShowVi((v) => !v)}
            aria-pressed={showVi}
            className={`grid size-7 place-items-center rounded-lg hover:bg-surface-2 ${showVi ? "text-primary" : "text-muted hover:text-fg"}`}
            aria-label="Dịch"
          >
            <Languages className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/** Câu đã sửa → mục Sổ tay (nghĩa = giải thích tiếng Việt của AI). */
export const correctionEntry = (c: ChatCorrection) => ({ term: c.corrected, meaning: c.explanationVi || "Câu đúng", source: "chat" });
