"use client";

/**
 * Màn hình kết quả dùng chung cho mọi hoạt động (docs/REDESIGN.md mục 6.4):
 * số lớn · XP · (Xong Day n) · đúng một nút chính = bước tiếp theo (src/lib/next-step.ts) · tối đa một nút phụ ·
 * link nhỏ "Làm lại". Khi đang hiện, thanh "Về lộ trình" bị ẩn (body[data-result]) để không có hai nút về lộ trình.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, PartyPopper, RotateCcw, Trophy } from "lucide-react";
import { daysFor } from "@/lib/course-roadmap";
import { useCourse } from "@/lib/course-client";
import { nextStep, type StepAction, type StepLinkInput } from "@/lib/next-step";
import { readReturnTarget, saveReturnTarget, type ReturnTarget } from "@/lib/roadmap-return";
import { useRoadmapState } from "@/lib/roadmap-store";

interface Props {
  passed: boolean;
  /** Số lớn ở giữa, vd 85 (%). Bỏ trống thì không hiện. */
  percent?: number;
  /** Dòng phụ ngắn dưới số, vd "8/10". */
  detail?: string;
  /** XP vừa nhận (chỉ hiện khi > 0). */
  xp?: number;
  onRetry: () => void;
  /** Khi chưa đạt: link xem lại bài. */
  reviewLink?: StepLinkInput;
  /** Chuỗi nội dung khi không mở từ lộ trình. */
  next?: StepLinkInput;
  secondary?: StepLinkInput;
  /** Nội dung thêm bên dưới (vd danh sách câu sai). */
  children?: ReactNode;
}

const pathOf = (href: string) => href.split(/[?#]/)[0];

/**
 * Bước tiếp theo cho trang đang mở: tự lấy ngữ cảnh lộ trình (bài mở từ lộ trình, đúng trang đó) rồi gọi nextStep.
 */
export function useNextStep(input: { passed: boolean; reviewLink?: StepLinkInput; next?: StepLinkInput; secondary?: StepLinkInput }) {
  const course = useCourse();
  const pathname = usePathname();
  const { profile, log } = useRoadmapState();
  const [target, setTarget] = useState<ReturnTarget | null>(null);
  useEffect(() => setTarget(readReturnTarget(course)), [course]);

  const roadmap = useMemo(() => {
    if (!profile || !target) return undefined;
    const day = daysFor(course, profile).find((d) => d.n === target.day);
    const task = day?.tasks.find((t) => t.id === target.taskId);
    // Chỉ dùng lộ trình khi bài đang mở đúng là nhiệm vụ đã chọn (mốc cũ trong tab không được chiếm bước tiếp theo).
    if (!day || !task || pathOf(task.href) !== pathname) return undefined;
    return { day, log, currentTaskId: task.id };
  }, [profile, target, course, log, pathname]);

  return nextStep({
    course,
    passed: input.passed,
    reviewLink: input.reviewLink,
    roadmap,
    chain: input.next ? { primary: input.next, secondary: input.secondary } : undefined,
  });
}

export function ActivityResult({ passed, percent, detail, xp, onRetry, reviewLink, next, secondary, children }: Props) {
  const step = useNextStep({ passed, reviewLink, next, secondary });

  useEffect(() => {
    document.body.dataset.result = "1";
    return () => {
      delete document.body.dataset.result;
    };
  }, []);

  return (
    <section className="card animate-pop-in space-y-5 p-6 text-center" role="status">
      <span className={`mx-auto grid size-14 place-items-center rounded-2xl ${passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
        {step.dayComplete ? <PartyPopper className="size-7" /> : passed ? <Trophy className="size-7" /> : <RotateCcw className="size-7" />}
      </span>
      <div className="space-y-1">
        {percent !== undefined && <p className="text-4xl font-extrabold">{percent}%</p>}
        {detail && <p className="text-muted">{detail}</p>}
        {(xp ?? 0) > 0 && <p className="font-semibold text-primary">+{xp} XP</p>}
        {step.dayComplete && <p className="font-bold text-success">Xong Day {step.dayComplete}</p>}
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
        <StepButton action={step.primary} primary onRetry={onRetry} />
        {step.secondary && <StepButton action={step.secondary} onRetry={onRetry} />}
        {step.primary.kind !== "retry" && (
          <button type="button" onClick={onRetry} className="mx-auto mt-1 text-sm font-semibold text-muted hover:text-fg">
            Làm lại
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function StepButton({ action, primary, onRetry }: { action: StepAction; primary?: boolean; onRetry?: () => void }) {
  const cls = `${primary ? "btn-primary" : "btn-ghost"} w-full justify-center`;
  if (action.kind === "retry") {
    return (
      <button type="button" onClick={onRetry} className={cls}>
        <RotateCcw className="size-4" /> {action.label}
      </button>
    );
  }
  return (
    <Link href={action.href} onClick={() => action.returnTarget && saveReturnTarget(action.returnTarget)} className={cls}>
      <span className="truncate">{action.label}</span>
      {primary && <ArrowRight className="size-4 shrink-0" />}
    </Link>
  );
}
