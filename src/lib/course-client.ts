"use client";

/**
 * Phần phía trình duyệt của khoá học: khoá của trang hiện tại và lựa chọn đã lưu
 * (để lần sau vào trang chủ mở đúng khoá đang học).
 */
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { COURSE_CODES, courseFromPath, type CourseCode } from "./course";

const PREF_KEY = "engquiz:course";
const listeners = new Set<() => void>();

export function useCourse(): CourseCode {
  return courseFromPath(usePathname() ?? "/");
}

function readPreferred(): CourseCode | null {
  try {
    const v = window.localStorage.getItem(PREF_KEY);
    return COURSE_CODES.includes(v as CourseCode) ? (v as CourseCode) : null;
  } catch {
    return null;
  }
}

export function setPreferredCourse(course: CourseCode) {
  try {
    window.localStorage.setItem(PREF_KEY, course);
  } catch {
    /* chế độ riêng tư chặn localStorage: chỉ không nhớ được lựa chọn */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === PREF_KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** undefined = đang render ở server / chưa hydrate; null = chưa từng chọn. */
export function usePreferredCourse(): CourseCode | null | undefined {
  return useSyncExternalStore(subscribe, readPreferred, () => undefined);
}
