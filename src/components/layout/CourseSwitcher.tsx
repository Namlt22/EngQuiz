"use client";

/**
 * Nút chuyển ngôn ngữ đang học (cạnh logo). Chọn khoá khác → lưu lựa chọn và mở trang chủ của khoá đó.
 * Tiến độ, XP, chuỗi ngày của mỗi khoá tách riêng (src/lib/progress.ts).
 */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { COURSES, COURSE_CODES, type CourseCode } from "@/lib/course";
import { setPreferredCourse, useCourse } from "@/lib/course-client";
import { CourseMark } from "./CourseMark";

export function CourseSwitcher() {
  const course = useCourse();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = COURSES[course];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (code: CourseCode) => {
    setOpen(false);
    setPreferredCourse(code);
    if (code !== course) router.push(COURSES[code].home);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-1.5 text-sm sm:px-2 font-semibold transition hover:bg-surface-2"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Đang học ${current.name}. Đổi ngôn ngữ`}
        onClick={() => setOpen((o) => !o)}
      >
        <CourseMark course={course} className="size-6 text-[10px]" />
        <span className="hidden xl:inline">{current.name}</span>
        <ChevronDown className={`hidden size-4 text-muted transition sm:block ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div role="menu" className="card w-64 space-y-1 p-2 animate-pop-in">
            <div className="px-2 pb-1 pt-0.5 text-xs font-bold uppercase tracking-wide text-muted">Ngôn ngữ đang học</div>
            {COURSE_CODES.map((code) => {
              const c = COURSES[code];
              const on = code === course;
              return (
                <button
                  key={code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={on}
                  onClick={() => choose(code)}
                  className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition ${on ? "bg-primary-soft" : "hover:bg-surface-2"}`}
                >
                  <CourseMark course={code} className="size-9 text-sm" />
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold ${on ? "text-primary" : ""}`}>{c.name}</span>
                    <span className="block text-xs text-muted">{c.standard}</span>
                  </span>
                  {on && <Check className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
