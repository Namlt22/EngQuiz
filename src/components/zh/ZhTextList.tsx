"use client";

/** Danh sách hội thoại / bài đọc / bài nghe chép tiếng Trung kèm điểm cao nhất. */
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ZH_DIALOGUES, ZH_READINGS, ZH_TEXTS, type ZhTextLesson } from "@/content/zh/texts";
import { plainText } from "@/core/zh-sentence";
import { PASS_PERCENT, type ProgressState } from "@/lib/progress-calc";
import { useProgress } from "@/lib/progress";

export type ZhTextListKind = "dialogue" | "reading" | "dictation";

const META: Record<ZhTextListKind, { title: string; intro: string; href: (id: string) => string; items: ZhTextLesson[] }> = {
  dialogue: {
    title: "Hội thoại",
    intro: "Tình huống giao tiếp hằng ngày. Nghe từng câu hoặc cả bài (mỗi vai một giọng), chạm vào từ để xem nghĩa, trả lời câu hỏi.",
    href: (id) => `/zh/dialogues/${id}`,
    items: ZH_DIALOGUES,
  },
  reading: {
    title: "Bài đọc",
    intro: "Bài đọc ngắn chỉ dùng từ trong cấp. Bật/tắt pinyin và bản dịch, chạm vào từ để xem nghĩa, có câu hỏi đọc hiểu.",
    href: (id) => `/zh/reading/${id}`,
    items: ZH_READINGS,
  },
  dictation: {
    title: "Nghe chép",
    intro: "Nghe từng câu của bài hội thoại / bài đọc rồi gõ lại bằng pinyin hoặc chữ Hán. Máy chấm từng chữ, từng thanh điệu.",
    href: (id) => `/zh/dictation/${id}`,
    items: ZH_TEXTS,
  },
};

function bestOf(kind: ZhTextListKind, p: ProgressState, id: string): number | undefined {
  if (kind === "dialogue") return p.dialogues?.[id]?.best;
  if (kind === "reading") return p.reading?.[id]?.best;
  return p.dictations[`zh-${id}`]?.best;
}

export function ZhTextList({ kind }: { kind: ZhTextListKind }) {
  const meta = META[kind];
  const progress = useProgress();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-extrabold md:text-3xl">{meta.title} HSK 1</h1>
        <p className="max-w-2xl text-muted">{meta.intro}</p>
      </header>
      <ol className="grid gap-3 md:grid-cols-2">
        {meta.items.map((t) => {
          const best = bestOf(kind, progress, t.id);
          const passed = best !== undefined && best >= PASS_PERCENT;
          return (
            <li key={t.id}>
              <Link href={meta.href(t.id)} className={`card group flex h-full items-center gap-3 p-4 transition hover:shadow-md ${passed ? "border-success/40" : ""}`}>
                <span className="min-w-0 flex-1">
                  {kind === "dictation" && <span className="chip mb-1 bg-surface-2">{t.kind === "dialogue" ? "Hội thoại" : "Bài đọc"}</span>}
                  <span className="block font-bold">{t.title}</span>
                  <span className="block text-lg" lang="zh-Hans">
                    {plainText(t.zhTitle)}
                  </span>
                  <span className="block text-sm text-muted">
                    {t.lines.length} câu{best !== undefined ? ` · cao nhất ${best}%` : ""}
                  </span>
                </span>
                {passed ? <CheckCircle2 className="size-5 shrink-0 text-success" /> : <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1" />}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
