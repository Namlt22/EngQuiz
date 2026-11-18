"use client";

/**
 * Trang chủ "/": lần đầu vào (chưa chọn ngôn ngữ) hiện màn chọn Tiếng Anh / Tiếng Trung;
 * đã chọn tiếng Trung thì chuyển sang /zh; còn lại hiện bảng điều khiển tiếng Anh.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { COURSES, COURSE_CODES, type CourseCode } from "@/lib/course";
import { setPreferredCourse, usePreferredCourse } from "@/lib/course-client";
import { useProgress } from "@/lib/progress";
import { CourseMark } from "@/components/layout/CourseMark";

const PITCH: Record<CourseCode, string[]> = {
  en: ["Ngữ pháp A1 → C1 theo CEFR", "Phát âm IPA, nghe chép, luyện nói", "Lộ trình cá nhân 8–16 tuần"],
  zh: ["Theo chuẩn HSK 3.0 (đề cương thi 2025)", "Pinyin, thanh điệu, Hán tự, âm Hán-Việt", "Lộ trình HSK 1 → HSK 4"],
};

export function CoursePicker() {
  const router = useRouter();
  const choose = (code: CourseCode) => {
    setPreferredCourse(code);
    if (code !== "en") router.push(COURSES[code].home);
  };

  return (
    <section className="space-y-6 py-4">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold md:text-4xl">Bạn muốn học ngôn ngữ nào?</h1>
        <p className="mt-2 text-muted">Có thể đổi bất cứ lúc nào ở nút cạnh logo. Tiến độ mỗi ngôn ngữ được lưu riêng.</p>
      </header>
      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        {COURSE_CODES.map((code) => {
          const c = COURSES[code];
          return (
            <button
              key={code}
              type="button"
              onClick={() => choose(code)}
              className="card group flex flex-col items-start gap-3 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CourseMark course={code} className="size-14" />
              <span>
                <span className="block text-xl font-extrabold">{c.name}</span>
                <span className="block text-sm font-semibold text-primary">{c.standard}</span>
              </span>
              <ul className="space-y-1 text-sm text-muted">
                {PITCH[code].map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-primary">
                Học {c.name.toLowerCase()} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function CourseGate({ children }: { children: React.ReactNode }) {
  const saved = usePreferredCourse();
  const enXp = useProgress("en").xp;
  const router = useRouter();
  // Người đã học tiếng Anh từ trước khi có màn chọn ngôn ngữ: coi như đã chọn tiếng Anh, không hỏi lại.
  const preferred = saved === null && enXp > 0 ? "en" : saved;

  useEffect(() => {
    if (preferred && preferred !== "en") router.replace(COURSES[preferred].home);
  }, [preferred, router]);

  // Server / lần hydrate đầu: hiện trang tiếng Anh như trước (nội dung chính, tốt cho SEO).
  if (preferred === null) return <CoursePicker />;
  if (preferred && preferred !== "en") return null;
  return <>{children}</>;
}
