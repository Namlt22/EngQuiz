"use client";

/**
 * Lưu hồ sơ lộ trình + nhật ký tích ô trong localStorage (cùng cách làm với progress.ts).
 * Lộ trình chi tiết không được lưu: luôn dựng lại từ hồ sơ bằng buildRoadmap().
 */
import { useSyncExternalStore } from "react";
import { EMPTY_LOG, parseLog, parseProfile, type RoadmapLog, type RoadmapProfile } from "./roadmap";
import { readJson, writeJson } from "./local-json";

const KEY = "engquiz:roadmap:v1";
const MAX_NOTE_LENGTH = 500;
const MAX_SECONDS = 3600;

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

function patchLog<K extends keyof RoadmapLog>(key: K, id: string, value: RoadmapLog[K][string] | undefined) {
  update((s) => {
    const { [id]: _removed, ...rest } = s.log[key];
    const next = value === undefined ? rest : { ...rest, [id]: value };
    return { ...s, log: { ...s.log, [key]: next } };
  });
}

export const roadmapActions = {
  /** Lưu hồ sơ mới. Nhật ký giữ nguyên (khóa theo số tuần), để đổi lịch không mất tiến độ. */
  saveProfile(profile: RoadmapProfile) {
    update((s) => ({ ...s, profile }));
  },
  toggle(key: "sessions" | "talks" | "milestones", id: string, done: boolean) {
    patchLog(key, id, done ? true : undefined);
  },
  setSeconds(week: number, seconds: number | undefined) {
    const valid = seconds !== undefined && Number.isFinite(seconds) && seconds >= 0;
    patchLog("seconds", String(week), valid ? Math.min(Math.round(seconds), MAX_SECONDS) : undefined);
  },
  setNote(week: number, note: string) {
    const trimmed = note.slice(0, MAX_NOTE_LENGTH);
    patchLog("notes", String(week), trimmed.trim() ? trimmed : undefined);
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
