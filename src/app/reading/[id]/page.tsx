import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getReading, READINGS } from "@/content/readings";
import { ReadingView } from "@/components/lesson/ReadingView";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return READINGS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const r = getReading((await params).id);
  return { title: r ? `Đọc hiểu: ${r.title}` : "Đọc hiểu" };
}

export default async function ReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const passage = getReading((await params).id);
  if (!passage) notFound();
  return (
    <GuestGate itemKey={`reading:${passage.id}`}>
      <ReadingView passage={passage} />
    </GuestGate>
  );
}
