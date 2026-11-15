import { expect, it } from "vitest";
import { accountBlockReason } from "./account-access";

it("tài khoản bị khoá hoặc quá hạn thì bị chặn; còn hạn / không đặt hạn thì được vào", () => {
  const now = new Date("2026-11-16T00:00:00Z");
  expect(accountBlockReason({ disabled: true }, now)).toMatch(/khoá/);
  expect(accountBlockReason({ accessUntil: new Date("2026-11-15T23:59:59Z") }, now)).toMatch(/hết thời hạn/);
  expect(accountBlockReason({ accessUntil: new Date("2026-12-01T00:00:00Z") }, now)).toBe("");
  expect(accountBlockReason({ disabled: false, accessUntil: null }, now)).toBe("");
  expect(accountBlockReason(null, now)).toBe("");
});
