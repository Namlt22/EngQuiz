import { describe, expect, it, vi } from "vitest";
import { LEGAL_VERSION } from "@/lib/legal-policy";
import { createAccountService, TERMS_REQUIRED, type AccountRepo, type AccountUser, type CodePurpose, type StoredCode } from "./account-service";
import { hashPassword, verifyPassword } from "./password";

/** Repo trong bộ nhớ + hộp thư giả: ghi lại mã đã gửi để test nhập lại. */
function setup() {
  let clock = 1_000_000;
  const users = new Map<string, AccountUser>();
  const codes = new Map<string, StoredCode>();
  const sessions: Array<{ userId: string; token: string }> = [];
  const inbox: Array<{ to: string; kind: string; code: string }> = [];
  const key = (e: string, p: CodePurpose) => `${p}:${e}`;
  const repo: AccountRepo = {
    async findUserByEmail(email) {
      return [...users.values()].find((u) => u.email?.toLowerCase() === email) ?? null;
    },
    async createUser(d) {
      const u = { id: `u${users.size + 1}`, email: d.email, name: d.name, emailVerified: null, passwordHash: d.passwordHash, termsAcceptedAt: d.termsAcceptedAt, termsVersion: d.termsVersion };
      users.set(u.id, u);
      return u;
    },
    async updateUser(id, d) {
      const u = { ...(users.get(id) as AccountUser), ...d };
      users.set(id, u);
      return u;
    },
    async saveCode(e, p, codeHash, expiresAt) {
      codes.set(key(e, p), { codeHash, expiresAt, attempts: 0, createdAt: new Date(clock) });
    },
    async getCode(e, p) {
      return codes.get(key(e, p)) ?? null;
    },
    async bumpCodeAttempts(e, p) {
      const c = codes.get(key(e, p));
      if (c) codes.set(key(e, p), { ...c, attempts: c.attempts + 1 });
    },
    async deleteCode(e, p) {
      codes.delete(key(e, p));
    },
    async createSession(userId, token) {
      sessions.push({ userId, token });
    },
    async deleteSessions(userId) {
      for (let i = sessions.length - 1; i >= 0; i--) if (sessions[i].userId === userId) sessions.splice(i, 1);
    },
  };
  const mail = vi.fn(async (to: string, kind: string, code: string) => {
    inbox.push({ to, kind, code });
  });
  const svc = createAccountService({ repo, mail, secret: "s".repeat(40), now: () => clock });
  const lastCode = () => inbox[inbox.length - 1]?.code ?? "";
  const tick = (ms: number) => {
    clock += ms;
  };
  return { svc, users, sessions, inbox, lastCode, tick };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("đồng ý điều khoản khi đăng ký", () => {
  it("không tick đồng ý → 400, không tạo tài khoản, không gửi mail", async () => {
    const { svc, users, inbox } = setup();
    for (const acceptTerms of [undefined, false, "true", 1]) {
      const r = await svc.run("register", { email: "k@mail.com", password: "matkhau123", acceptTerms });
      expect(r).toMatchObject({ status: 400, error: TERMS_REQUIRED });
    }
    await flush();
    expect(users.size).toBe(0);
    expect(inbox).toHaveLength(0);
  });

  it("lưu thời điểm và phiên bản điều khoản đã đồng ý", async () => {
    const { svc, users } = setup();
    await svc.run("register", { acceptTerms: true, email: "l@mail.com", password: "matkhau123" });
    expect([...users.values()][0]).toMatchObject({ termsAcceptedAt: new Date(1_000_000), termsVersion: LEGAL_VERSION });
  });
});

describe("đăng ký → xác thực email → đăng nhập", () => {
  it("tạo tài khoản chưa xác thực, gửi mã; nhập đúng mã + mật khẩu → đăng nhập", async () => {
    const { svc, users, sessions, lastCode } = setup();
    const r = await svc.run("register", { acceptTerms: true, email: " An@Mail.com ", password: "matkhau123", name: "An" });
    expect(r).toMatchObject({ status: 202, data: { email: "an@mail.com" } });
    await flush();
    expect([...users.values()][0]).toMatchObject({ email: "an@mail.com", name: "An", emailVerified: null });

    expect((await svc.run("login", { email: "an@mail.com", password: "matkhau123" })).status).toBe(403);

    const ok = await svc.run("verify-email", { email: "an@mail.com", password: "matkhau123", code: lastCode() });
    expect(ok.status).toBe(200);
    expect(ok.session?.token).toBeTruthy();
    expect(sessions).toHaveLength(1);

    const again = await svc.run("login", { email: "AN@mail.com", password: "matkhau123" });
    expect(again.status).toBe(200);
  });

  it("mã sai 5 lần thì khoá mã đó, mã dùng một lần", async () => {
    const { svc, lastCode } = setup();
    await svc.run("register", { acceptTerms: true, email: "b@mail.com", password: "matkhau123" });
    await flush();
    const code = lastCode();
    const wrong = code === "000000" ? "111111" : "000000";
    for (let i = 0; i < 5; i++) expect((await svc.run("verify-email", { email: "b@mail.com", password: "matkhau123", code: wrong })).status).toBe(400);
    expect((await svc.run("verify-email", { email: "b@mail.com", password: "matkhau123", code })).status).toBe(400);
  });

  it("mã hết hạn sau 15 phút", async () => {
    const { svc, lastCode, tick } = setup();
    await svc.run("register", { acceptTerms: true, email: "c@mail.com", password: "matkhau123" });
    await flush();
    tick(15 * 60_000 + 1);
    expect((await svc.run("verify-email", { email: "c@mail.com", password: "matkhau123", code: lastCode() })).status).toBe(400);
  });

  it("email đã có tài khoản: trả lời giống hệt nhưng gửi email \"exists\", không đổi mật khẩu cũ", async () => {
    const { svc, users, inbox } = setup();
    users.set("u9", { id: "u9", email: "d@mail.com", name: "D", emailVerified: new Date(1), passwordHash: await hashPassword("cumatkhau1") });
    const r = await svc.run("register", { acceptTerms: true, email: "d@mail.com", password: "matkhaumoi1" });
    expect(r).toMatchObject({ status: 202, data: { email: "d@mail.com" } });
    await flush();
    expect(inbox.at(-1)).toMatchObject({ kind: "exists", code: "" });
    expect(await verifyPassword("cumatkhau1", users.get("u9")?.passwordHash)).toBe(true);
  });

  it("kiểm tra dữ liệu: email sai, mật khẩu ngắn, mật khẩu trùng email", async () => {
    const { svc } = setup();
    expect((await svc.run("register", { acceptTerms: true, email: "x", password: "matkhau123" })).status).toBe(400);
    expect((await svc.run("register", { acceptTerms: true, email: "e@mail.com", password: "ngan" })).status).toBe(400);
    expect((await svc.run("register", { acceptTerms: true, email: "e@mail.com", password: "E@mail.com" })).status).toBe(400);
  });

  it("gửi lại mã phải chờ 60 giây", async () => {
    const { svc, inbox, tick } = setup();
    await svc.run("register", { acceptTerms: true, email: "f@mail.com", password: "matkhau123" });
    await svc.run("resend-code", { email: "f@mail.com" });
    await flush();
    expect(inbox).toHaveLength(1);
    tick(61_000);
    await svc.run("resend-code", { email: "f@mail.com" });
    await flush();
    expect(inbox).toHaveLength(2);
  });
});

describe("đăng nhập", () => {
  it("sai mật khẩu hoặc email không tồn tại → cùng một thông báo; quá 10 lần → 429", async () => {
    const { svc, users } = setup();
    users.set("u1", { id: "u1", email: "g@mail.com", name: null, emailVerified: new Date(1), passwordHash: await hashPassword("dungmatkhau") });
    const a = await svc.run("login", { email: "g@mail.com", password: "saimatkhau" });
    const b = await svc.run("login", { email: "khong@mail.com", password: "saimatkhau" });
    expect([a.status, b.status]).toEqual([401, 401]);
    expect(a.error).toBe(b.error);
    for (let i = 0; i < 9; i++) await svc.run("login", { email: "g@mail.com", password: "saimatkhau" });
    expect((await svc.run("login", { email: "g@mail.com", password: "dungmatkhau" })).status).toBe(429);
  });
});

describe("quên mật khẩu", () => {
  it("đặt mật khẩu mới bằng mã, đăng xuất phiên cũ; tài khoản Google (chưa có mật khẩu) cũng đặt được", async () => {
    const { svc, users, sessions, lastCode } = setup();
    users.set("u1", { id: "u1", email: "h@mail.com", name: null, emailVerified: new Date(1), passwordHash: null });
    sessions.push({ userId: "u1", token: "cu" });
    expect((await svc.run("forgot-password", { email: "h@mail.com" })).status).toBe(202);
    await flush();
    const r = await svc.run("reset-password", { email: "h@mail.com", code: lastCode(), password: "matkhaumoi1" });
    expect(r.status).toBe(200);
    expect(sessions.map((s) => s.token)).not.toContain("cu");
    expect((await svc.run("login", { email: "h@mail.com", password: "matkhaumoi1" })).status).toBe(200);
  });

  it("email không có tài khoản: vẫn trả 202, không gửi gì", async () => {
    const { svc, inbox } = setup();
    expect((await svc.run("forgot-password", { email: "khong@mail.com" })).status).toBe(202);
    await flush();
    expect(inbox).toHaveLength(0);
  });
});

it("chức năng không tồn tại → 404; AUTH_SECRET ngắn → lỗi khởi tạo", async () => {
  const { svc } = setup();
  expect((await svc.run("xoa-het", {})).status).toBe(404);
  expect(() => createAccountService({ repo: {} as AccountRepo, mail: async () => {}, secret: "ngan" })).toThrow();
});
