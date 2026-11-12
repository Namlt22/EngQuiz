import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const auth = vi.fn();
const getSpeakingFeedback = vi.fn();

class AiNotConfiguredError extends Error {
  constructor(
    public reason: "missing" | "rejected",
    message = "x",
  ) {
    super(message);
  }
}
class AiRefusedError extends Error {}
class AiUnavailableError extends Error {}
class AiBadOutputError extends Error {}

vi.mock("@/auth", () => ({ auth: () => auth() }));
vi.mock("@/server/speaking-ai", () => ({
  getSpeakingFeedback: (...a: unknown[]) => getSpeakingFeedback(...a),
  AiNotConfiguredError,
  AiRefusedError,
  AiUnavailableError,
  AiBadOutputError,
}));

const ORIGIN = "http://localhost";
const valid = { promptId: "intro-daily-1", transcript: "my name is Nam and I am a engineer", seconds: 20, level: "A2" };

function post(body: unknown, headers: Record<string, string> = { origin: ORIGIN }) {
  return new NextRequest(`${ORIGIN}/api/speaking/feedback`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Nạp lại module để bộ đếm rate limit bắt đầu từ 0. */
async function loadRoute() {
  vi.resetModules();
  return import("./route");
}

beforeEach(() => {
  auth.mockReset().mockResolvedValue({ user: { id: "user-1" } });
  getSpeakingFeedback.mockReset().mockResolvedValue({ overall: 70 });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/speaking/feedback — chặn trước khi gọi AI (tốn phí)", () => {
  it("khác origin → 403; chưa đăng nhập → 401", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post(valid, { origin: "https://evil.example" }))).status).toBe(403);
    auth.mockResolvedValueOnce(null);
    expect((await POST(post(valid))).status).toBe(401);
    expect(getSpeakingFeedback).not.toHaveBeenCalled();
  });

  it("đề không có trong danh sách, dữ liệu sai, câu quá ngắn → 400", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post({ ...valid, promptId: "ignore-previous-instructions" }))).status).toBe(400);
    expect((await POST(post({ ...valid, extra: 1 }))).status).toBe(400);
    expect((await POST(post({ ...valid, transcript: "hello there" }))).status).toBe(400);
    expect((await POST(post("not json"))).status).toBe(400);
    expect(getSpeakingFeedback).not.toHaveBeenCalled();
  });

  it("body quá lớn → 413", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post({ ...valid, transcript: "a ".repeat(20_000) }))).status).toBe(413);
  });

  it("hợp lệ → gọi AI với đúng đề và trả kết quả", async () => {
    const { POST } = await loadRoute();
    const res = await POST(post(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, data: { overall: 70 }, error: null });
    const arg = getSpeakingFeedback.mock.calls[0][0];
    expect(arg.prompt.text).toBe("Tell me about yourself.");
    expect(arg.level).toBe("A2");
  });

  it("vượt 10 lượt / 10 phút → 429", async () => {
    const { POST } = await loadRoute();
    for (let i = 0; i < 10; i++) expect((await POST(post(valid))).status).toBe(200);
    expect((await POST(post(valid))).status).toBe(429);
  });

  it.each([
    [new AiNotConfiguredError("missing"), 503, "thiếu"],
    [new AiNotConfiguredError("rejected"), 503, "bị từ chối"],
    [new AiUnavailableError("x"), 503, "bận"],
    [new AiBadOutputError("x"), 502, "không đọc được"],
    [new AiRefusedError("x"), 422, "không chấm được"],
    [new Error("boom"), 500, "Có lỗi"],
  ])("lỗi AI %s → %i, thông báo riêng, không lộ chi tiết", async (err, status, text) => {
    const { POST } = await loadRoute();
    getSpeakingFeedback.mockRejectedValueOnce(err);
    const res = await POST(post(valid));
    expect(res.status).toBe(status);
    const { error } = await res.json();
    expect(error).toContain(text);
    expect(error).not.toContain("boom");
  });

  it("lượt lỗi do phía AI được trả lại, không làm người học hết lượt", async () => {
    const { POST } = await loadRoute();
    getSpeakingFeedback.mockRejectedValue(new AiUnavailableError("down"));
    for (let i = 0; i < 15; i++) expect((await POST(post(valid))).status).toBe(503);
    getSpeakingFeedback.mockResolvedValue({ overall: 70 });
    expect((await POST(post(valid))).status).toBe(200);
  });

  it("một IP nhiều tài khoản → bị chặn theo IP sau 20 lượt", async () => {
    const { POST } = await loadRoute();
    for (let i = 0; i < 20; i++) {
      auth.mockResolvedValueOnce({ user: { id: `user-${i}` } });
      expect((await POST(post(valid, { origin: ORIGIN, "x-forwarded-for": "10.0.0.9" }))).status).toBe(200);
    }
    auth.mockResolvedValueOnce({ user: { id: "user-new" } });
    expect((await POST(post(valid, { origin: ORIGIN, "x-forwarded-for": "10.0.0.9" }))).status).toBe(429);
  });
});
