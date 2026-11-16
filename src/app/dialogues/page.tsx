import type { Metadata } from "next";
import { DIALOGUES } from "@/content/dialogues";
import { LessonList } from "@/components/lesson/LessonList";

export const metadata: Metadata = {
  title: "Hội thoại",
  description: "Hội thoại tiếng Anh theo tình huống A1–B1: nghe từng câu, nhập vai nói cùng máy, học mẫu câu và làm bài tập.",
};

export default function DialoguesIndexPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-extrabold md:text-3xl">Hội thoại</h1>
        <p className="mt-2 text-muted">
          Hội thoại theo tình huống thật: gọi món, đặt phòng, đổi lịch họp… Nghe cả bài, rồi <b className="text-fg">nhập vai</b> — máy đọc lời một
          nhân vật, bạn nói lời nhân vật còn lại và được chấm từng từ.
        </p>
      </header>
      <LessonList
        basePath="/dialogues"
        field="dialogues"
        lessons={DIALOGUES.map((d) => ({ id: d.id, title: d.title, level: d.level, tag: d.speakers.join(" & "), description: d.situation }))}
      />
    </div>
  );
}
