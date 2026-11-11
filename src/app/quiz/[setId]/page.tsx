import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getQuizSet, listQuizSets } from "@/lib/quiz-sets";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";

export function generateStaticParams() {
  return listQuizSets().map((s) => ({ setId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ setId: string }> }): Promise<Metadata> {
  const set = getQuizSet((await params).setId);
  return { title: set ? `Quiz: ${set.title}` : "Quiz" };
}

export default async function QuizSetPage({ params }: { params: Promise<{ setId: string }> }) {
  const set = getQuizSet((await params).setId);
  if (!set || set.items.length === 0) notFound();
  return <QuizPlayer set={set} />;
}
