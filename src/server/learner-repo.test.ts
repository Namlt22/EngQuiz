import { beforeEach, describe, expect, it, vi } from "vitest";
import { EMPTY_LOG } from "@/lib/roadmap";
import type { LearnerData } from "@/lib/learner-schema";

const learnerState = { findUnique: vi.fn(), create: vi.fn(), updateMany: vi.fn() };
vi.mock("./db", () => ({ prisma: { learnerState } }));

class FakeKnownError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
const DbNull = Symbol("DbNull");
vi.mock("@/generated/prisma/client", () => ({
  Prisma: { PrismaClientKnownRequestError: FakeKnownError, DbNull },
}));

const { findLearner, saveLearner } = await import("./learner-repo");

const data: LearnerData = {
  progress: { version: 1, topics: {}, dictations: {}, xp: 3, streak: 1, activity: {} },
  roadmap: null,
  roadmapLog: EMPTY_LOG,
};

beforeEach(() => {
  Object.values(learnerState).forEach((f) => f.mockReset());
});

describe("saveLearner", () => {
  it("cập nhật chỉ khi version khớp và trả version + 1", async () => {
    learnerState.updateMany.mockResolvedValue({ count: 1 });
    expect(await saveLearner("u1", data, 4)).toEqual({ ok: true, version: 5 });
    const arg = learnerState.updateMany.mock.calls[0][0];
    expect(arg.where).toEqual({ userId: "u1", version: 4 });
    expect(arg.data.roadmap).toBe(DbNull);
  });

  it("version lệch → conflict kèm bản hiện tại", async () => {
    learnerState.updateMany.mockResolvedValue({ count: 0 });
    learnerState.findUnique.mockResolvedValue({ ...data, version: 9 });
    const r = await saveLearner("u1", data, 4);
    expect(r).toMatchObject({ ok: false, current: { version: 9 } });
  });

  it("tạo mới bị trùng (P2002) → conflict; lỗi khác → ném ra", async () => {
    learnerState.create.mockRejectedValueOnce(new FakeKnownError("P2002"));
    learnerState.findUnique.mockResolvedValue({ ...data, version: 1 });
    expect(await saveLearner("u1", data, null)).toMatchObject({ ok: false });

    learnerState.create.mockRejectedValueOnce(new Error("db down"));
    await expect(saveLearner("u1", data, null)).rejects.toThrow("db down");
  });
});

describe("findLearner", () => {
  it("không có bản ghi → null; có → kèm version", async () => {
    learnerState.findUnique.mockResolvedValueOnce(null);
    expect(await findLearner("u1")).toBeNull();
    learnerState.findUnique.mockResolvedValueOnce({ ...data, version: 2 });
    expect(await findLearner("u1")).toEqual({ ...data, version: 2 });
  });

  it("bản ghi hỏng → giữ phần hợp lệ, không khóa tài khoản", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    learnerState.findUnique.mockResolvedValueOnce({
      progress: { ...data.progress, xp: -1, extra: true },
      roadmap: { level: "C2" },
      roadmapLog: { sessions: { "1-1": true, "1-2": "x" } },
      version: 3,
    });
    const r = await findLearner("u1");
    expect(r?.progress.xp).toBe(0);
    expect(r?.roadmap).toBeNull();
    expect(r?.roadmapLog.sessions).toEqual({ "1-1": true });
    expect(r?.version).toBe(3);
  });
});
