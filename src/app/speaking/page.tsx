import type { Metadata } from "next";
import { SpeakingApp, type SpeakingTab } from "@/components/speaking/SpeakingApp";
import { isSpeakingAiConfigured } from "@/server/speaking-ai";

export const metadata: Metadata = {
  title: "Luyện nói",
  description: "Luyện nói tiếng Anh: đọc theo câu mẫu được chấm từng từ, nói tự do theo đề và được AI chấm điểm, sửa lỗi.",
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function SpeakingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const tab: SpeakingTab = first(params.tab) === "talk" || first(params.prompt) ? "talk" : "read";

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-extrabold md:text-3xl">Luyện nói</h1>
        <p className="mt-2 text-muted">
          <b className="text-fg">Đọc theo câu mẫu</b>: nghe câu, đọc to, máy chấm từng từ nghe được. <b className="text-fg">Nói tự do</b>: trả lời
          câu hỏi của lộ trình, AI chấm ngữ pháp, từ vựng, độ trôi chảy và sửa từng lỗi kèm giải thích tiếng Việt.
        </p>
      </header>
      <SpeakingApp
        initialTab={tab}
        initialSetId={first(params.set)}
        initialPromptId={first(params.prompt)}
        aiEnabled={isSpeakingAiConfigured()}
      />
    </div>
  );
}
