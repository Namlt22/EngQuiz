import { COURSES, type CourseCode } from "@/lib/course";

/** Huy hiệu tròn của khoá học: "EN" cho tiếng Anh, "中" cho tiếng Trung. */
export function CourseMark({ course, className = "size-7 text-[11px]" }: { course: CourseCode; className?: string }) {
  const c = COURSES[course];
  return (
    <span
      aria-hidden="true"
      lang={course === "zh" ? "zh-Hans" : "en"}
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-black leading-none text-white ${c.markClass} ${className}`}
    >
      {c.mark}
    </span>
  );
}
