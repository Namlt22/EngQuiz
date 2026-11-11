"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CheckCircle2, Headphones, PenLine } from "lucide-react";
import { progressActions, useProgress } from "@/lib/progress";

/** Cuối trang lý thuyết: đánh dấu đã đọc khi cuộn tới đây + nút sang Quiz / Nghe chép. */
export function TheoryFooter({ slug, dictationId }: { slug: string; dictationId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useProgress();
  const read = !!p.topics[slug]?.theoryRead;

  useEffect(() => {
    const el = ref.current;
    if (!el || read) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) progressActions.markTheoryRead(slug);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug, read]);

  return (
    <div ref={ref} className="card p-5 md:p-6">
      <div className="flex items-center gap-2 font-semibold">
        <CheckCircle2 className={`size-5 ${read ? "text-success" : "text-muted"}`} />
        {read ? "Đã đọc xong lý thuyết (+5 XP)" : "Đọc đến đây là xong phần lý thuyết"}
      </div>
      <p className="mt-1 text-sm text-muted">Bước tiếp theo: luyện ngay để nhớ lâu hơn.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href={`/quiz/topic-${slug}`} className="btn-primary py-3">
          <PenLine className="size-4" /> Làm Quiz
        </Link>
        {dictationId && (
          <Link href={`/dictation/${dictationId}`} className="btn-ghost py-3">
            <Headphones className="size-4" /> Nghe & chép
          </Link>
        )}
      </div>
    </div>
  );
}
