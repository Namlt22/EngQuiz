/**
 * Đồng bộ dữ liệu học trên trình duyệt (localStorage) với database qua /api/learner.
 *
 * Luồng:
 *  1. Đăng nhập → GET. Có bản trên server: gộp với bản trên máy (learner-merge) rồi ghi vào máy.
 *     Chưa có: đẩy bản trên máy lên.
 *  2. Dữ liệu trên máy đổi → chờ DEBOUNCE_MS rồi PUT kèm `baseVersion`.
 *  3. 409 (tab/thiết bị khác vừa ghi) → gộp bản server với bản trên máy MỚI NHẤT rồi ghi lại.
 *  4. Lỗi tạm thời (mạng, 429, 5xx) → thử lại với thời gian chờ tăng dần.
 *     Lỗi không thể tự hết (400/403/413) → dừng, báo "invalid" và ghi log.
 *
 * Phần điều khiển nhận phụ thuộc qua tham số để test được mà không cần trình duyệt.
 */
import { LIMITS, learnerPutSchema, type LearnerData, type LearnerSnapshot } from "./learner-schema";
import { mergeLearnerData, sameData } from "./learner-merge";

export type SyncStatus = "off" | "loading" | "saving" | "saved" | "error" | "invalid" | "signed-out";

const DEBOUNCE_MS = 1200;
const RETRY_BASE_MS = 5_000;
const RETRY_MAX_MS = 5 * 60_000;
const MAX_CONFLICT_RETRIES = 3;

export interface SyncDeps {
  fetch: typeof fetch;
  readLocal: () => LearnerData;
  writeLocal: (data: LearnerData) => void;
  subscribeLocal: (cb: () => void) => () => void;
  onStatus: (s: SyncStatus) => void;
  setTimeout: (fn: () => void, ms: number) => unknown;
  clearTimeout: (id: unknown) => void;
  log?: (message: string, detail?: unknown) => void;
}

export interface StartOptions {
  /** false khi dữ liệu trên máy thuộc người dùng khác: bỏ bản trên máy, chỉ dùng bản server. */
  mergeLocal: boolean;
}

const stripVersion = ({ version: _v, ...data }: LearnerSnapshot): LearnerData => data;

/** Giữ lại các ngày hoạt động gần nhất để không vượt giới hạn của server. */
export function trimForUpload(data: LearnerData): LearnerData {
  const days = Object.keys(data.progress.activity);
  if (days.length <= LIMITS.activityDays) return data;
  const keep = new Set(days.sort().slice(-LIMITS.activityDays));
  const activity = Object.fromEntries(Object.entries(data.progress.activity).filter(([d]) => keep.has(d)));
  return { ...data, progress: { ...data.progress, activity } };
}

/** Dữ liệu "trống" (vừa đăng xuất / xóa trên máy) — không bao giờ được ghi đè bản có dữ liệu trên server. */
export function isBlank(d: LearnerData): boolean {
  const p = d.progress;
  const log = d.roadmapLog;
  return (
    p.xp === 0 &&
    Object.keys(p.topics).length === 0 &&
    Object.keys(p.dictations).length === 0 &&
    Object.keys(p.speaking ?? {}).length === 0 &&
    d.roadmap === null &&
    Object.values(log).every((r) => Object.keys(r).length === 0)
  );
}

export function createLearnerSync(deps: SyncDeps) {
  const log = deps.log ?? (() => {});
  let version: number | null = null;
  let lastSynced: LearnerData | null = null;
  let ready = false;
  let stopped = true;
  let pushTimer: unknown = null;
  let startTimer: unknown = null;
  let inFlight: Promise<boolean> | null = null;
  let again = false;
  let applying = false;
  let conflicts = 0;
  let failures = 0;
  let unsubscribe: (() => void) | null = null;

  const backoff = () => Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** Math.min(failures++, 6));

  function apply(data: LearnerData) {
    applying = true;
    try {
      deps.writeLocal(data);
    } finally {
      applying = false;
    }
  }

  function clearPushTimer() {
    if (pushTimer !== null) deps.clearTimeout(pushTimer);
    pushTimer = null;
  }

  function schedule(ms = DEBOUNCE_MS) {
    if (stopped || !ready) return;
    clearPushTimer();
    pushTimer = deps.setTimeout(() => {
      pushTimer = null;
      void push();
    }, ms);
  }

  function handleConflict(current: LearnerSnapshot | null) {
    if (stopped) return;
    conflicts++;
    if (current) {
      version = current.version;
      lastSynced = stripVersion(current);
      apply(mergeLearnerData(lastSynced, trimForUpload(deps.readLocal())));
    } else {
      version = null;
      lastSynced = null;
    }
    if (conflicts > MAX_CONFLICT_RETRIES) {
      log("[sync] Xung đột liên tục, tạm dừng rồi thử lại sau");
      conflicts = 0;
      deps.onStatus("error");
      schedule(backoff());
      return;
    }
    again = true;
  }

  /** Gửi một lần. Trả về true nếu sau lần gửi, server đã có đúng dữ liệu trên máy. */
  async function sendOnce(keepalive: boolean): Promise<boolean> {
    const local = trimForUpload(deps.readLocal());
    if (lastSynced && sameData(local, lastSynced)) {
      deps.onStatus("saved");
      return true;
    }
    if (isBlank(local) && lastSynced && !isBlank(lastSynced)) {
      log("[sync] Bỏ qua ghi dữ liệu trống đè lên dữ liệu đã có trong tài khoản");
      return true;
    }
    const body = learnerPutSchema.safeParse({ ...local, baseVersion: version });
    if (!body.success) {
      log("[sync] Dữ liệu trên máy không hợp lệ, không gửi được", body.error.issues.slice(0, 5));
      deps.onStatus("invalid");
      return false;
    }

    deps.onStatus("saving");
    let res: Response;
    try {
      res = await deps.fetch("/api/learner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body.data),
        keepalive,
      });
    } catch (e) {
      log("[sync] Lỗi mạng khi lưu", e);
      if (!stopped) deps.onStatus("error");
      schedule(backoff());
      return false;
    }
    if (stopped && !keepalive) return false;

    const json = (await res.json().catch(() => null)) as {
      data?: { version?: number };
      error?: string;
      current?: LearnerSnapshot | null;
    } | null;

    if (res.ok && typeof json?.data?.version === "number") {
      version = json.data.version;
      lastSynced = local;
      conflicts = 0;
      failures = 0;
      deps.onStatus("saved");
      return true;
    }
    if (res.status === 409) {
      handleConflict(json?.current ?? null);
      return false;
    }
    if (res.status === 401) {
      log("[sync] Phiên đăng nhập đã hết hạn");
      halt("signed-out");
      return false;
    }
    if (res.status === 400 || res.status === 403 || res.status === 413) {
      log(`[sync] Server từ chối dữ liệu (${res.status}): ${json?.error ?? ""}`);
      deps.onStatus("invalid");
      return false;
    }
    log(`[sync] Lưu chưa thành công (${res.status}), sẽ thử lại`);
    deps.onStatus("error");
    schedule(backoff());
    return false;
  }

  async function push(keepalive = false): Promise<boolean> {
    if (stopped || !ready) return false;
    if (inFlight) {
      again = true;
      return inFlight;
    }
    const run = sendOnce(keepalive);
    inFlight = run;
    try {
      return await run;
    } finally {
      inFlight = null;
      if (again && !stopped) {
        again = false;
        schedule(0);
      }
    }
  }

  async function start({ mergeLocal }: StartOptions): Promise<void> {
    stopped = false;
    deps.onStatus("loading");
    try {
      const res = await deps.fetch("/api/learner", { cache: "no-store" });
      if (stopped) return;
      if (res.status === 401) {
        halt("signed-out");
        return;
      }
      const json = (await res.json()) as { success?: boolean; data?: LearnerSnapshot | null };
      if (!res.ok || !json.success) throw new Error(`GET /api/learner ${res.status}`);
      if (stopped) return;

      const remote = json.data ? stripVersion(json.data) : null;
      version = json.data?.version ?? null;
      lastSynced = remote;
      if (remote) apply(mergeLocal ? mergeLearnerData(remote, deps.readLocal()) : remote);
      else if (!mergeLocal) apply(emptyLike(deps.readLocal()));

      ready = true;
      failures = 0;
      unsubscribe = deps.subscribeLocal(() => {
        if (!applying) schedule();
      });
      schedule(0);
    } catch (e) {
      log("[sync] Không tải được dữ liệu từ server", e);
      if (stopped) return;
      deps.onStatus("error");
      startTimer = deps.setTimeout(() => {
        startTimer = null;
        void start({ mergeLocal });
      }, backoff());
    }
  }

  function halt(status: SyncStatus) {
    stopped = true;
    ready = false;
    clearPushTimer();
    if (startTimer !== null) deps.clearTimeout(startTimer);
    startTimer = null;
    unsubscribe?.();
    unsubscribe = null;
    deps.onStatus(status);
  }

  /**
   * Gửi nốt mọi thay đổi và chờ xong (dùng trước khi đăng xuất).
   * Trả về true nếu server đã có đủ dữ liệu trên máy.
   */
  async function flushAndWait(): Promise<boolean> {
    if (stopped || !ready) return lastSynced !== null && sameData(trimForUpload(deps.readLocal()), lastSynced);
    clearPushTimer();
    if (inFlight) await inFlight.catch(() => false);
    clearPushTimer();
    again = false;
    if (stopped) return false;
    return push(true);
  }

  /** Gửi ngay thay vì chờ debounce (khi tab bị ẩn). */
  function flush() {
    if (pushTimer === null || stopped || !ready) return;
    clearPushTimer();
    void push(true);
  }

  return { start, stop: () => halt("off"), flush, flushAndWait };
}

/** Bản trống cùng cấu trúc (dùng khi dữ liệu trên máy thuộc người khác). */
function emptyLike(d: LearnerData): LearnerData {
  return {
    progress: { version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {} },
    roadmap: null,
    roadmapLog: Object.fromEntries(Object.keys(d.roadmapLog).map((k) => [k, {}])) as LearnerData["roadmapLog"],
  };
}
