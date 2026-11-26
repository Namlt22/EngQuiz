import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EN_VOCAB_TOPICS, getEnTopic } from "@/content/vocab-en";
import { VocabTopicGame } from "@/components/en-games/VocabTopicGame";

export function generateStaticParams() {
  return EN_VOCAB_TOPICS.map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const t = getEnTopic((await params).topic);
  return { title: t ? `Trò chơi: ${t.title}` : "Trò chơi" };
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const topic = getEnTopic((await params).topic);
  if (!topic) notFound();
  return (
    <Suspense fallback={null}>
      <VocabTopicGame topic={topic} />
    </Suspense>
  );
}
