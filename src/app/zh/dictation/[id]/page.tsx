import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ZH_TEXTS, ZH_TEXT_MAP } from "@/content/zh/texts";
import { ZhDictationView } from "@/components/zh/ZhDictationView";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return ZH_TEXTS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const t = ZH_TEXT_MAP[(await params).id];
  return { title: t ? `Nghe chép: ${t.title}` : "Nghe chép" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const t = ZH_TEXT_MAP[(await params).id];
  if (!t || !ZH_TEXTS.includes(t)) notFound();
  return (
    <GuestGate itemKey={`zh-dictation:${t.id}`}>
      <ZhDictationView lesson={t} />
    </GuestGate>
  );
}
