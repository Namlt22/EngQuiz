import { describe, expect, it } from "vitest";
import { createLearnerSync, isBlank, trimForUpload, type SyncStatus } from "./learner-sync";
import type { LearnerData, LearnerSnapshot } from "./learner-schema";
import { EMPTY_LOG } from "./roadmap";

const base = (xp = 0): LearnerData => ({
  progress: { version: 1, topics: {}, dictations: {}, xp, streak: 0, activity: {} },
  roadmap: null,
  roadmapLog: EMPTY_LOG,
});

/** Môi trường giả: fetch theo kịch bản, timer chạy tay, localStorage là biến. */
type Scripted = { status: number; body: unknown; gate?: Promise<void> };

function harness(responses: Scripted[], initialLocal: LearnerData) {
  let local = initialLocal;
  const listeners = new Set<() => void>();
  const timers = new Map<number, () => void>();
  let nextTimer = 0;
  const requests: Array<{ method: string; body?: unknown }> = [];
  const statuses: SyncStatus[] = [];

  const sync = createLearnerSync({
    fetch: (async (_url: string, init?: RequestInit) => {
      requests.push({ method: init?.method ?? "GET", body: init?.body ? JSON.parse(String(init.body)) : undefined });
      const r = responses.shift() ?? { status: 500, body: {} };
      if (r.gate) await r.gate;
      return new Response(JSON.stringify(r.body), { status: r.status });
    }) as typeof fetch,
    readLocal: () => local,
    writeLocal: (d) => {
      local = d;
      listeners.forEach((l) => l());
    },
    subscribeLocal: (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    onStatus: (s) => statuses.push(s),
    setTimeout: (fn) => {
      timers.set(++nextTimer, fn);
      return nextTimer;
    },
    clearTimeout: (id) => {
      timers.delete(id as number);
    },
  });

  return {
    sync,
    requests,
    statuses,
    get local() {
      return local;
    },
    setLocal(d: LearnerData) {
      local = d;
      listeners.forEach((l) => l());
    },
    /** Chạy timer đang chờ gần nhất và đợi các promise xong. */
    async tick() {
      const id = [...timers.keys()].pop();
      const fn = id === undefined ? undefined : timers.get(id);
      if (id !== undefined) timers.delete(id);
      fn?.();
      await new Promise((r) => setTimeout(r, 0));
    },
  };
}

const snapshot = (data: LearnerData, version: number): LearnerSnapshot => ({ ...data, version });

describe("createLearnerSync", () => {
  it("chưa có bản ghi trên server → đẩy bản trên máy lên với baseVersion null", async () => {
    const h = harness(
      [
        { status: 200, body: { success: true, data: null } },
        { status: 200, body: { success: true, data: { version: 1 } } },
      ],
      base(40),
    );
    await h.sync.start({ mergeLocal: true });
    await h.tick();
    expect(h.requests[1]).toMatchObject({ method: "PUT", body: { baseVersion: null, progress: { xp: 40 } } });
    expect(h.statuses.at(-1)).toBe("saved");
  });

  it("có bản trên server → gộp vào máy, chỉ ghi lên khi khác server", async () => {
    const h = harness([{ status: 200, body: { success: true, data: snapshot(base(100), 3) } }], base(20));
    await h.sync.start({ mergeLocal: true });
    expect(h.local.progress.xp).toBe(100);
    await h.tick();
    expect(h.requests).toHaveLength(1);
    expect(h.statuses.at(-1)).toBe("saved");
  });

  it("409 → gộp với bản mới nhất rồi ghi lại với version mới", async () => {
    const h = harness(
      [
        { status: 200, body: { success: true, data: snapshot(base(10), 1) } },
        { status: 409, body: { success: false, current: snapshot(base(70), 2) } },
        { status: 200, body: { success: true, data: { version: 3 } } },
      ],
      base(0),
    );
    await h.sync.start({ mergeLocal: true });
    h.setLocal({ ...base(50), roadmapLog: { ...EMPTY_LOG, sessions: { "1-1": true } } });
    await h.tick();
    expect(h.local.progress.xp).toBe(70);
    expect(h.local.roadmapLog.sessions).toEqual({ "1-1": true });
    await h.tick();
    expect(h.requests[2]).toMatchObject({
      method: "PUT",
      body: { baseVersion: 2, progress: { xp: 70 }, roadmapLog: { sessions: { "1-1": true } } },
    });
    expect(h.statuses.at(-1)).toBe("saved");
  });

  it("409 mà bản gộp đã trùng server → không ghi thêm", async () => {
    const h = harness(
      [
        { status: 200, body: { success: true, data: snapshot(base(10), 1) } },
        { status: 409, body: { success: false, current: snapshot(base(70), 2) } },
      ],
      base(0),
    );
    await h.sync.start({ mergeLocal: true });
    h.setLocal(base(50));
    await h.tick();
    await h.tick();
    expect(h.requests).toHaveLength(2);
    expect(h.statuses.at(-1)).toBe("saved");
  });

  it("chưa đăng nhập (401) → tắt đồng bộ, không ghi gì", async () => {
    const h = harness([{ status: 401, body: { success: false } }], base(5));
    await h.sync.start({ mergeLocal: true });
    expect(h.statuses.at(-1)).toBe("signed-out");
    expect(h.requests).toHaveLength(1);
  });

  it("stop() rồi đổi dữ liệu trên máy → không gửi nữa", async () => {
    const h = harness([{ status: 200, body: { success: true, data: snapshot(base(1), 1) } }], base(1));
    await h.sync.start({ mergeLocal: true });
    h.sync.stop();
    h.setLocal(base(99));
    await h.tick();
    expect(h.requests.filter((r) => r.method === "PUT")).toHaveLength(0);
  });

  it("flushAndWait chờ lượt gửi đang chạy rồi gửi nốt thay đổi mới (không mất dữ liệu khi đăng xuất)", async () => {
    let open!: () => void;
    const gate = new Promise<void>((r) => (open = r));
    const h = harness(
      [
        { status: 200, body: { success: true, data: snapshot(base(1), 1) } },
        { status: 200, body: { success: true, data: { version: 2 } }, gate },
        { status: 200, body: { success: true, data: { version: 3 } } },
      ],
      base(1),
    );
    await h.sync.start({ mergeLocal: true });
    h.setLocal(base(10));
    await h.tick(); // PUT #1 bắt đầu, đang treo
    h.setLocal(base(20)); // sửa tiếp trong lúc PUT #1 chưa xong
    const done = h.sync.flushAndWait();
    open();
    expect(await done).toBe(true);
    const puts = h.requests.filter((r) => r.method === "PUT");
    expect(puts).toHaveLength(2);
    expect(puts[1].body).toMatchObject({ baseVersion: 2, progress: { xp: 20 } });
  });

  it("flushAndWait trả false khi chưa lưu được (để không xóa dữ liệu trên máy)", async () => {
    const h = harness(
      [
        { status: 200, body: { success: true, data: snapshot(base(1), 1) } },
        { status: 503, body: { success: false } },
      ],
      base(1),
    );
    await h.sync.start({ mergeLocal: true });
    h.setLocal(base(30));
    expect(await h.sync.flushAndWait()).toBe(false);
  });

  it("server từ chối (400) → báo invalid, không thử lại mãi", async () => {
    const h = harness(
      [
        { status: 200, body: { success: true, data: snapshot(base(1), 1) } },
        { status: 400, body: { success: false, error: "bad" } },
      ],
      base(1),
    );
    await h.sync.start({ mergeLocal: true });
    h.setLocal(base(5));
    await h.tick();
    expect(h.statuses.at(-1)).toBe("invalid");
    await h.tick();
    expect(h.requests.filter((r) => r.method === "PUT")).toHaveLength(1);
  });

  it("không ghi dữ liệu trống đè lên tài khoản đã có dữ liệu", async () => {
    const h = harness([{ status: 200, body: { success: true, data: snapshot(base(80), 1) } }], base(80));
    await h.sync.start({ mergeLocal: true });
    h.setLocal(base(0));
    await h.tick();
    expect(h.requests.filter((r) => r.method === "PUT")).toHaveLength(0);
  });

  it("dữ liệu trên máy của người khác (mergeLocal=false) → chỉ dùng bản của tài khoản", async () => {
    const other = { ...base(500), roadmapLog: { ...EMPTY_LOG, sessions: { "1-1": true } } };
    const h = harness([{ status: 200, body: { success: true, data: snapshot(base(7), 1) } }], other);
    await h.sync.start({ mergeLocal: false });
    expect(h.local.progress.xp).toBe(7);
    expect(h.local.roadmapLog.sessions).toEqual({});
  });

  it("409 đến sau khi đã stop() → không ghi lại dữ liệu cũ vào máy", async () => {
    let open!: () => void;
    const gate = new Promise<void>((r) => (open = r));
    const h = harness(
      [
        { status: 200, body: { success: true, data: snapshot(base(1), 1) } },
        { status: 409, body: { success: false, current: snapshot(base(99), 2) }, gate },
      ],
      base(1),
    );
    await h.sync.start({ mergeLocal: true });
    h.setLocal(base(10));
    const pending = h.tick();
    h.sync.stop();
    h.setLocal(base(0)); // đăng xuất đã xóa dữ liệu trên máy
    open();
    await pending;
    await new Promise((r) => setTimeout(r, 0));
    expect(h.local.progress.xp).toBe(0);
  });
});

describe("isBlank", () => {
  it("nhận ra dữ liệu trống", () => {
    expect(isBlank(base(0))).toBe(true);
    expect(isBlank(base(1))).toBe(false);
  });
});

describe("trimForUpload", () => {
  it("giữ các ngày hoạt động gần nhất khi vượt giới hạn", () => {
    const activity = Object.fromEntries(
      Array.from({ length: 3700 }, (_, i) => [new Date(Date.UTC(2010, 0, 1 + i)).toISOString().slice(0, 10), 1]),
    );
    const data = base();
    const trimmed = trimForUpload({ ...data, progress: { ...data.progress, activity } });
    const days = Object.keys(trimmed.progress.activity).sort();
    expect(days).toHaveLength(3660);
    expect(days.at(-1)).toBe(Object.keys(activity).sort().at(-1));
  });
});
