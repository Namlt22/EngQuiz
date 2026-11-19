import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DIALOGUES, getDialogue } from "@/content/dialogues";
import { DialoguePlayer } from "@/components/lesson/DialoguePlayer";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return DIALOGUES.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = getDialogue((await params).id);
  return { title: d ? `Hội thoại: ${d.title}` : "Hội thoại" };
}

export default async function DialoguePage({ params }: { params: Promise<{ id: string }> }) {
  const dialogue = getDialogue((await params).id);
  if (!dialogue) notFound();
  return (
    <GuestGate itemKey={`dialogue:${dialogue.id}`}>
      <DialoguePlayer dialogue={dialogue} />
    </GuestGate>
  );
}
