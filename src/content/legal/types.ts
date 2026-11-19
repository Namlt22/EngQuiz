import type { BusinessInfo } from "@/lib/business";

/** Một khối nội dung: đoạn văn, hoặc danh sách gạch đầu dòng. */
export type LegalBlock = string | { list: readonly string[] };

export interface LegalSection {
  heading: string;
  blocks: readonly LegalBlock[];
}

export type LegalSlug = "terms" | "privacy" | "ai" | "payment";

export interface LegalDoc {
  slug: LegalSlug;
  title: string;
  /** Một câu tóm tắt — dùng cho thẻ meta và trang mục lục */
  summary: string;
  sections: readonly LegalSection[];
}

/** Dữ liệu các văn bản cần: thông tin chủ sở hữu (đã thay chỗ trống bằng "(đang cập nhật)"). */
export interface LegalContext {
  business: BusinessInfo;
}
