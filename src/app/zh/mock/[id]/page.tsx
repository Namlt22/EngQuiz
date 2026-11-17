import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ZH_MOCKS } from "@/content/zh/mock/hsk1";
import { ZhMockTest } from "@/components/zh/ZhMockTest";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return Object.keys(ZH_MOCKS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return { title: ZH_MOCKS[(await params).id]?.title ?? "Thi thử" };
}

export default async function ZhMockPage({ params }: { params: Promise<{ id: string }> }) {
  const test = ZH_MOCKS[(await params).id];
  if (!test) notFound();
  return (
    <GuestGate itemKey={`zh-mock:${test.id}`}>
      <ZhMockTest test={test} />
    </GuestGate>
  );
}
