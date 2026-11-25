import { describe, expect, it } from "vitest";
import { aiErrorResponse } from "./ai-errors";
import { AiBadOutputError, AiNotConfiguredError, AiRefusedError, AiUnavailableError } from "./anthropic-client";
import { fail, ok, readFormBody, readJsonBody, readJsonObject } from "./api-response";
import { createRateLimiter, refundAll, takeAll } from "./rate-limit";
import { readBytesWithLimit } from "./request";
import { recordingFileName } from "./voice-service";

const put = (body: BodyInit, headers: Record<string, string> = {}) => new Request("http://x/", { method: "PUT", body, headers });

describe("ok / fail", () => {
  it("trả envelope { success, data, error } với mã HTTP", async () => {
    const good = ok({ a: 1 }, 201);
    expect(good.status).toBe(201);
    expect(await good.json()).toEqual({ success: true, data: { a: 1 }, error: null });
    const bad = fail(429, "chậm lại");
    expect(bad.status).toBe(429);
    expect(await bad.json()).toEqual({ success: false, data: null, error: "chậm lại" });
  });
});

describe("readJsonBody", () => {
  const messages = { tooLarge: "to quá", invalid: "sai JSON" };

  it("JSON hợp lệ (kể cả không phải object) → { json }", async () => {
    expect(await readJsonBody(put('{"x":1}'), 100, messages)).toEqual({ json: { x: 1 } });
    expect(await readJsonBody(put("[1]"), 100, messages)).toEqual({ json: [1] });
  });

  it("quá lớn → 413, hỏng → 400, dùng thông báo riêng", async () => {
    const big = (await readJsonBody(put("x".repeat(50)), 10, messages)) as Response;
    expect(big.status).toBe(413);
    expect((await big.json()).error).toBe("to quá");
    const broken = (await readJsonBody(put("{"), 100, messages)) as Response;
    expect(broken.status).toBe(400);
    expect((await broken.json()).error).toBe("sai JSON");
  });
});

describe("readJsonObject", () => {
  it("chỉ nhận object", async () => {
    expect(await readJsonObject(put('{"plan":"a"}'), 100)).toEqual({ plan: "a" });
    const arr = (await readJsonObject(put("[]"), 100)) as Response;
    expect(arr.status).toBe(400);
    expect((await arr.json()).error).toBe("Dữ liệu không hợp lệ.");
  });
});

describe("readFormBody", () => {
  const formRequest = async (form: FormData) => {
    const encoded = new Response(form);
    return new Request("http://x/", {
      method: "POST",
      body: await encoded.arrayBuffer(),
      headers: { "content-type": encoded.headers.get("content-type") ?? "" },
    });
  };

  it("đọc được form có file", async () => {
    const form = new FormData();
    form.set("text", "hello");
    form.set("file", new Blob(["abc"], { type: "audio/webm" }), "rec");
    const out = await readFormBody(await formRequest(form), 10_000, "dài quá");
    expect(out).toBeInstanceOf(FormData);
    expect((out as FormData).get("text")).toBe("hello");
  });

  it("Content-Length khai báo quá lớn hoặc body thật quá lớn → 413", async () => {
    const declared = (await readFormBody(put("a", { "content-length": "999" }), 10, "dài quá")) as Response;
    expect(declared.status).toBe(413);
    const actual = (await readFormBody(put("a".repeat(50)), 10, "dài quá")) as Response;
    expect(actual.status).toBe(413);
    expect((await actual.json()).error).toBe("dài quá");
  });

  it("không phải multipart → 400", async () => {
    const res = (await readFormBody(put("not a form", { "content-type": "multipart/form-data; boundary=zz" }), 1000, "dài quá")) as Response;
    expect(res.status).toBe(400);
  });
});

describe("readBytesWithLimit", () => {
  it("ghép các khúc, dừng khi vượt giới hạn", async () => {
    expect(Array.from((await readBytesWithLimit(put("abc"), 3)) ?? [])).toEqual([97, 98, 99]);
    expect(await readBytesWithLimit(put("abcd"), 3)).toBeNull();
  });
});

describe("takeAll / refundAll", () => {
  it("lấy đủ mọi bộ đếm → null", () => {
    const a = createRateLimiter({ limit: 1, windowMs: 1000 });
    const b = createRateLimiter({ limit: 1, windowMs: 1000 });
    const steps = [
      { limiter: a, key: "u", message: "a hết" },
      { limiter: b, key: "ip", message: "b hết" },
    ];
    expect(takeAll(steps, 0)).toBeNull();
    expect(a.check("u", 1)).toBe(false);
  });

  it("bộ sau hết lượt → trả lại lượt của bộ trước, báo thông báo của bộ hết", () => {
    const a = createRateLimiter({ limit: 1, windowMs: 1000 });
    const b = createRateLimiter({ limit: 1, windowMs: 1000 });
    b.check("ip", 0);
    const steps = [
      { limiter: a, key: "u", message: "a hết" },
      { limiter: b, key: "ip", message: "b hết" },
    ];
    expect(takeAll(steps, 1)).toBe("b hết");
    expect(a.check("u", 2)).toBe(true);
  });

  it("refundAll trả lại một lượt ở mọi bộ", () => {
    const a = createRateLimiter({ limit: 1, windowMs: 1000 });
    const b = createRateLimiter({ limit: 1, windowMs: 1000 });
    const steps = [
      { limiter: a, key: "u", message: "" },
      { limiter: b, key: "ip", message: "" },
    ];
    takeAll(steps, 0);
    refundAll(steps, 1);
    expect(takeAll(steps, 2)).toBeNull();
  });
});

describe("aiErrorResponse", () => {
  const messages = { refused: "từ chối", badOutput: "đọc không được", fallback: "lỗi chung" };
  const of = async (e: unknown) => {
    const res = aiErrorResponse(e, messages);
    return [res.status, (await res.json()).error];
  };

  it("ánh xạ từng loại lỗi AI sang mã + thông báo", async () => {
    expect(await of(new AiRefusedError())).toEqual([422, "từ chối"]);
    expect(await of(new AiBadOutputError())).toEqual([502, "đọc không được"]);
    expect((await of(new AiUnavailableError()))[0]).toBe(503);
    expect((await of(new AiNotConfiguredError("missing", "x")))[0]).toBe(503);
    expect(await of(new Error("x"))).toEqual([500, "lỗi chung"]);
  });
});

describe("recordingFileName", () => {
  it("đặt đuôi theo loại bản ghi", () => {
    expect(recordingFileName("audio/ogg;codecs=opus")).toBe("rec.ogg");
    expect(recordingFileName("audio/mp4")).toBe("rec.m4a");
    expect(recordingFileName("audio/webm")).toBe("rec.webm");
    expect(recordingFileName("")).toBe("rec.webm");
  });
});
