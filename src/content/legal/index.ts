import { readBusinessInfo, shown, type BusinessInfo } from "@/lib/business";
import { aiDoc } from "./ai";
import { paymentDoc } from "./payment";
import { privacyDoc } from "./privacy";
import { termsDoc } from "./terms";
import type { LegalContext, LegalDoc, LegalSlug } from "./types";

export type { LegalBlock, LegalDoc, LegalSection, LegalSlug } from "./types";

const BUILDERS: Record<LegalSlug, (ctx: LegalContext) => LegalDoc> = {
  terms: termsDoc,
  privacy: privacyDoc,
  ai: aiDoc,
  payment: paymentDoc,
};

/** Thứ tự hiển thị ở mục lục và chân trang. */
export const LEGAL_SLUGS = Object.keys(BUILDERS) as LegalSlug[];

export const isLegalSlug = (v: string): v is LegalSlug => (LEGAL_SLUGS as string[]).includes(v);

/** Thông tin chủ sở hữu đã thay chỗ trống bằng "(đang cập nhật)" — dùng trong văn bản công khai. */
function displayBusiness(info: BusinessInfo): BusinessInfo {
  return { ...info, ...Object.fromEntries(Object.entries(info).map(([k, v]) => [k, k === "noticeUrl" ? v : shown(v)])) };
}

export function getLegalDoc(slug: LegalSlug, info: BusinessInfo = readBusinessInfo()): LegalDoc {
  return BUILDERS[slug]({ business: displayBusiness(info) });
}

export function getLegalDocs(info: BusinessInfo = readBusinessInfo()): LegalDoc[] {
  return LEGAL_SLUGS.map((slug) => getLegalDoc(slug, info));
}

export const legalHref = (slug: LegalSlug) => `/legal/${slug}`;
