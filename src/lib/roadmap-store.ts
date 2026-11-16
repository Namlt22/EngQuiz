"use client";

/**
 * Lưu hồ sơ lộ trình + nhật ký tiến độ trong localStorage (cùng cách làm với progress.ts).
 * Lộ trình chi tiết không được lưu: luôn dựng lại từ hồ sơ bằng buildRoadmap().
 * Nhật ký chỉ do app ghi (học xong bài, ghi âm nói tự do) — không có thao tác tự tích.
 */
import { useSyncExternalStore } from "react";
import { EMPTY_LOG, buildRoadmap, parseLog, parseProfile, type RoadmapLog, type RoadmapProfile } from "./roadmap";
import { buildDays, completeResource, recordSpeakingSeconds, remapTasks } from "./roadmap-days";
import { readReturnTarget } from "./roadmap-return";
import { readJson, writeJson } from "./local-json";
import { COURSE_CODES, courseStorageKey, currentCourse, type CourseCode } from "./course";
import { useCourse } from "./course-client";

export interface RoadmapState {
  profile?: RoadmapProfile;
  log: RoadmapLog;
}

const EMPTY: RoadmapState = { log: EMPTY_LOG };

/** Mỗi khoá học có hồ sơ lộ trình + nhật ký riêng. */
const storageKey = (course: CourseCode) => courseStorageKey(course, "roadmap:v1");
const states = new Map<CourseCode, RoadmapState>();
const listeners = new Set<() => void>();

function load(course: CourseCode): RoadmapState {
  if (typeof window === "undefined") return EMPTY;
  let s = states.get(course);
  if (!s) {
    s = readJson(storageKey(course), parseState, EMPTY);
    states.set(course, s);
  }
  return s;
}

function parseState(raw: unknown): RoadmapState {
  const r = (raw && typeof raw === "object" ? raw : {}) as { profile?: unknown; log?: unknown };
  return { profile: parseProfile(r.profile), log: parseLog(r.log) };
}

function update(fn: (s: RoadmapState) => RoadmapState, course: CourseCode = currentCourse()) {
  const next = fn(load(course));
  states.set(course, next);
  writeJson(storageKey(course), next);
  listeners.forEach((l) => l());
}

/**
 * Khóa đã tính trong lần mở trang hiện tại. Một số hoạt động báo "xong" nhiều lần trong một lượt
 * (đọc theo mẫu lưu điểm sau mỗi câu, lý thuyết cuộn qua lại) — chỉ tính một bài cho mỗi lượt mở trang,
 * để bài ôn tập ở ngày sau không bị tích theo luôn. Xoá khi chuyển trang (RoadmapVisitScope).
 */
const completedThisVisit = new Set<string>();
export function startNewVisit() {
  completedThisVisit.clear();
}

export const roadmapActions = {
  /** Người học vừa xong một hoạt động → tích bài tương ứng sớm nhất còn dở trong lộ trình (nếu có lộ trình). */
  completeResource(key: string) {
    const course = currentCourse();
    const state = load(course);
    if (!state.profile || completedThisVisit.has(`${course}:${key}`)) return;
    const days = buildDays(buildRoadmap(state.profile));
    const next = completeResource(days, state.log, key, readReturnTarget()?.taskId);
    if (next === state.log) return;
    completedThisVisit.add(`${course}:${key}`);
    update((s) => ({ ...s, log: next }), course);
  },
  /** Lưu hồ sơ mới; tiến độ được chuyển theo bài học sang lịch mới (remapTasks) để không tích nhầm bài khác. */
  saveProfile(profile: RoadmapProfile) {
    const state = load(currentCourse());
    const old = state.profile;
    const log = old ? remapTasks(buildDays(buildRoadmap(old)), buildDays(buildRoadmap(profile)), state.log) : state.log;
    update((s) => ({ ...s, profile, log }));
  },
  /** Vừa ghi âm một lần nói tự do dài `seconds` giây → cập nhật kỷ lục nói liên tục của tuần đang học. */
  recordSpeakingSeconds(seconds: number) {
    const state = load(currentCourse());
    if (!state.profile) return;
    const next = recordSpeakingSeconds(buildDays(buildRoadmap(state.profile)), state.log, seconds);
    if (next !== state.log) update((s) => ({ ...s, log: next }));
  },
  reset() {
    update(() => EMPTY);
  },
};

/* ---------------- Đồng bộ với database (src/lib/learner-sync.ts) ---------------- */

export function getRoadmapState(course: CourseCode = "en"): RoadmapState {
  return load(course);
}

/** Thay toàn bộ hồ sơ + nhật ký của một khoá học (dữ liệu đã gộp từ server). */
export function replaceRoadmapState(next: RoadmapState, course: CourseCode = "en") {
  update(() => next, course);
}

/** Xoá lộ trình của mọi khoá học trên máy (đăng xuất). */
export function resetAllRoadmaps() {
  COURSE_CODES.forEach((c) => update(() => EMPTY, c));
}

/** Chỉ nghe thay đổi trong tab này (xem subscribeProgressInTab). */
export function subscribeRoadmapInTab(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function subscribeRoadmap(cb: () => void) {
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

/** Lộ trình của khoá học đang mở (theo đường dẫn). */
export function useRoadmapState(): RoadmapState {
  const course = useCourse();
  return useSyncExternalStore(subscribeRoadmap, () => load(course), () => EMPTY);
}

const noopSubscribe = () => () => {};
/** false khi render ở server / lần hydrate đầu — tránh nháy form tạo lộ trình khi đã có hồ sơ. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
