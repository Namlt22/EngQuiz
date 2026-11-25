import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IPA_MAP, IPA_SOUNDS } from "@/content/ipa";
import { SoundLesson } from "@/components/ipa/SoundLesson";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return IPA_SOUNDS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const s = IPA_MAP[(await params).id];
  return { title: s ? `Bài phát âm /${s.symbol}/` : "Bài phát âm" };
}

export default async function SoundLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const sound = IPA_MAP[(await params).id];
  if (!sound) notFound();
  return (
    <GuestGate itemKey={`ipa:${sound.id}`}>
      <SoundLesson sound={sound} />
    </GuestGate>
  );
}
