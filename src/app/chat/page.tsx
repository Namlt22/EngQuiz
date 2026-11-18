import type { Metadata } from "next";
import { AiChat } from "@/components/chat/AiChat";
import { isAiConfigured } from "@/server/anthropic-client";

export const metadata: Metadata = {
  title: "Trò chuyện cùng AI",
  description: "Luyện giao tiếp tiếng Anh với AI: nhập vai theo tình huống hoặc trò chuyện tự do, AI sửa lỗi từng câu bằng tiếng Việt.",
};

export default function ChatPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Trò chuyện cùng AI</h1>
        <p className="mt-1 text-sm text-muted">Gõ hoặc nói · AI sửa lỗi từng câu.</p>
      </header>
      <AiChat course="en" aiEnabled={isAiConfigured()} />
    </div>
  );
}
