import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PINYIN_LESSONS, PINYIN_LESSON_MAP } from "@/content/zh/pinyin-lessons";
import { PinyinLessonView } from "@/components/zh/PinyinLessonView";
import { GuestGate } from "@/components/auth/GuestGate";

export function generateStaticParams() {
  return PINYIN_LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const lesson = PINYIN_LESSON_MAP[(await params).id];
  return { title: lesson ? lesson.title : "Bài pinyin" };
}

export default async function PinyinLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const lesson = PINYIN_LESSON_MAP[(await params).id];
  if (!lesson) notFound();
  return (
    <GuestGate itemKey={`zh-pinyin:${lesson.id}`}>
      <PinyinLessonView lesson={lesson} />
    </GuestGate>
  );
}
