"use client";

/**
 * Lưu tiến độ học trong localStorage (giai đoạn chạy local, chưa có tài khoản).
 * Khi có backend, chỉ cần thay phần load/save — các component không đổi.
 */
import { useSyncExternalStore } from "react";

import type { ProgressState, TopicProgress } from "./progress-calc";
export * from "./progress-calc";

const KEY = "engquiz:progress:v1";
const EMPTY: ProgressState = { version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {} };

let state: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    state = EMPTY;
  }
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* chế độ ẩn danh / bộ nhớ đầy: bỏ qua, tiến độ chỉ còn trong phiên */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function update(fn: (s: ProgressState) => ProgressState) {
  load();
  state = fn(state);
  save();
  emit();
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

/** Cộng XP và cập nhật streak (học liên tiếp theo ngày). */
function withXp(s: ProgressState, xp: number): ProgressState {
  const today = todayKey();
  let streak = s.streak;
  if (s.lastActiveDate !== today) {
    const gap = s.lastActiveDate ? daysBetween(s.lastActiveDate, today) : Infinity;
    streak = gap === 1 ? streak + 1 : 1;
  }
  return {
    ...s,
    xp: s.xp + xp,
    streak,
    lastActiveDate: today,
    activity: { ...s.activity, [today]: (s.activity[today] ?? 0) + xp },
  };
}

function patchTopic(s: ProgressState, slug: string, patch: (t: TopicProgress) => TopicProgress): ProgressState {
  return { ...s, topics: { ...s.topics, [slug]: patch(s.topics[slug] ?? {}) } };
}

/* ---------------- Hành động ---------------- */

export const progressActions = {
  markTheoryRead(slug: string) {
    update((s) => {
      if (s.topics[slug]?.theoryRead) return s;
      return withXp(patchTopic(s, slug, (t) => ({ ...t, theoryRead: true })), 5);
    });
  },

  recordQuiz(slug: string, percent: number, correct: number) {
    update((s) =>
      withXp(
        patchTopic(s, slug, (t) => ({ ...t, quizBest: Math.max(t.quizBest ?? 0, percent) })),
        correct * 2,
      ),
    );
  },

  recordDictation(id: string, topicSlug: string | undefined, percent: number, done: number, total: number) {
    update((s) => {
      const prev = s.dictations[id];
      let next: ProgressState = {
        ...s,
        dictations: { ...s.dictations, [id]: { best: Math.max(prev?.best ?? 0, percent), done, total } },
      };
      if (topicSlug) {
        next = patchTopic(next, topicSlug, (t) => ({
          ...t,
          dictationBest: Math.max(t.dictationBest ?? 0, percent),
        }));
      }
      return withXp(next, Math.round((percent / 100) * total * 3));
    });
  },

  addXp(xp: number) {
    if (xp > 0) update((s) => withXp(s, xp));
  },

  reset() {
    update(() => EMPTY);
  },
};

/* ---------------- Hook ---------------- */

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

/** Server và lần render đầu tiên dùng trạng thái rỗng để tránh lệch hydration. */
function getServerSnapshot() {
  return EMPTY;
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
