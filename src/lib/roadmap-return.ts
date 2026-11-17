"use client";

/**
 * Bài người học vừa mở TỪ LỘ TRÌNH (lưu trong sessionStorage của tab) — để trang bài học hiện thanh
 * "Về lộ trình · Day n" kèm trạng thái bài đó, và lộ trình mở lại đúng ngày khi quay về.
 */
import type { CourseCode } from "./course";

const KEY = "engquiz.roadmap-return.v1";

export interface ReturnTarget {
  day: number;
  taskId: string;
  title: string;
  /** Khoá học của lộ trình (bản cũ không có → tiếng Anh) */
  course?: CourseCode;
}

function isTarget(v: unknown): v is ReturnTarget {
  const r = v as ReturnTarget | null;
  return !!r && typeof r.day === "number" && typeof r.taskId === "string" && typeof r.title === "string";
}

/** Bài đang học từ lộ trình của đúng khoá học `course` (bài của khoá khác bị bỏ qua). */
export function readReturnTarget(course: CourseCode = "en"): ReturnTarget | null {
  try {
    const v: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    return isTarget(v) && (v.course ?? "en") === course ? v : null;
  } catch {
    return null;
  }
}

export function saveReturnTarget(t: ReturnTarget) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(t));
  } catch {
    /* chế độ riêng tư: không có thanh quay lại, vẫn học bình thường */
  }
}

export function clearReturnTarget() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* như trên */
  }
}

/** Trang lộ trình của khoá học. */
export const roadmapPath = (course: CourseCode) => (course === "zh" ? "/zh/roadmap" : "/roadmap");

/** Link quay về lộ trình, mở sẵn bảng của ngày đó. */
export const roadmapDayHref = (day: number, course: CourseCode = "en") => `${roadmapPath(course)}#day-${day}`;
