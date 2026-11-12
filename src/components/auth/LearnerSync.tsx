"use client";

/**
 * Chạy đồng bộ dữ liệu học với database khi người dùng đã đăng nhập.
 * Không hiển thị gì; trạng thái đồng bộ đọc qua useSyncStatus().
 */
import { useEffect, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { createLearnerSync, type SyncStatus } from "@/lib/learner-sync";
import type { LearnerData } from "@/lib/learner-schema";
import { getProgressState, progressActions, replaceProgress, subscribeProgressInTab } from "@/lib/progress";
import { getRoadmapState, replaceRoadmapState, roadmapActions, subscribeRoadmapInTab } from "@/lib/roadmap-store";

/** Tài khoản sở hữu dữ liệu đang nằm trên máy — tránh gộp nhầm dữ liệu của người khác. */
const OWNER_KEY = "engquiz:owner";

/* ---------- Trạng thái đồng bộ (store nhỏ để Header đọc) ---------- */

let status: SyncStatus = "off";
const statusListeners = new Set<() => void>();

function setStatus(s: SyncStatus) {
  if (s === status) return;
  status = s;
  statusListeners.forEach((l) => l());
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    (cb) => {
      statusListeners.add(cb);
      return () => statusListeners.delete(cb);
    },
    () => status,
    () => "off" as const,
  );
}

/* ---------- Truy cập dữ liệu trên máy ---------- */

function readLocal(): LearnerData {
  const { profile, log } = getRoadmapState();
  return { progress: getProgressState(), roadmap: profile ?? null, roadmapLog: log };
}

function writeLocal(data: LearnerData) {
  replaceProgress(data.progress);
  replaceRoadmapState({ profile: data.roadmap ?? undefined, log: data.roadmapLog });
}

function subscribeLocal(cb: () => void) {
  const a = subscribeProgressInTab(cb);
  const b = subscribeRoadmapInTab(cb);
  return () => {
    a();
    b();
  };
}

function readOwner(): string | null {
  try {
    return window.localStorage.getItem(OWNER_KEY);
  } catch {
    return null;
  }
}

function writeOwner(userId: string | null) {
  try {
    if (userId) window.localStorage.setItem(OWNER_KEY, userId);
    else window.localStorage.removeItem(OWNER_KEY);
  } catch {
    /* không ghi được thì lần sau coi như dữ liệu chưa có chủ */
  }
}

function clearLocal() {
  progressActions.reset();
  roadmapActions.reset();
  writeOwner(null);
}

/* ---------- Bộ đồng bộ đang chạy ---------- */

let active: ReturnType<typeof createLearnerSync> | null = null;

/**
 * Chuẩn bị đăng xuất: gửi nốt thay đổi và chờ server xác nhận.
 * Trả về false nếu còn thay đổi chưa lưu được — khi đó KHÔNG xóa dữ liệu trên máy.
 */
export async function prepareSignOut(): Promise<boolean> {
  return active ? active.flushAndWait() : true;
}

/** Dừng đồng bộ và xóa dữ liệu trên máy (dữ liệu đã nằm trong tài khoản). */
export function stopSyncAndClearLocal() {
  active?.stop();
  active = null;
  clearLocal();
}

/** Dừng đồng bộ nhưng giữ dữ liệu trên máy (đăng xuất khi còn thay đổi chưa lưu). */
export function stopSyncKeepLocal() {
  active?.stop();
  active = null;
  writeOwner(null);
}

export function LearnerSync() {
  const { data: session, status: authStatus } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (authStatus !== "authenticated" || !userId) return;
    const owner = readOwner();
    const mergeLocal = owner === null || owner === userId;
    writeOwner(userId);

    const sync = createLearnerSync({
      fetch: (...args) => fetch(...args),
      readLocal,
      writeLocal,
      subscribeLocal,
      onStatus: setStatus,
      setTimeout: (fn, ms) => window.setTimeout(fn, ms),
      clearTimeout: (id) => window.clearTimeout(id as number),
      log: (message, detail) => console.warn(message, detail ?? ""),
    });
    active = sync;
    void sync.start({ mergeLocal });

    const onHide = () => {
      if (document.visibilityState === "hidden") sync.flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      sync.stop();
      if (active === sync) active = null;
    };
  }, [authStatus, userId]);

  return null;
}
