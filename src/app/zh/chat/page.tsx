import type { Metadata } from "next";
import { AiChat } from "@/components/chat/AiChat";
import { isAiConfigured } from "@/server/anthropic-client";

export const metadata: Metadata = {
  title: "Trò chuyện cùng AI",
  description: "Luyện giao tiếp tiếng Trung với AI theo cấp HSK: nhập vai hoặc trò chuyện tự do, có pinyin, bản dịch và sửa lỗi.",
};

export default function ZhChatPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Trò chuyện cùng AI</h1>
        <p className="mt-1 text-sm text-muted">Gõ chữ Hán, pinyin hoặc nói · AI sửa lỗi từng câu.</p>
      </header>
      <AiChat course="zh" aiEnabled={isAiConfigured()} />
    </div>
  );
}
