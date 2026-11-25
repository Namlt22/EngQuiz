import { describe, expect, it } from "vitest";
import { isBlockedShortcut } from "./DevtoolsGuard";

const key = (k: string, mods: Partial<Record<"ctrlKey" | "metaKey" | "shiftKey" | "altKey", boolean>> = {}) => ({
  key: k,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
  ...mods,
});

describe("isBlockedShortcut", () => {
  it("chặn F12 và các tổ hợp mở DevTools / xem nguồn / lưu trang", () => {
    expect(isBlockedShortcut(key("F12"))).toBe(true);
    for (const k of ["I", "J", "C", "K"]) expect(isBlockedShortcut(key(k, { ctrlKey: true, shiftKey: true })), k).toBe(true);
    expect(isBlockedShortcut(key("i", { metaKey: true, altKey: true }))).toBe(true);
    expect(isBlockedShortcut(key("u", { ctrlKey: true }))).toBe(true);
    expect(isBlockedShortcut(key("s", { metaKey: true }))).toBe(true);
  });

  it("không chặn phím thường, sao chép / dán / hoàn tác", () => {
    for (const k of ["a", "Enter", "F5", "i"]) expect(isBlockedShortcut(key(k)), k).toBe(false);
    for (const k of ["c", "v", "x", "z", "a"]) expect(isBlockedShortcut(key(k, { ctrlKey: true })), k).toBe(false);
  });
});
