import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const auth = vi.fn();
const getChatReply = vi.fn();
const takeAiTurn = vi.fn();
const refundAiTurn = vi.fn();
class BillingError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
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
vi.mock("@/server/billing", () => ({
  takeAiTurn: (...a: unknown[]) => takeAiTurn(...a),
  refundAiTurn: (...a: unknown[]) => refundAiTurn(...a),
  BillingError,
}));
vi.mock("@/server/chat-ai", () => ({ getChatReply: (...a: unknown[]) => getChatReply(...a) }));
vi.mock("@/server/anthropic-client", () => ({ AiNotConfiguredError, AiRefusedError, AiUnavailableError, AiBadOutputError }));

const ORIGIN = "http://localhost";
const CONV = "3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e";
const reply = { reply: "Sure!", replyVi: "Được!", correction: null, ended: false, turnsLeft: 11 };

function body(learnerTurns = 1, overrides: Record<string, unknown> = {}) {
  const messages = [{ role: "ai", text: "Hi! What can I get for you?" }];
  for (let i = 0; i < learnerTurns; i++) {
    if (i > 0) messages.push({ role: "ai", text: "Anything else?" });
    messages.push({ role: "learner", text: `A coffee please ${i}` });
  }
  return { course: "en", scenarioId: "en-cafe", level: "A1", conversationId: CONV, messages, ...overrides };
}

function post(b: unknown, headers: Record<string, string> = { origin: ORIGIN }) {
  return new NextRequest(`${ORIGIN}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof b === "string" ? b : JSON.stringify(b),
  });
}

/** Nạp lại module để bộ đếm cuộc trò chuyện và rate limit bắt đầu từ 0. */
async function loadRoute() {
  vi.resetModules();
  return import("./route");
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.mockResolvedValue({ user: { id: "u1" } });
  takeAiTurn.mockResolvedValue({ kind: "trial" });
  refundAiTurn.mockResolvedValue(undefined);
  getChatReply.mockResolvedValue(reply);
});

describe("POST /api/chat", () => {
  it("chưa đăng nhập → 401, không gọi AI", async () => {
    auth.mockResolvedValue(null);
    const { POST } = await loadRoute();
    const res = await POST(post(body()));
    expect(res.status).toBe(401);
    expect(getChatReply).not.toHaveBeenCalled();
  });

  it("khác nguồn → 403", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post(body(), { origin: "https://evil.example" }))).status).toBe(403);
  });

  it("dữ liệu sai (tin cuối là của AI, tình huống khác khoá) → 400, không tính lượt", async () => {
    const { POST } = await loadRoute();
    const bad = body();
    bad.messages.push({ role: "ai", text: "x" });
    expect((await POST(post(bad))).status).toBe(400);
    expect((await POST(post(body(1, { course: "zh", level: "HSK 1" })))).status).toBe(400);
    expect(takeAiTurn).not.toHaveBeenCalled();
  });

  it("1 cuộc = 1 lượt AI: tin thứ hai cùng cuộc không lấy thêm lượt; cuộc mới thì lấy", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post(body(1)))).status).toBe(200);
    expect((await POST(post(body(2)))).status).toBe(200);
    expect(takeAiTurn).toHaveBeenCalledTimes(1);
    await POST(post(body(1, { conversationId: "7a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d" })));
    expect(takeAiTurn).toHaveBeenCalledTimes(2);
  });

  it("đếm ở server: sau 12 tin thì từ chối, kể cả khi trình duyệt gửi lịch sử ngắn hơn", async () => {
    const { POST } = await loadRoute();
    for (let i = 0; i < 12; i++) expect((await POST(post(body(1)))).status).toBe(200);
    const res = await POST(post(body(1)));
    expect(res.status).toBe(409);
    expect(getChatReply).toHaveBeenCalledTimes(12);
  });

  it("trò chuyện tự do dùng cấp người học chọn; nhập vai dùng cấp của tình huống", async () => {
    const { POST } = await loadRoute();
    await POST(post(body(1, { scenarioId: "free", level: "B2" })));
    expect(getChatReply.mock.calls[0][0]).toMatchObject({ level: "B2", scenario: undefined });
    await POST(post(body(1, { level: "C1", conversationId: "7a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d" })));
    expect(getChatReply.mock.calls[1][0]).toMatchObject({ level: "A1" });
  });

  it("hết lượt AI → trả lỗi của billing, không gọi AI; gửi lại vẫn kiểm tra lượt", async () => {
    takeAiTurn.mockRejectedValue(new BillingError(402, "Hết lượt dùng thử"));
    const { POST } = await loadRoute();
    const res = await POST(post(body()));
    expect(res.status).toBe(402);
    expect((await res.json()).error).toBe("Hết lượt dùng thử");
    await POST(post(body()));
    expect(takeAiTurn).toHaveBeenCalledTimes(2);
    expect(getChatReply).not.toHaveBeenCalled();
  });

  it("tin đầu tiên lỗi do AI → trả lại lượt AI; gửi lại mở cuộc mới", async () => {
    getChatReply.mockRejectedValueOnce(new AiUnavailableError("busy"));
    const { POST } = await loadRoute();
    expect((await POST(post(body()))).status).toBe(503);
    expect(refundAiTurn).toHaveBeenCalledWith("u1", { kind: "trial" });
    expect((await POST(post(body()))).status).toBe(200);
    expect(takeAiTurn).toHaveBeenCalledTimes(2);
  });

  it("tin sau trong cuộc lỗi → không trả lượt (lượt thuộc về cả cuộc), cuộc vẫn tiếp tục", async () => {
    const { POST } = await loadRoute();
    await POST(post(body(1)));
    getChatReply.mockRejectedValueOnce(new AiBadOutputError("x"));
    expect((await POST(post(body(2)))).status).toBe(502);
    expect(refundAiTurn).not.toHaveBeenCalled();
    expect((await POST(post(body(2)))).status).toBe(200);
  });

  it("hai tin gửi cùng lúc trong một cuộc → tin thứ hai bị từ chối, chỉ lấy một lượt", async () => {
    let release!: () => void;
    getChatReply.mockImplementationOnce(() => new Promise((r) => (release = () => r(reply))));
    const { POST } = await loadRoute();
    const first = POST(post(body(1)));
    await vi.waitFor(() => expect(getChatReply).toHaveBeenCalledTimes(1));
    const second = await POST(post(body(1)));
    expect(second.status).toBe(409);
    release();
    expect((await first).status).toBe(200);
    expect(takeAiTurn).toHaveBeenCalledTimes(1);
  });
});
