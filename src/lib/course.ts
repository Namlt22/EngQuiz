/**
 * Khoá học (ngôn ngữ đang học). Tiếng Anh dùng các đường dẫn cũ (/roadmap, /grammar…),
 * tiếng Trung nằm dưới tiền tố /zh — khoá học của một trang suy ra từ đường dẫn, không lưu trong state,
 * nên mở thẳng một link /zh/... luôn ghi tiến độ vào đúng khoá tiếng Trung.
 */
export type CourseCode = "en" | "zh";

export interface CourseInfo {
  code: CourseCode;
  name: string;
  /** Chuẩn trình độ mà khoá bám theo */
  standard: string;
  /** Chữ trên huy hiệu khoá học (không dùng cờ emoji: Windows hiện thành "GB", "CN") */
  mark: string;
  /** Lớp Tailwind cho huy hiệu */
  markClass: string;
  /** Trang chủ của khoá */
  home: string;
  /** Mã ngôn ngữ cho giọng đọc / nhận dạng giọng nói */
  speechLang: string;
}

export const COURSES: Record<CourseCode, CourseInfo> = {
  en: { code: "en", name: "Tiếng Anh", standard: "CEFR A1 – C1", mark: "EN", markClass: "from-indigo-500 to-violet-500", home: "/", speechLang: "en-US" },
  zh: { code: "zh", name: "Tiếng Trung", standard: "HSK 3.0 · HSK 1 – 4", mark: "中", markClass: "from-red-500 to-amber-500", home: "/zh", speechLang: "zh-CN" },
};

export const COURSE_CODES = Object.keys(COURSES) as CourseCode[];

/** Khoá học khác tiếng Anh — dữ liệu nằm trong trường `courses` của LearnerData. */
export type ExtraCourseCode = Exclude<CourseCode, "en">;
export const EXTRA_COURSES: ExtraCourseCode[] = ["zh"];

export function courseFromPath(pathname: string): CourseCode {
  return pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
}

/** Khoá học của trang đang mở (dùng trong hàm xử lý sự kiện; khi render dùng useCourse). */
export function currentCourse(): CourseCode {
  return typeof window === "undefined" ? "en" : courseFromPath(window.location.pathname);
}

/** Khoá localStorage riêng cho từng khoá học; tiếng Anh giữ tên cũ để không mất dữ liệu đã có. */
export function courseStorageKey(course: CourseCode, name: string): string {
  return course === "en" ? `engquiz:${name}` : `engquiz:${course}:${name}`;
}
