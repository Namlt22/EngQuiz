import type { Metadata } from "next";
import { READINGS } from "@/content/readings";
import { LessonList } from "@/components/lesson/LessonList";

export const metadata: Metadata = {
  title: "Đọc hiểu (Reading)",
  description: "Bài đọc tiếng Anh A1–C1 theo chủ đề, có bản dịch, từ vựng, âm thanh và câu hỏi đọc hiểu tự chấm.",
};

export default function ReadingIndexPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-extrabold md:text-3xl">Đọc hiểu</h1>
      </header>
      <LessonList
        basePath="/reading"
        field="reading"
        lessons={READINGS.map((r) => ({ id: r.id, title: r.title, level: r.level, tag: r.theme, description: r.description }))}
      />
    </div>
  );
}
