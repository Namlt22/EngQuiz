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
    expect(clientIp(req({ "cf-connecting-ip": "5.6.7.8", "x-forwarded-for": "1.2.3.4" }))).toBe("5.6.7.8");
  });
});

describe("sendAccountMail", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("nodemailer");
  });

  it("production mà thiếu EMAIL_SERVER → báo lỗi, không in mã ra log", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("EMAIL_SERVER", "");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendAccountMail } = await import("./account-email");
    await expect(sendAccountMail("a@b.c", "verify", "123456")).rejects.toThrow(/EMAIL_SERVER/);
    expect(info).not.toHaveBeenCalled();
  });

  it("dev mà thiếu EMAIL_SERVER → in mã ra terminal", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EMAIL_SERVER", "");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendAccountMail } = await import("./account-email");
    await sendAccountMail("a@b.c", "verify", "123456");
    expect(info).toHaveBeenCalledWith(expect.stringContaining("123456"));
  });

  it("có EMAIL_SERVER → gửi qua SMTP kèm mã trong tiêu đề; báo lỗi khi bị từ chối; email \"exists\" không có mã", async () => {
    vi.stubEnv("EMAIL_SERVER", "smtp://u:p@localhost:2525");
    vi.stubEnv("AUTH_URL", "https://eng.example.com");
    const sendMail = vi.fn().mockResolvedValue({ rejected: [] });
    vi.doMock("nodemailer", () => ({ createTransport: () => ({ sendMail }) }));
    const { sendAccountMail } = await import("./account-email");
    await sendAccountMail("a@b.c", "reset", "654321");
    expect(sendMail.mock.calls[0][0].subject).toContain("654321");
    expect(sendMail.mock.calls[0][0].to).toBe("a@b.c");

    await sendAccountMail("a@b.c", "exists", "");
    expect(sendMail.mock.calls[1][0].html).toContain("https://eng.example.com/signin");

    sendMail.mockResolvedValue({ rejected: ["a@b.c"] });
    await expect(sendAccountMail("a@b.c", "verify", "111111")).rejects.toThrow();
  });
});
