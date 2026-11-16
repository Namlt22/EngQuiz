"use client";

/**
 * Thanh mỏng dưới header khi người học đang làm một bài mở từ lộ trình:
 * cho biết bài đó đã được ghi nhận xong chưa và có nút về lại đúng ngày trong lộ trình.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Route, X } from "lucide-react";
import { buildRoadmap } from "@/lib/roadmap";
import { buildDays, taskDone } from "@/lib/roadmap-days";
import { clearReturnTarget, readReturnTarget, roadmapDayHref, type ReturnTarget } from "@/lib/roadmap-return";
import { useRoadmapState } from "@/lib/roadmap-store";

export function RoadmapReturnBar() {
  const pathname = usePathname();
  const { profile, log } = useRoadmapState();
  const [target, setTarget] = useState<ReturnTarget | null>(null);

  useEffect(() => {
    if (pathname === "/roadmap") {
      clearReturnTarget();
      setTarget(null);
    } else {
      setTarget(readReturnTarget());
    }
  }, [pathname]);

  const task = useMemo(() => {
    if (!profile || !target) return undefined;
    return buildDays(buildRoadmap(profile))
      .find((d) => d.n === target.day)
      ?.tasks.find((t) => t.id === target.taskId);
  }, [profile, target]);

  if (!target || !task) return null;
  const done = taskDone(log, task);

  return (
    <div className={`border-b ${done ? "border-success/30 bg-success/10" : "border-primary/20 bg-primary-soft"}`} role="status">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm">
        {done ? <CheckCircle2 className="size-5 shrink-0 text-success" /> : <Route className="size-5 shrink-0 text-primary" />}
        <span className="min-w-0 flex-1 truncate">
          <b>Day {target.day}</b> · {done ? "Đã xong bài này — học bài tiếp theo trong lộ trình" : <>Đang học: {target.title}</>}
        </span>
        <Link href={roadmapDayHref(target.day)} className={`shrink-0 px-3 py-1.5 text-xs ${done ? "btn-primary" : "btn-ghost"}`}>
          <ArrowLeft className="size-3.5" /> Về lộ trình
        </Link>
        <button
          type="button"
          onClick={() => {
            clearReturnTarget();
            setTarget(null);
          }}
          className="grid size-7 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface-2"
          aria-label="Ẩn thanh lộ trình"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
