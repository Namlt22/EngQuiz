import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ZH_READINGS, ZH_TEXT_MAP } from "@/content/zh/texts";
import { ZhTextView } from "@/components/zh/ZhTextView";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return ZH_READINGS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const t = ZH_TEXT_MAP[(await params).id];
  return { title: t ? `${t.title}` : "Bài đọc" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const t = ZH_TEXT_MAP[(await params).id];
  if (!t || !ZH_READINGS.includes(t)) notFound();
  return (
    <GuestGate itemKey={`zh-reading:${t.id}`}>
      <ZhTextView lesson={t} />
    </GuestGate>
  );
}
