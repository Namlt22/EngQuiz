"use client";

/**
 * Lưu hồ sơ lộ trình + nhật ký tiến độ trong localStorage (cùng cách làm với progress.ts).
 * Lộ trình chi tiết không được lưu: luôn dựng lại từ hồ sơ bằng buildRoadmap().
 * Nhật ký chỉ do app ghi (học xong bài, ghi âm nói tự do) — không có thao tác tự tích.
 */
import { useSyncExternalStore } from "react";
import { EMPTY_LOG, buildRoadmap, parseLog, parseProfile, type RoadmapLog, type RoadmapProfile } from "./roadmap";
import { buildDays, completeResource, recordSpeakingSeconds } from "./roadmap-days";
import { readJson, writeJson } from "./local-json";

const KEY = "engquiz:roadmap:v1";

export interface RoadmapState {
  profile?: RoadmapProfile;
  log: RoadmapLog;
}

const EMPTY: RoadmapState = { log: EMPTY_LOG };

let state: RoadmapState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = readJson(KEY, parseState, EMPTY);
}

function parseState(raw: unknown): RoadmapState {
  const r = (raw && typeof raw === "object" ? raw : {}) as { profile?: unknown; log?: unknown };
  return { profile: parseProfile(r.profile), log: parseLog(r.log) };
}

function save() {
  writeJson(KEY, state);
}

function update(fn: (s: RoadmapState) => RoadmapState) {
  load();
  state = fn(state);
  save();
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
    load();
    if (!state.profile || completedThisVisit.has(key)) return;
    const days = buildDays(buildRoadmap(state.profile));
    const next = completeResource(days, state.log, key);
    if (next === state.log) return;
    completedThisVisit.add(key);
    update((s) => ({ ...s, log: next }));
  },
  /** Lưu hồ sơ mới. Nhật ký giữ nguyên (khóa theo số tuần), để đổi lịch không mất tiến độ. */
  saveProfile(profile: RoadmapProfile) {
    update((s) => ({ ...s, profile }));
  },
  /** Vừa ghi âm một lần nói tự do dài `seconds` giây → cập nhật kỷ lục nói liên tục của tuần đang học. */
  recordSpeakingSeconds(seconds: number) {
    load();
    if (!state.profile) return;
    const next = recordSpeakingSeconds(buildDays(buildRoadmap(state.profile)), state.log, seconds);
    if (next !== state.log) update((s) => ({ ...s, log: next }));
  },
  reset() {
    update(() => EMPTY);
  },
};

/* ---------------- Đồng bộ với database (src/lib/learner-sync.ts) ---------------- */

export function getRoadmapState(): RoadmapState {
  load();
  return state;
}

/** Thay toàn bộ hồ sơ + nhật ký (dữ liệu đã gộp từ server). */
export function replaceRoadmapState(next: RoadmapState) {
  update(() => next);
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

export function useRoadmapState(): RoadmapState {
  return useSyncExternalStore(subscribeRoadmap, getSnapshot, () => EMPTY);
}

const noopSubscribe = () => () => {};
/** false khi render ở server / lần hydrate đầu — tránh nháy form tạo lộ trình khi đã có hồ sơ. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
