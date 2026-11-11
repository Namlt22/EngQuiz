import type { Metadata } from "next";
import { listQuizSets } from "@/lib/quiz-sets";
import { QuizSetList } from "@/components/quiz/QuizSetList";

export const metadata: Metadata = { title: "Quiz ngữ pháp" };

export default function QuizIndexPage() {
  const sets = listQuizSets().map(({ items, ...rest }) => ({
    ...rest,
    count: items.length,
    topicSlug: rest.kind === "topic" ? items[0]?.topicSlug : undefined,
  }));
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Quiz ngữ pháp</h1>
        <p className="mt-1 text-muted">
          7 dạng bài: trắc nghiệm, chia động từ, điền từ, tìm lỗi sai, viết lại câu, sắp xếp từ, nối. Có giải thích ngay sau mỗi câu.
        </p>
      </header>
      <QuizSetList sets={sets} />
    </div>
  );
}
