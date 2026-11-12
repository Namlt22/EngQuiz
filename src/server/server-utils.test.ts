import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BodyTooLargeError, clientIp, isSameOrigin, readBodyWithLimit } from "./request";

describe("readBodyWithLimit", () => {
  it("đọc body nhỏ, đếm theo byte (ký tự tiếng Việt chiếm nhiều byte)", async () => {
    const req = new Request("http://x/", { method: "PUT", body: "ệệ" });
    expect(await readBodyWithLimit(req, 6)).toBe("ệệ");
    await expect(readBodyWithLimit(new Request("http://x/", { method: "PUT", body: "ệệệ" }), 6)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });

  it("Content-Length sai định dạng hoặc quá lớn → từ chối ngay", async () => {
    const bad = new Request("http://x/", { method: "PUT", body: "{}", headers: { "content-length": "abc" } });
    await expect(readBodyWithLimit(bad, 100)).rejects.toBeInstanceOf(BodyTooLargeError);
  });
});

describe("isSameOrigin & clientIp", () => {
  const req = (headers: Record<string, string>) => new Request("http://app.local/api", { method: "PUT", headers });
  it("cùng host → true; khác host, thiếu Origin, cross-site → false", () => {
    expect(isSameOrigin(req({ origin: "http://app.local" }))).toBe(true);
    expect(isSameOrigin(req({ origin: "http://evil.local" }))).toBe(false);
    expect(isSameOrigin(req({}))).toBe(false);
    expect(isSameOrigin(req({ origin: "http://app.local", "sec-fetch-site": "cross-site" }))).toBe(false);
  });
  it("sau proxy: so với x-forwarded-host", () => {
    expect(isSameOrigin(req({ origin: "https://engquiz.vn", "x-forwarded-host": "engquiz.vn" }))).toBe(true);
  });
  it("clientIp lấy IP đầu tiên của x-forwarded-for", () => {
    expect(clientIp(req({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
    expect(clientIp(req({}))).toBe("unknown");
  });
});

describe("sendLoginEmail", () => {
  const params = (url = "http://localhost:3000/api/auth/callback/email?token=t") =>
    ({ identifier: "a@b.c", url, provider: { from: "x@y.z" } }) as unknown as Parameters<
      typeof import("./login-email").sendLoginEmail
    >[0];

  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("nodemailer");
  });

  it("production mà thiếu EMAIL_SERVER → báo lỗi, không in link ra log", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("EMAIL_SERVER", "");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendLoginEmail } = await import("./login-email");
    await expect(sendLoginEmail(params())).rejects.toThrow(/EMAIL_SERVER/);
    expect(info).not.toHaveBeenCalled();
  });

  it("dev mà thiếu EMAIL_SERVER → in link ra terminal", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EMAIL_SERVER", "");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendLoginEmail } = await import("./login-email");
    await sendLoginEmail(params());
    expect(info).toHaveBeenCalledWith(expect.stringContaining("token=t"));
  });

  it("có EMAIL_SERVER → gửi qua SMTP, link trong HTML được escape, báo lỗi khi bị từ chối", async () => {
    vi.stubEnv("EMAIL_SERVER", "smtp://u:p@localhost:2525");
    const sendMail = vi.fn().mockResolvedValue({ rejected: [] });
    vi.doMock("nodemailer", () => ({ createTransport: () => ({ sendMail }) }));
    const { sendLoginEmail } = await import("./login-email");
    await sendLoginEmail(params('http://localhost/cb?x="><script>'));
    expect(sendMail.mock.calls[0][0].html).not.toContain("<script>");

    sendMail.mockResolvedValue({ rejected: ["a@b.c"] });
    await expect(sendLoginEmail(params())).rejects.toThrow();
  });
});
