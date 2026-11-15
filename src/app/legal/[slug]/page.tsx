import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocView } from "@/components/legal/LegalDocView";
import { getLegalDoc, isLegalSlug, LEGAL_SLUGS } from "@/content/legal";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};
  const doc = getLegalDoc(slug);
  return { title: doc.title, description: doc.summary };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  return <LegalDocView doc={getLegalDoc(slug)} />;
}
