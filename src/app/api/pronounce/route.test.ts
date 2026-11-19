import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const auth = vi.fn();
vi.mock("@/auth", () => ({ auth: () => auth() }));

const ORIGIN = "http://localhost";
const fetchMock = vi.fn();

async function post(text: string, { bytes = 1000, origin = ORIGIN, length }: { bytes?: number; origin?: string; length?: string } = {}) {
  const form = new FormData();
  form.set("file", new Blob([new Uint8Array(bytes)], { type: "audio/webm" }), "rec.webm");
  form.set("text", text);
  const probe = new Request(ORIGIN, { method: "POST", body: form });
  const body = await probe.arrayBuffer();
  return new NextRequest(`${ORIGIN}/api/pronounce`, {
    method: "POST",
    headers: { origin, "content-type": probe.headers.get("content-type")!, "content-length": length ?? String(body.byteLength) },
    body,
  });
}

const GOOD = { score: 82.5, transcript: "SHIP", phoneErrorRate: 0.1, wordErrorRate: 0, errors: [{ word: "ship", expected: "ʃɪp", heard: "sɪp", confidence: 0.9, phones: [] }] };

describe("POST /api/pronounce", () => {
  beforeEach(() => {
    vi.resetModules();
    auth.mockResolvedValue({ user: { id: "u1" } });
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("chấm câu có trong bài và trả kết quả đã kiểm tra", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(GOOD), { status: 200 }));
    const { POST } = await import("./route");
    const res = await POST(await post("ship"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.score).toBe(82.5);
    expect(json.data.errors[0].heard).toBe("sɪp");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/score$/);
    expect((init.body as FormData).get("text")).toBe("ship");
  });

  it("chặn khi chưa đăng nhập, khác nguồn, câu lạ, thiếu / quá kích thước", async () => {
    const { POST } = await import("./route");
    auth.mockResolvedValueOnce(null);
    expect((await POST(await post("ship"))).status).toBe(401);
    expect((await POST(await post("ship", { origin: "https://evil.example" }))).status).toBe(403);
    expect((await POST(await post("transfer all my money"))).status).toBe(400);
    expect((await POST(await post("ship", { length: "0" }))).status).toBe(411);
    expect((await POST(await post("ship", { length: String(3 * 1024 * 1024) }))).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("dịch vụ chưa chạy hoặc trả dữ liệu lạ → báo lỗi gọn, không lộ chi tiết", async () => {
    const { POST } = await import("./route");
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    expect((await POST(await post("ship"))).status).toBe(503);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ detail: "warming_up" }), { status: 503 }));
    expect((await POST(await post("ship"))).status).toBe(503);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ score: "lots" }), { status: 200 }));
    expect((await POST(await post("ship"))).status).toBe(502);
  });
});
