"use client";

/**
 * Tiến độ của các tính năng chỉ có ở khoá tiếng Anh: game từ vựng / ngữ pháp, kiểm tra trình độ, khoá A1 20 ngày.
 * Lưu riêng trong localStorage ("engquiz:en-extra:v1"), không trộn vào bộ lưu tiến độ chung (src/lib/progress.ts)
 * mà khoá tiếng Trung cũng dùng. Khi đăng nhập, đồng bộ vào tài khoản trong trường `progress.enExtra` của khoá
 * tiếng Anh (src/components/auth/LearnerSync.tsx). XP vẫn cộng vào tổng qua progressActions.addXp.
 */
import { useSyncExternalStore } from "react";
import type { LevelCode } from "@/content/types";
import { progressActions } from "./progress";

export const EN_COURSE_PARTS = ["words", "grammar", "listening", "reading", "writing", "speaking"] as const;
export type EnCoursePart = (typeof EN_COURSE_PARTS)[number];

export interface EnPlacement {
  /** Cấp đã nắm; null = chưa đạt A1. */
  estimate: LevelCode | null;
  /** Cấp nên học tiếp. */
  start: LevelCode;
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
export const EMPTY_EN_EXTRA: EnExtraState = { version: 1, games: {}, course: {} };
const EMPTY = EMPTY_EN_EXTRA;
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

/* ---------------- Cho bộ đồng bộ tài khoản ---------------- */

/** Chưa có gì để đồng bộ (không gửi trường rỗng lên server). */
export const isBlankEnExtra = (s: EnExtraState | undefined) =>
  !s || (Object.keys(s.games).length === 0 && Object.keys(s.course).length === 0 && !s.placement);

/** Thay toàn bộ bằng bản đã gộp với tài khoản (hoặc bản rỗng khi đổi tài khoản). */
export function replaceEnExtra(next: EnExtraState | undefined) {
  update(() => ({ ...EMPTY, ...(next ?? {}), games: next?.games ?? {}, course: next?.course ?? {} }));
}

export function resetEnExtra() {
  replaceEnExtra(undefined);
}

/** Chỉ thay đổi trong tab này (thay đổi từ tab khác đến qua sự kiện storage, bộ đồng bộ của tab đó tự gửi). */
export function subscribeEnExtraInTab(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Đọc ngoài React (vd trong useEffect): không bao giờ trả trạng thái rỗng của lần render hydrate. */
export const getEnExtra = getSnapshot;

export function useEnExtra(): EnExtraState {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
