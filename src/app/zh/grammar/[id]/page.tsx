import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ZH_GRAMMAR, ZH_GRAMMAR_MAP } from "@/content/zh/grammar";
import { ZhGrammarView } from "@/components/zh/ZhGrammarView";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return ZH_GRAMMAR.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const lesson = ZH_GRAMMAR_MAP[(await params).id];
  return { title: lesson ? lesson.title : "Ngữ pháp" };
}

export default async function ZhGrammarLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const lesson = ZH_GRAMMAR_MAP[(await params).id];
  if (!lesson) notFound();
  return (
    <GuestGate itemKey={`zh-grammar:${lesson.id}`}>
      <ZhGrammarView lesson={lesson} />
    </GuestGate>
  );
}
