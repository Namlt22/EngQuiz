import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DICTATIONS, getDictation } from "@/content/dictations";
import { DictationPlayer } from "@/components/dictation/DictationPlayer";

export function generateStaticParams() {
  return DICTATIONS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = getDictation((await params).id);
  return { title: d ? `Nghe chép: ${d.title}` : "Nghe chép" };
}

export default async function DictationPage({ params }: { params: Promise<{ id: string }> }) {
  const exercise = getDictation((await params).id);
  if (!exercise) notFound();
  return <DictationPlayer exercise={exercise} />;
}
