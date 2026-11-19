import type { Metadata } from "next";
import Link from "next/link";
import { BusinessCard } from "@/components/legal/BusinessCard";
import { getLegalDocs, legalHref } from "@/content/legal";
import { LEGAL_UPDATED_VI } from "@/lib/legal-policy";

export const metadata: Metadata = {
  title: "Chính sách & điều khoản",
  description: "Thông tin người bán, điều khoản sử dụng, chính sách bảo mật, điều khoản AI, thanh toán và hoàn tiền của EngQuiz.",
};

export default function LegalIndexPage() {
  const docs = getLegalDocs();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold">Chính sách & điều khoản</h1>
        <p className="text-muted">Cập nhật lần cuối: {LEGAL_UPDATED_VI}</p>
      </header>
      <BusinessCard />
      <div className="grid gap-3 sm:grid-cols-2">
        {docs.map((d) => (
          <Link key={d.slug} href={legalHref(d.slug)} className="card block p-5 transition hover:border-primary">
            <div className="font-bold">{d.title}</div>
            <p className="mt-1 text-sm text-muted">{d.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
