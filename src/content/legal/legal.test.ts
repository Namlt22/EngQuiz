import { describe, expect, it } from "vitest";
import { MISSING_VALUE, missingBusinessFields, readBusinessInfo, safeNoticeUrl } from "@/lib/business";
import { REFUND_MAX_AI_TURNS, REFUND_WINDOW_DAYS } from "@/lib/legal-policy";
import { AI_DAILY_LIMIT, formatVnd, PLANS } from "@/lib/plans";
import { getLegalDoc, getLegalDocs, isLegalSlug, LEGAL_SLUGS, type LegalDoc } from ".";

const FULL_ENV = {
  ENGQUIZ_BUSINESS_NAME: "Nguyễn Văn A",
  ENGQUIZ_BUSINESS_TAX_CODE: "001090000000",
  ENGQUIZ_BUSINESS_ADDRESS: "1 Đường A, Phường B, TP. Hà Nội",
  ENGQUIZ_BUSINESS_EMAIL: "hotro@example.com",
  ENGQUIZ_BUSINESS_PHONE: "0900000000",
};

/** Toàn bộ chữ của một văn bản, nối lại để tìm kiếm. */
const textOf = (doc: LegalDoc) =>
  [doc.title, doc.summary, ...doc.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap((b) => (typeof b === "string" ? [b] : b.list))])].join("\n");

describe("thông tin chủ sở hữu", () => {
  it("đọc và cắt khoảng trắng các biến ENGQUIZ_BUSINESS_*", () => {
    const info = readBusinessInfo({ ...FULL_ENV, ENGQUIZ_BUSINESS_NAME: "  Trần Thị B  " });
    expect(info.name).toBe("Trần Thị B");
    expect(info.noticeUrl).toBe("");
  });

  it("liệt kê biến bắt buộc còn thiếu, không tính link thông báo", () => {
    expect(missingBusinessFields(readBusinessInfo(FULL_ENV))).toEqual([]);
    expect(missingBusinessFields(readBusinessInfo({ ...FULL_ENV, ENGQUIZ_BUSINESS_TAX_CODE: " " }))).toEqual(["ENGQUIZ_BUSINESS_TAX_CODE"]);
  });

  it("chỉ nhận link https của online.gov.vn", () => {
    expect(safeNoticeUrl("https://online.gov.vn/Home/WebDetails/123")).toBe("https://online.gov.vn/Home/WebDetails/123");
    expect(safeNoticeUrl("http://online.gov.vn/x")).toBeNull();
    expect(safeNoticeUrl("https://online.gov.vn.evil.com/x")).toBeNull();
    expect(safeNoticeUrl("javascript:alert(1)")).toBeNull();
    expect(safeNoticeUrl("")).toBeNull();
  });
});

describe("văn bản pháp lý", () => {
  const full = readBusinessInfo(FULL_ENV);

  it("có đủ 4 văn bản, slug hợp lệ", () => {
    expect(LEGAL_SLUGS).toEqual(["terms", "privacy", "ai", "payment"]);
    expect(isLegalSlug("privacy")).toBe(true);
    expect(isLegalSlug("../etc")).toBe(false);
  });

  it("không văn bản nào chứa undefined / null / mục trống", () => {
    for (const doc of getLegalDocs(full)) {
      const text = textOf(doc);
      expect(text).not.toMatch(/undefined|null|NaN|\[object/);
      expect(doc.sections.length).toBeGreaterThan(0);
      for (const s of doc.sections) expect(s.blocks.length).toBeGreaterThan(0);
    }
  });

  it("điền thông tin người bán vào điều khoản và chính sách bảo mật", () => {
    for (const slug of ["terms", "privacy"] as const) {
      const text = textOf(getLegalDoc(slug, full));
      expect(text).toContain(FULL_ENV.ENGQUIZ_BUSINESS_NAME);
      expect(text).toContain(FULL_ENV.ENGQUIZ_BUSINESS_TAX_CODE);
      expect(text).toContain(FULL_ENV.ENGQUIZ_BUSINESS_EMAIL);
    }
  });

  it("thiếu thông tin thì hiện '(đang cập nhật)', không lộ tên biến môi trường", () => {
    const text = getLegalDocs(readBusinessInfo({})).map(textOf).join("\n");
    expect(text).toContain(MISSING_VALUE);
    expect(text).not.toContain("ENGQUIZ_");
  });

  it("bảng giá, giới hạn lượt và điều kiện hoàn tiền khớp với code", () => {
    const text = textOf(getLegalDoc("payment", full));
    for (const p of PLANS) expect(text).toContain(formatVnd(p.price));
    expect(text).toContain(`${AI_DAILY_LIMIT} lượt`);
    expect(text).toContain(`${REFUND_WINDOW_DAYS} ngày`);
    expect(text).toContain(`${REFUND_MAX_AI_TURNS} lượt AI`);
    expect(text).toMatch(/KHÔNG tự động gia hạn/);
  });

  it("điều khoản AI nói rõ người dùng đang dùng AI và dữ liệu đi ra nước ngoài", () => {
    const text = textOf(getLegalDoc("ai", full));
    expect(text).toMatch(/trí tuệ nhân tạo/);
    expect(text).toContain("Do AI tạo");
    expect(text).toMatch(/Hoa Kỳ/);
  });
});
