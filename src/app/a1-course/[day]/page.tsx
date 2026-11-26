import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EN_COURSE_DAYS, EN_COURSE_UNITS, getEnCourseDay } from "@/content/en-course";
import { dayGrammar, dayWords } from "@/lib/en-course";
import { DayPlayer } from "@/components/en-course/DayPlayer";

export function generateStaticParams() {
  return EN_COURSE_DAYS.map((d) => ({ day: String(d.day) }));
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
  const d = getEnCourseDay(Number((await params).day));
  return { title: d ? `A1 · Ngày ${d.day}: ${d.title.vi}` : "Khoá A1" };
}

export default async function Page({ params }: { params: Promise<{ day: string }> }) {
  const day = getEnCourseDay(Number((await params).day));
  if (!day) notFound();
  const unit = EN_COURSE_UNITS.find((u) => u.unit === day.unit)!;
  // Ghép sẵn ở server: trình duyệt chỉ nhận 8 từ và vài câu ngữ pháp của ngày này.
  return <DayPlayer day={day} unitTitle={unit.title.vi} totalDays={EN_COURSE_DAYS.length} words={dayWords(day)} grammar={dayGrammar(day)} />;
}
