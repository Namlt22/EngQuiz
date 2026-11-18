"use client";

/**
 * Tiến độ học trên trình duyệt (localStorage). Khi đăng nhập, src/lib/learner-sync.ts
 * đồng bộ store này với database; các component chỉ làm việc với store.
 */
import { useSyncExternalStore } from "react";

import { PASS_PERCENT, type ProgressState, type TopicProgress } from "./progress-calc";
import { resourceKey, type TaskKind } from "./roadmap-days";
import { roadmapActions } from "./roadmap-store";
import { cleanHanzi, sanitizeProgress } from "./learner-sanitize";
import { dayNumber, decodeSrs, encodeSrs, isMastered, review, type Grade } from "@/core/srs";
import { addEntry, removeEntry, restoreEntry, reviewEntry, updateEntry, type NewEntry, type NotebookEntry } from "@/core/notebook";
import { readJson, writeJson } from "./local-json";
import { COURSE_CODES, courseStorageKey, currentCourse, type CourseCode } from "./course";
import { useCourse } from "./course-client";
export * from "./progress-calc";

const SPEAKING_XP_PER_SENTENCE = 3;

/** Loại bài của khoá tiếng Trung và loại nhiệm vụ lộ trình tương ứng (khoá nhiệm vụ = "<loại>:<tiền tố>-<id>"). */
export type ZhLessonPrefix = "pinyin" | "hanzi" | "grammar" | "mock";
export const ZH_TASK_KIND: Record<ZhLessonPrefix, TaskKind> = { pinyin: "sound", hanzi: "quiz", grammar: "theory", mock: "quizset" };
/** Nhiệm vụ "ôn thẻ từ vựng" lặp lại mỗi ngày — mỗi lượt ôn xong tích một nhiệm vụ. */
export const ZH_VOCAB_TASK_REF = "zh-vocab";
const EMPTY: ProgressState = { version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {} };

/** Mỗi khoá học (tiếng Anh, tiếng Trung) có tiến độ riêng, lưu ở khoá localStorage riêng. */
const storageKey = (course: CourseCode) => courseStorageKey(course, "progress:v1");
const states = new Map<CourseCode, ProgressState>();
const listeners = new Set<() => void>();

function load(course: CourseCode): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  let s = states.get(course);
  if (!s) {
    s = readJson(storageKey(course), sanitizeProgress, EMPTY);
    states.set(course, s);
  }
  return s;
}

function emit() {
  listeners.forEach((l) => l());
}

function update(fn: (s: ProgressState) => ProgressState, course: CourseCode = currentCourse()) {
  const next = fn(load(course));
  states.set(course, next);
  writeJson(storageKey(course), next);
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
    if (percent >= PASS_PERCENT) done("reading", id);
    update((s) => recordLesson(s, "reading", id, percent, correct, total));
  },

  /** Làm xong bài tập của một bài hội thoại. */
  recordDialogue(id: string, percent: number, correct: number, total: number) {
    if (percent >= PASS_PERCENT) done("dialogue", id);
    update((s) => recordLesson(s, "dialogues", id, percent, correct, total));
  },

  /** Làm xong quiz tổng hợp (không thuộc một chủ điểm). */
  recordQuizSet(setId: string, percent: number) {
    if (percent >= PASS_PERCENT) done("quizset", setId);
  },

  /**
   * Hoàn thành một bài của khoá tiếng Trung (pinyin, Hán tự…). Lưu như chủ điểm "<prefix>-<id>" trong tiến độ của khoá:
   * theoryRead = đã xong bài, quizBest = điểm cao nhất. XP chỉ cộng lần đầu xong bài.
   */
  recordZhLesson(prefix: ZhLessonPrefix, id: string, percent: number, xp: number) {
    const key = `${prefix}-${id}`;
    done(ZH_TASK_KIND[prefix], key);
    update((s) => {
      const first = !s.topics[key]?.theoryRead;
      const next = patchTopic(s, key, (t) => ({ ...t, theoryRead: true, quizBest: Math.max(t.quizBest ?? 0, percent) }));
      return first ? withXp(next, xp) : next;
    });
  },

  /** Tự viết đúng một chữ Hán ở bài tô chữ (khoá tiếng Trung). XP chỉ cộng lần đầu viết đúng chữ đó. */
  markHanziWritten(ch: string, xp: number) {
    done("quiz", `hanzi-${ch}`);
    update((s) => {
      if ((s.hanzi ?? "").includes(ch)) return s;
      return withXp({ ...s, hanzi: cleanHanzi((s.hanzi ?? "") + ch) }, xp);
    });
  },

  /**
   * Chấm một thẻ từ vựng (khoá tiếng Trung). XP: +1 mỗi thẻ nhớ được; +3 khi từ vừa lên mức "đã thuộc" lần đầu.
   */
  reviewWord(word: string, grade: Grade) {
    update((s) => {
      const map = decodeSrs(s.srs);
      const before = map.get(word);
      const after = review(before, grade, dayNumber());
      map.set(word, after);
      const xp = (grade === "again" ? 0 : 1) + (!isMastered(before) && isMastered(after) ? 3 : 0);
      const next = { ...s, srs: encodeSrs(map) };
      return xp ? withXp(next, xp) : next;
    });
  },

  /**
   * Sổ tay từ vựng (khoá hiện tại). Trả về true nếu thêm được; false nếu từ đã có, thiếu dữ liệu hoặc sổ đầy.
   * Thêm từ không cộng XP (tránh "cày" XP bằng cách thêm từ) — XP chỉ đến từ việc ôn.
   */
  addToNotebook(input: NewEntry): boolean {
    let added = false;
    update((s) => {
      const res = addEntry(s.notebook ?? [], input, Date.now(), dayNumber());
      added = res.added;
      return added ? { ...s, notebook: [...res.list] } : s;
    });
    return added;
  },

  editNotebookEntry(id: string, patch: Partial<Pick<NotebookEntry, "term" | "meaning" | "reading" | "example">>) {
    update((s) => ({ ...s, notebook: updateEntry(s.notebook ?? [], id, patch, Date.now()) }));
  },

  removeNotebookEntry(id: string) {
    update((s) => ({ ...s, notebook: removeEntry(s.notebook ?? [], id, Date.now()) }));
  },

  restoreNotebookEntry(id: string) {
    update((s) => ({ ...s, notebook: restoreEntry(s.notebook ?? [], id, Date.now()) }));
  },

  /** Chấm một thẻ sổ tay: +1 XP khi nhớ. */
  reviewNotebookEntry(id: string, grade: Grade) {
    update((s) => {
      const next = { ...s, notebook: reviewEntry(s.notebook ?? [], id, grade, dayNumber(), Date.now()) };
      return grade === "again" ? next : withXp(next, 1);
    });
  },

  /** Xong một lượt ôn thẻ từ vựng tiếng Trung (lộ trình tự tích bài "Ôn từ vựng" của ngày). */
  finishVocabSession() {
    done("quizset", ZH_VOCAB_TASK_REF);
  },

  /** Đã nghe một âm IPA (trang Phát âm). */
  markSound(soundId: string) {
    done("sound", soundId);
  },

  /** Đã ghi âm một câu trả lời nói tự do cho đề này; `seconds` = độ dài lần nói (ghi kỷ lục nói liên tục của tuần). */
  markTalk(promptId: string, seconds?: number) {
    if (seconds) roadmapActions.recordSpeakingSeconds(seconds);
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

export function getProgressState(course: CourseCode = "en"): ProgressState {
  return load(course);
}

/** Thay toàn bộ tiến độ của một khoá học (dữ liệu đã gộp từ server). */
export function replaceProgress(next: ProgressState, course: CourseCode = "en") {
  update(() => next, course);
}

/** Xoá tiến độ của mọi khoá học trên máy (đăng xuất). */
export function resetAllProgress() {
  COURSE_CODES.forEach((c) => update(() => EMPTY, c));
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
    const course = COURSE_CODES.find((c) => storageKey(c) === e.key);
    if (course) {
      states.delete(course);
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Server và lần render đầu tiên dùng trạng thái rỗng để tránh lệch hydration. */
function getServerSnapshot() {
  return EMPTY;
}

/** Tiến độ của khoá học đang mở (theo đường dẫn), hoặc của khoá chỉ định. */
export function useProgress(course?: CourseCode): ProgressState {
  const routeCourse = useCourse();
  const c = course ?? routeCourse;
  return useSyncExternalStore(subscribeProgress, () => load(c), getServerSnapshot);
}
