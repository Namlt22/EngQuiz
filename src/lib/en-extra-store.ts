"use client";

/**
 * Tiến độ của các tính năng chỉ có ở khoá tiếng Anh: game từ vựng / ngữ pháp, kiểm tra trình độ, khoá A1 20 ngày.
 * Lưu riêng trong localStorage ("engquiz:en-extra:v1") để không sửa bộ lưu tiến độ dùng chung (src/lib/progress.ts)
 * mà khoá tiếng Trung cũng dùng — xem docs/CODE-AREAS.md. XP vẫn cộng vào tổng qua progressActions.addXp.
 */
import { useSyncExternalStore } from "react";
import { progressActions } from "./progress";

export const EN_COURSE_PARTS = ["words", "grammar", "listening", "reading", "writing", "speaking"] as const;
export type EnCoursePart = (typeof EN_COURSE_PARTS)[number];

export interface EnPlacement {
  /** Cấp đã nắm; null = chưa đạt A1. */
  estimate: string | null;
  /** Cấp nên học tiếp. */
  start: string;
  at: number;
}

export interface EnExtraState {
  version: 1;
  /** Điểm cao nhất (0–100) mỗi game, khoá vd "vocab:food:choose", "grammar:to-be:truefalse". */
  games: Record<string, number>;
  placement?: EnPlacement;
  /** Khoá A1 20 ngày: điểm từng phần đã làm, khoá = id ngày ("A1-3"). */
  course: Record<string, Partial<Record<EnCoursePart, number>>>;
}

const KEY = "engquiz:en-extra:v1";
const EMPTY: EnExtraState = { version: 1, games: {}, course: {} };
let state: EnExtraState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<EnExtraState>;
      state = { ...EMPTY, ...parsed, games: parsed.games ?? {}, course: parsed.course ?? {} };
    }
  } catch {
    state = EMPTY;
  }
}

function update(fn: (s: EnExtraState) => EnExtraState) {
  load();
  state = fn(state);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* chế độ riêng tư / bộ nhớ đầy: tiến độ chỉ còn trong phiên */
  }
  listeners.forEach((l) => l());
}

export const enExtraActions = {
  recordGame(id: string, percent: number) {
    update((s) => ({ ...s, games: { ...s.games, [id]: Math.max(s.games[id] ?? 0, Math.round(percent)) } }));
  },

  recordPlacement(p: EnPlacement) {
    update((s) => ({ ...s, placement: p }));
  },

  /** Xong một phần của một ngày học. XP chỉ cộng lần đầu xong phần đó. */
  recordCoursePart(dayId: string, part: EnCoursePart, score: number) {
    let first = false;
    update((s) => {
      const day = s.course[dayId] ?? {};
      first = day[part] === undefined;
      return { ...s, course: { ...s.course, [dayId]: { ...day, [part]: Math.max(day[part] ?? 0, Math.round(score)) } } };
    });
    if (first) progressActions.addXp(5);
  },
};

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

/** Đọc ngoài React (vd trong useEffect): không bao giờ trả trạng thái rỗng của lần render hydrate. */
export const getEnExtra = getSnapshot;

export function useEnExtra(): EnExtraState {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
