"use client";

import { ArrowRight, CheckCircle2, Lightbulb, MessageCircleQuestion, Volume2 } from "lucide-react";
import { CORRECTION_LABELS, type SpeakingFeedback } from "@/lib/speaking-feedback";
import { ScoreBadge, scoreTone } from "./ScoreBadge";

const SCORE_LABELS: Record<keyof SpeakingFeedback["scores"], string> = {
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
  fluency: "Trôi chảy",
  task: "Đúng trọng tâm",
};

export function FeedbackView({
  feedback,
  transcript,
  onSpeak,
}: {
  feedback: SpeakingFeedback;
  transcript: string;
  onSpeak: (text: string) => void;
}) {
  return (
    <section className="card animate-pop-in space-y-6 p-5 md:p-7" aria-label="Kết quả AI chấm">
      <div className="flex flex-wrap items-center gap-3">
        <ScoreBadge score={feedback.overall} label="Điểm tổng" />
        <span className="chip bg-surface-2">Ước lượng trình độ: {feedback.estimatedLevel}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(SCORE_LABELS) as (keyof SpeakingFeedback["scores"])[]).map((k) => {
          const value = feedback.scores[k];
          return (
            <div key={k} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{SCORE_LABELS[k]}</span>
                <span className="text-muted">{value}/10</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div className={`h-full rounded-full ${scoreTone(value * 10)}`} style={{ width: `${value * 10}%`, backgroundColor: "currentColor" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold">Sửa lỗi ({feedback.corrections.length})</h3>
        {feedback.corrections.length === 0 ? (
          <p className="flex items-center gap-2 text-success">
            <CheckCircle2 className="size-5" /> Không có lỗi đáng kể. Tốt lắm!
          </p>
        ) : (
          <ol className="space-y-3">
            {feedback.corrections.map((c, i) => (
              <li key={i} className="space-y-1.5 rounded-2xl border border-line p-3">
                <span className="chip bg-surface-2 text-xs">{CORRECTION_LABELS[c.type]}</span>
                <p lang="en" className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-danger-soft px-2 py-0.5 text-danger line-through">{c.original}</span>
                  <ArrowRight className="size-4 text-muted" />
                  <span className="rounded-lg bg-success-soft px-2 py-0.5 font-semibold text-success">{c.corrected}</span>
                  <button type="button" onClick={() => onSpeak(c.corrected)} className="text-primary" aria-label={`Nghe: ${c.corrected}`}>
                    <Volume2 className="size-4" />
                  </button>
                </p>
                <p className="text-sm text-muted">{c.explanationVi}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="space-y-2 rounded-2xl bg-surface-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold">Câu trả lời tự nhiên hơn</h3>
          <button type="button" onClick={() => onSpeak(feedback.improvedAnswer)} className="btn-ghost !px-3 !py-1.5 text-sm">
            <Volume2 className="size-4" /> Nghe
          </button>
        </div>
        <p lang="en" className="leading-relaxed">
          {feedback.improvedAnswer}
        </p>
        <details className="text-sm text-muted">
          <summary className="cursor-pointer">So với bạn nói</summary>
          <p lang="en" className="mt-1">
            {transcript}
          </p>
        </details>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FeedbackList title="Bạn làm tốt" icon={<CheckCircle2 className="size-4 text-success" />} items={feedback.strengthsVi} />
        <FeedbackList title="Lần sau thử" icon={<Lightbulb className="size-4 text-warning" />} items={feedback.tipsVi} />
      </div>

      {feedback.followUpQuestion && (
        <p className="flex items-start gap-2 rounded-2xl border border-line p-3">
          <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            <span className="text-sm text-muted">Câu hỏi tiếp để tự luyện: </span>
            <span lang="en" className="font-semibold">
              {feedback.followUpQuestion}
            </span>
          </span>
        </p>
      )}
    </section>
  );
}

function FeedbackList({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 font-bold">
        {icon} {title}
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
