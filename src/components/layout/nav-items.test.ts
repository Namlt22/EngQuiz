import { describe, expect, it } from "vitest";
import { NAV_EN, NAV_ZH, isSessionRoute } from "./nav-items";

describe("màn hình đang làm bài (ẩn thanh tab dưới)", () => {
  it("nhận các trang làm bài của cả hai khoá", () => {
    for (const p of ["/quiz/topic-be", "/dictation/story-my-family", "/zh/dictation/d1-greeting", "/zh/mock/hsk1", "/review", "/zh/review", "/sentences/en-yes-no", "/zh/sentences/zh-ma"]) {
      expect(isSessionRoute(p), p).toBe(true);
    }
  });

  it("không ẩn ở trang danh sách hay trang chủ", () => {
    for (const p of ["/", "/zh", "/quiz", "/dictation", "/zh/dictation", "/zh/mock", "/reading/my-family", "/reviews", "/sentences"]) {
      expect(isSessionRoute(p), p).toBe(false);
    }
  });
});

describe("menu", () => {
  it("cả hai khoá cùng khung Hôm nay · Lộ trình · Học · Luyện · Sổ tay", () => {
    for (const nav of [NAV_EN, NAV_ZH]) expect(nav.map((e) => e.label)).toEqual(["Hôm nay", "Lộ trình", "Học", "Luyện", "Sổ tay"]);
  });

  it("không còn Cấp độ / Lý thuyết; thi thử HSK là một mục", () => {
    const hrefs = [...NAV_EN, ...NAV_ZH].flatMap((e) => (e.kind === "link" ? [e.href] : e.items.map((i) => i.href)));
    expect(hrefs).not.toContain("/levels");
    expect(hrefs.filter((h) => h.startsWith("/zh/mock"))).toEqual(["/zh/mock"]);
  });
});
