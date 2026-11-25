import { afterEach, describe, expect, it, vi } from "vitest";
import { isServiceResting, postApi, replyData, replyError } from "./api-client";
import { pronouncePhaseLabel, scoredMicState } from "./mic-state";
import { isMicPermissionError } from "./recorder";
import { heardOutcome } from "./server-recognition";

describe("postApi", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("gửi object dạng JSON, đọc envelope", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true, data: { code: "A1" }, error: null }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const reply = await postApi<{ code: string }>("/api/x", { plan: "m1" });
    expect(reply).toEqual({ status: 201, ok: true, json: { success: true, data: { code: "A1" }, error: null } });
    const init = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.headers).toEqual({ "content-type": "application/json" });
    expect(init.body).toBe('{"plan":"m1"}');
  });

  it("gửi FormData nguyên, không đặt content-type; thân không phải JSON → json null", async () => {
    const fetchMock = vi.fn(async () => new Response("oops", { status: 502 }));
    vi.stubGlobal("fetch", fetchMock);
    const form = new FormData();
    const reply = await postApi("/api/y", form);
    expect(reply).toEqual({ status: 502, ok: false, json: null });
    const init = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.body).toBe(form);
    expect(init.headers).toBeUndefined();
  });

  it("lỗi mạng vẫn ném ra để màn hình tự báo", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("offline"))));
    await expect(postApi("/api/z", {})).rejects.toThrow("offline");
  });
});

describe("replyData / replyError / isServiceResting", () => {
  const good = { status: 200, ok: true, json: { success: true as const, data: 5, error: null } };
  const bad = { status: 503, ok: false, json: { success: false as const, data: null, error: "Chấm phát âm đang tạm nghỉ." } };

  it("chỉ trả dữ liệu khi HTTP 2xx và success", () => {
    expect(replyData(good)).toBe(5);
    expect(replyData(bad)).toBeUndefined();
    expect(replyData({ status: 500, ok: false, json: null })).toBeUndefined();
  });

  it("thông báo lỗi của máy chủ, nếu không có thì dùng fallback", () => {
    expect(replyError(bad, "fallback")).toBe("Chấm phát âm đang tạm nghỉ.");
    expect(replyError({ status: 500, ok: false, json: null }, "fallback")).toBe("fallback");
  });

  it("dịch vụ tắt = 503 kèm “tạm nghỉ”; 503 đang khởi động thì không", () => {
    expect(isServiceResting(bad)).toBe(true);
    expect(isServiceResting({ ...bad, json: { ...bad.json, error: "Bộ chấm đang khởi động" } })).toBe(false);
    expect(isServiceResting({ ...bad, status: 502 })).toBe(false);
  });
});

describe("scoredMicState", () => {
  const recognition = { status: "ready", listening: true, recognizing: false };

  it("đã đăng nhập → theo chấm phát âm, nhãn chờ “Đang chấm…”", () => {
    expect(scoredMicState({ available: true, busy: true, phase: "scoring" }, recognition)).toEqual({
      canRecord: true,
      recording: true,
      busy: true,
      busyLabel: "Đang chấm…",
    });
  });

  it("chưa đăng nhập → theo nhận dạng giọng nói, nhãn mặc định", () => {
    expect(scoredMicState({ available: false, busy: false, phase: "idle" }, recognition)).toEqual({
      canRecord: true,
      recording: true,
      busy: false,
      busyLabel: undefined,
    });
    expect(scoredMicState({ available: false, busy: false, phase: "idle" }, { ...recognition, status: "unsupported" }).canRecord).toBe(false);
  });

  it("nhãn từng giai đoạn chấm", () => {
    expect(pronouncePhaseLabel("preparing")).toBe("Chuẩn bị…");
    expect(pronouncePhaseLabel("recording")).toBe("Đang nghe…");
    expect(pronouncePhaseLabel("scoring")).toBe("Đang chấm…");
    expect(pronouncePhaseLabel("idle")).toBe("");
  });
});

describe("heardOutcome", () => {
  it("bản chính đứng đầu, bỏ bản đoán rỗng / trùng", () => {
    expect(heardOutcome({ transcript: " hello ", alternatives: ["hello", " ", "hollow "] }, 1200)).toEqual({
      kind: "heard",
      transcript: "hello",
      alternatives: ["hello", "hollow"],
      durationMs: 1200,
    });
  });

  it("không có chữ → báo không nghe thấy", () => {
    expect(heardOutcome({ transcript: "  ", alternatives: [] }, 10).kind).toBe("failed");
  });
});

describe("isMicPermissionError", () => {
  it("chỉ coi bị chặn quyền là NotAllowedError / SecurityError", () => {
    expect(isMicPermissionError(new DOMException("x", "NotAllowedError"))).toBe(true);
    expect(isMicPermissionError(new DOMException("x", "SecurityError"))).toBe(true);
    expect(isMicPermissionError(new DOMException("x", "NotFoundError"))).toBe(false);
    expect(isMicPermissionError(new Error("x"))).toBe(false);
  });
});
