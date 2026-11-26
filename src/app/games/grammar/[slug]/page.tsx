import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicMeta } from "@/content/catalog";
import { TOPIC_CONTENT } from "@/content/topics";
import { availableGrammarModes } from "@/core/en-grammar-games";
import { GrammarGame } from "@/components/en-games/GrammarGame";

export function generateStaticParams() {
  return Object.keys(TOPIC_CONTENT)
    .filter((slug) => availableGrammarModes(TOPIC_CONTENT[slug].questions).length)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const meta = getTopicMeta((await params).slug);
  return { title: meta ? `Trò chơi: ${meta.title}` : "Trò chơi" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getTopicMeta(slug);
  const content = TOPIC_CONTENT[slug];
  if (!meta || !content) notFound();
  return (
    <Suspense fallback={null}>
      <GrammarGame slug={slug} title={meta.title} titleEn={meta.titleEn} level={meta.level} questions={content.questions} />
    </Suspense>
  );
}
