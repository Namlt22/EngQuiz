"use client";

/**
 * Bài người học vừa mở TỪ LỘ TRÌNH (lưu trong sessionStorage của tab) — để trang bài học hiện thanh
 * "Về lộ trình · Day n" kèm trạng thái bài đó, và lộ trình mở lại đúng ngày khi quay về.
 */
const KEY = "engquiz.roadmap-return.v1";

export interface ReturnTarget {
  day: number;
  taskId: string;
  title: string;
}

function isTarget(v: unknown): v is ReturnTarget {
  const r = v as ReturnTarget | null;
  return !!r && typeof r.day === "number" && typeof r.taskId === "string" && typeof r.title === "string";
}

export function readReturnTarget(): ReturnTarget | null {
  try {
    const v: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    return isTarget(v) ? v : null;
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

/** Link quay về lộ trình, mở sẵn bảng của ngày đó. */
export const roadmapDayHref = (day: number) => `/roadmap#day-${day}`;
