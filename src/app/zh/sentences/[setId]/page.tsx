import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSentenceSet, sentenceSetsFor } from "@/content/sentence-practice";
import { SentencePlayer } from "@/components/sentences/SentencePlayer";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return sentenceSetsFor("zh").map((s) => ({ setId: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ setId: string }> }): Promise<Metadata> {
  const s = getSentenceSet((await params).setId);
  return { title: s ? `Đặt câu: ${s.title}` : "Đặt câu" };
}

export default async function Page({ params }: { params: Promise<{ setId: string }> }) {
  const set = getSentenceSet((await params).setId);
  if (!set || set.course !== "zh") notFound();
  return (
    <GuestGate itemKey={`sentences:${set.id}`}>
      <SentencePlayer key={set.id} set={set} listHref="/zh/sentences" />
    </GuestGate>
  );
}
