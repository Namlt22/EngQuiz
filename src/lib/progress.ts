"use client";

/**
 * Tiến độ học trên trình duyệt (localStorage). Khi đăng nhập, src/lib/learner-sync.ts
 * đồng bộ store này với database; các component chỉ làm việc với store.
 */
import { useSyncExternalStore } from "react";

import { PASS_PERCENT, type ProgressState, type TopicProgress } from "./progress-calc";
import { resourceKey, type TaskKind } from "./roadmap-days";
import { roadmapActions } from "./roadmap-store";
import { sanitizeProgress } from "./learner-sanitize";
import { readJson, writeJson } from "./local-json";
export * from "./progress-calc";

const KEY = "engquiz:progress:v1";
const SPEAKING_XP_PER_SENTENCE = 3;
const EMPTY: ProgressState = { version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {} };

let state: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = readJson(KEY, sanitizeProgress, EMPTY);
}

function save() {
  writeJson(KEY, state);
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

const LESSON_XP_PER_CORRECT = 2;

/** Lưu điểm cao nhất của một bài đọc / hội thoại; XP = số câu đúng VƯỢT lần tốt nhất trước (làm lại không cộng lặp). */
function recordLesson(s: ProgressState, field: "reading" | "dialogues", id: string, percent: number, correct: number, total: number): ProgressState {
  const prev = s[field]?.[id];
  const prevCorrect = prev ? Math.round((prev.best / 100) * prev.total) : 0;
  const best = Math.max(prev?.best ?? 0, percent);
  const next: ProgressState = { ...s, [field]: { ...s[field], [id]: { best, done: Math.max(prev?.done ?? 0, correct), total } } };
  return withXp(next, Math.max(0, correct - prevCorrect) * LESSON_XP_PER_CORRECT);
}

/* ---------------- Hành động ---------------- */

/** Báo cho lộ trình: hoạt động này đã xong (tự tích bài tương ứng trong ngày học). */
const done = (kind: TaskKind, ref: string) => roadmapActions.completeResource(resourceKey(kind, ref));

export const progressActions = {
  markTheoryRead(slug: string) {
    done("theory", slug);
    update((s) => {
      if (s.topics[slug]?.theoryRead) return s;
      return withXp(patchTopic(s, slug, (t) => ({ ...t, theoryRead: true })), 5);
    });
  },

  recordQuiz(slug: string, percent: number, correct: number) {
    if (percent >= PASS_PERCENT) done("quiz", slug);
    update((s) =>
      withXp(
        patchTopic(s, slug, (t) => ({ ...t, quizBest: Math.max(t.quizBest ?? 0, percent) })),
        correct * 2,
      ),
    );
  },

  recordDictation(id: string, topicSlug: string | undefined, percent: number, doneCount: number, total: number) {
    if (percent >= PASS_PERCENT) done("dictation", id);
    update((s) => {
      const prev = s.dictations[id];
      let next: ProgressState = {
        ...s,
        dictations: { ...s.dictations, [id]: { best: Math.max(prev?.best ?? 0, percent), done: doneCount, total } },
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

  /**
   * Đọc theo câu mẫu: lưu điểm trung bình cao nhất và số câu đạt nhiều nhất của bộ câu.
   * XP chỉ cộng phần số câu đạt VƯỢT con số đã lưu — tải lại trang rồi đọc lại câu cũ không được cộng lần nữa.
   */
  recordSpeaking(setId: string, percent: number, passedCount: number, total: number) {
    // Tính xong khi đã đọc hết bộ câu và điểm trung bình đạt.
    if (passedCount >= total && percent >= PASS_PERCENT) done("read", setId);
    update((s) => {
      const prev = s.speaking?.[setId];
      const prevDone = prev?.done ?? 0;
      const next: ProgressState = {
        ...s,
        speaking: {
          ...s.speaking,
          [setId]: { best: Math.max(prev?.best ?? 0, percent), done: Math.max(prevDone, passedCount), total },
        },
      };
      return withXp(next, Math.max(0, passedCount - prevDone) * SPEAKING_XP_PER_SENTENCE);
    });
  },

  /** Làm xong câu hỏi của một bài đọc (Reading). XP chỉ cộng khi điểm cao hơn lần trước. */
  recordReading(id: string, percent: number, correct: number, total: number) {
    update((s) => recordLesson(s, "reading", id, percent, correct, total));
  },

  /** Làm xong bài tập của một bài hội thoại. */
  recordDialogue(id: string, percent: number, correct: number, total: number) {
    update((s) => recordLesson(s, "dialogues", id, percent, correct, total));
  },

  /** Làm xong quiz tổng hợp (không thuộc một chủ điểm). */
  recordQuizSet(setId: string, percent: number) {
    if (percent >= PASS_PERCENT) done("quizset", setId);
  },

  /** Đã nghe một âm IPA (trang Phát âm). */
  markSound(soundId: string) {
    done("sound", soundId);
  },

  /** Đã ghi âm một câu trả lời nói tự do cho đề này. */
  markTalk(promptId: string) {
    done("talk", promptId);
  },

  addXp(xp: number) {
    if (xp > 0) update((s) => withXp(s, xp));
  },

  reset() {
    update(() => EMPTY);
  },
};

/* ---------------- Đồng bộ với database (src/lib/learner-sync.ts) ---------------- */

export function getProgressState(): ProgressState {
  load();
  return state;
}

/** Thay toàn bộ tiến độ (dữ liệu đã gộp từ server). */
export function replaceProgress(next: ProgressState) {
  update(() => next);
}

/**
 * Chỉ nghe thay đổi xảy ra trong tab này (không nghe sự kiện `storage` từ tab khác) —
 * dùng cho đồng bộ, để tab A đăng xuất/xóa dữ liệu không khiến tab B ghi đè tài khoản.
 */
export function subscribeProgressInTab(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/* ---------------- Hook ---------------- */

export function subscribeProgress(cb: () => void) {
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
  return useSyncExternalStore(subscribeProgress, getSnapshot, getServerSnapshot);
}
