import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { EMPTY_LOG } from "@/lib/roadmap";

const auth = vi.fn();
const findLearner = vi.fn();
const saveLearner = vi.fn();

vi.mock("@/auth", () => ({ auth: () => auth() }));
vi.mock("@/server/learner-repo", () => ({
  findLearner: (...a: unknown[]) => findLearner(...a),
  saveLearner: (...a: unknown[]) => saveLearner(...a),
}));

const ORIGIN = "http://localhost";
const validBody = {
  progress: { version: 1, topics: {}, dictations: {}, xp: 5, streak: 1, activity: {} },
  roadmap: null,
  roadmapLog: EMPTY_LOG,
  baseVersion: 2,
};

function put(body: unknown, headers: Record<string, string> = { origin: ORIGIN }) {
  return new NextRequest(`${ORIGIN}/api/learner`, {
    method: "PUT",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Nạp lại module để bộ đếm rate limit (biến cấp module) bắt đầu từ 0. */
async function loadRoute() {
  vi.resetModules();
  return import("./route");
}

beforeEach(() => {
  auth.mockReset().mockResolvedValue({ user: { id: "user-1" } });
  findLearner.mockReset();
  saveLearner.mockReset();
});

describe("PUT /api/learner — chặn trước khi ghi", () => {
  it("thiếu Origin hoặc Origin khác → 403", async () => {
    const { PUT } = await loadRoute();
    expect((await PUT(put(validBody, {}))).status).toBe(403);
    expect((await PUT(put(validBody, { origin: "https://evil.example" }))).status).toBe(403);
    expect(saveLearner).not.toHaveBeenCalled();
  });

  it("chưa đăng nhập → 401", async () => {
    auth.mockResolvedValue(null);
    const { PUT } = await loadRoute();
    expect((await PUT(put(validBody))).status).toBe(401);
    expect(saveLearner).not.toHaveBeenCalled();
  });

  it("body quá lớn → 413 (kể cả khi không khai báo content-length)", async () => {
    const { PUT } = await loadRoute();
    const big = JSON.stringify({ ...validBody, pad: "x".repeat(300 * 1024) });
    expect((await PUT(put(big))).status).toBe(413);
    expect(saveLearner).not.toHaveBeenCalled();
  });

  it("JSON hỏng hoặc sai schema → 400", async () => {
    const { PUT } = await loadRoute();
    expect((await PUT(put("{oops"))).status).toBe(400);
    expect((await PUT(put({ ...validBody, progress: { ...validBody.progress, xp: -1 } }))).status).toBe(400);
    expect(saveLearner).not.toHaveBeenCalled();
  });
});

describe("PUT /api/learner — kết quả ghi", () => {
  it("ghi thành công → 200 kèm version mới; ghi đúng user, không lưu baseVersion", async () => {
    saveLearner.mockResolvedValue({ ok: true, version: 3 });
    const { PUT } = await loadRoute();
    const res = await PUT(put(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, data: { version: 3 }, error: null });
    const [userId, data, baseVersion] = saveLearner.mock.calls[0];
    expect(userId).toBe("user-1");
    expect(baseVersion).toBe(2);
    expect(data).not.toHaveProperty("baseVersion");
  });

  it("version lệch → 409 kèm bản hiện tại", async () => {
    const current = { ...validBody, baseVersion: undefined, version: 4 };
    saveLearner.mockResolvedValue({ ok: false, current });
    const { PUT } = await loadRoute();
    const res = await PUT(put(validBody));
    expect(res.status).toBe(409);
    expect((await res.json()).current.version).toBe(4);
  });

  it("lỗi database → 500, không lộ chi tiết lỗi", async () => {
    saveLearner.mockRejectedValue(new Error("connection refused at 10.0.0.5"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { PUT } = await loadRoute();
    const res = await PUT(put(validBody));
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("10.0.0.5");
  });
});

describe("GET /api/learner", () => {
  it("chưa đăng nhập → 401, không đọc DB", async () => {
    auth.mockResolvedValue(null);
    const { GET } = await loadRoute();
    expect((await GET()).status).toBe(401);
    expect(findLearner).not.toHaveBeenCalled();
  });

  it("chưa có bản ghi → 200 với data null", async () => {
    findLearner.mockResolvedValue(null);
    const { GET } = await loadRoute();
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, data: null, error: null });
  });

  it("vượt 60 lượt/phút → 429", async () => {
    findLearner.mockResolvedValue(null);
    const { GET } = await loadRoute();
    for (let i = 0; i < 60; i++) await GET();
    expect((await GET()).status).toBe(429);
  });

  it("lỗi đọc DB → 500", async () => {
    findLearner.mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { GET } = await loadRoute();
    expect((await GET()).status).toBe(500);
  });
});
