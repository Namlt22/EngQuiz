import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const auth = vi.fn();
vi.mock("@/auth", () => ({ auth: () => auth() }));

const ORIGIN = "http://localhost";
const fetchMock = vi.fn();

async function post(fields: Record<string, string>, { bytes = 1000, origin = ORIGIN, length }: { bytes?: number; origin?: string; length?: string } = {}) {
  const form = new FormData();
  form.set("file", new Blob([new Uint8Array(bytes)], { type: "audio/webm" }), "rec.webm");
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  const probe = new Request(ORIGIN, { method: "POST", body: form });
  const body = await probe.arrayBuffer();
  return new NextRequest(`${ORIGIN}/api/transcribe`, {
    method: "POST",
    headers: { origin, "content-type": probe.headers.get("content-type")!, "content-length": length ?? String(body.byteLength) },
    body,
  });
}

const HEARD = { transcript: "See.", alternatives: ["See.", "see"], seconds: 0.8 };

describe("POST /api/transcribe", () => {
  beforeEach(() => {
    vi.resetModules();
    auth.mockResolvedValue({ user: { id: "u1" } });
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("chuyển bản ghi tới dịch vụ cục bộ và trả lời nói đã kiểm tra", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(HEARD), { status: 200 }));
    const { POST } = await import("./route");
    const res = await POST(await post({ lang: "en", expected: "see" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual({ transcript: "See.", alternatives: ["See.", "see"] });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/transcribe$/);
    expect((init.body as FormData).get("lang")).toBe("en");
    expect((init.body as FormData).get("expected")).toBe("see");
  });

  it("ngôn ngữ lạ → về tiếng Anh; câu mẫu quá dài bị cắt", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(HEARD), { status: 200 }));
    const { POST } = await import("./route");
    await POST(await post({ lang: "fr", expected: "a".repeat(500) }));
    const form = fetchMock.mock.calls[0][1].body as FormData;
    expect(form.get("lang")).toBe("en");
    expect(String(form.get("expected")).length).toBe(200);
  });

  it("chặn khi chưa đăng nhập, khác nguồn, thiếu / quá kích thước", async () => {
    const { POST } = await import("./route");
    auth.mockResolvedValueOnce(null);
    expect((await POST(await post({}))).status).toBe(401);
    expect((await POST(await post({}, { origin: "https://evil.example" }))).status).toBe(403);
    expect((await POST(await post({}, { bytes: 0 }))).status).toBe(400);
    expect((await POST(await post({}, { bytes: 5 * 1024 * 1024, length: "0" }))).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("dịch vụ không chạy hoặc trả dữ liệu lạ → báo lỗi gọn", async () => {
    const { POST } = await import("./route");
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    const down = await POST(await post({}));
    expect(down.status).toBe(503);
    expect((await down.json()).error).toContain("tạm nghỉ");
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ nope: 1 }), { status: 200 }));
    expect((await POST(await post({}))).status).toBe(502);
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 422 }));
    expect((await POST(await post({}))).status).toBe(422);
  });
});
