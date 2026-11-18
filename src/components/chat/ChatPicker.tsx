"use client";

/** Chọn tình huống nhập vai hoặc trò chuyện tự do (kèm cấp độ). */
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { scenariosFor, type ChatScenario } from "@/content/chat-scenarios";
import { CHAT_LEVELS } from "@/lib/ai-chat";
import type { CourseCode } from "@/lib/course";

export interface ChatChoice {
  scenario?: ChatScenario;
  level: string;
}

export function ChatPicker({ course, onPick }: { course: CourseCode; onPick: (c: ChatChoice) => void }) {
  const levels = CHAT_LEVELS[course];
  const [freeLevel, setFreeLevel] = useState(levels[1] ?? levels[0]);

  return (
    <div className="space-y-6">
      <section className="card space-y-3 p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <h2 className="font-bold">Trò chuyện tự do</h2>
            <p className="text-sm text-muted">Nói về bất kỳ chủ đề nào, AI sửa lỗi từng câu.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {levels.map((lv) => (
            <button
              key={lv}
              type="button"
              aria-pressed={freeLevel === lv}
              onClick={() => setFreeLevel(lv)}
              className={`chip ${freeLevel === lv ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
            >
              {lv}
            </button>
          ))}
          <button type="button" onClick={() => onPick({ level: freeLevel })} className="btn-primary ml-auto">
            Bắt đầu
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Nhập vai</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scenariosFor(course).map((s) => (
            <button key={s.id} type="button" onClick={() => onPick({ scenario: s, level: s.level })} className="card flex items-start gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-2xl" aria-hidden="true">
                {s.emoji}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="font-bold">{s.title}</span>
                  <span className="chip shrink-0 bg-surface-2 text-xs text-muted">{s.level}</span>
                </span>
                <span className="mt-1 block text-sm text-muted">{s.goal}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
