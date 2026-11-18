"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { StepButton, useNextStep } from "@/components/lesson/ActivityResult";
import { progressActions, useProgress } from "@/lib/progress";

/** Cuối trang lý thuyết: đánh dấu đã đọc khi cuộn tới đây + nút sang Quiz / Nghe chép. */
export function TheoryFooter({ slug, dictationId }: { slug: string; dictationId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useProgress();
  const read = !!p.topics[slug]?.theoryRead;
  // Đọc xong lý thuyết → Quiz chủ điểm (phụ: Nghe chép); mở từ lộ trình → nhiệm vụ kế tiếp của ngày.
  const step = useNextStep({
    passed: true,
    next: { label: "Làm Quiz", href: `/quiz/topic-${slug}` },
    secondary: dictationId ? { label: "Nghe & chép", href: `/dictation/${dictationId}` } : undefined,
  });

  // Vẫn theo dõi khi đã đọc trước đó: lần đọc này có thể là một bài trong lộ trình (markTheoryRead chỉ cộng XP lần đầu).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) progressActions.markTheoryRead(slug);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);

  return (
    <div ref={ref} className="card p-5 md:p-6">
      <div className="flex items-center gap-2 font-semibold">
        <CheckCircle2 className={`size-5 ${read ? "text-success" : "text-muted"}`} />
        {read ? "Đã đọc xong lý thuyết (+5 XP)" : "Đọc đến đây là xong phần lý thuyết"}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StepButton action={step.primary} primary />
        {step.secondary && <StepButton action={step.secondary} />}
      </div>
    </div>
  );
}
