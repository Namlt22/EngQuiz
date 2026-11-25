"use client";

/** Trang Trò chuyện cùng AI: chọn tình huống / trò chuyện tự do → vào cuộc. Dùng chung cho tiếng Anh và tiếng Trung. */
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogIn } from "lucide-react";
import type { CourseCode } from "@/lib/course";
import { ChatPicker, type ChatChoice } from "./ChatPicker";
import { ChatRoom } from "./ChatRoom";

export function AiChat({ course, aiEnabled }: { course: CourseCode; aiEnabled: boolean }) {
  const [choice, setChoice] = useState<ChatChoice | null>(null);
  const { status } = useSession();
  const here = course === "zh" ? "/zh/chat" : "/chat";

  if (!aiEnabled) {
    return (
      <p className="rounded-xl bg-warning-soft p-3 text-sm">
        AI chưa được bật trên server: cần đặt <code>ENGQUIZ_ANTHROPIC_API_KEY</code> trong file <code>.env</code> rồi khởi động lại.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {status === "unauthenticated" && (
        <Link href={`/signin?callbackUrl=${encodeURIComponent(here)}`} className="card flex items-center gap-3 p-4 transition hover:shadow-md">
          <LogIn className="size-5 text-primary" />
          <span className="flex-1 text-sm">
            <b>Đăng nhập để trò chuyện cùng AI.</b>
          </span>
        </Link>
      )}
      {choice ? (
        <ChatRoom key={`${choice.scenario?.id ?? "free"}-${choice.level}`} course={course} choice={choice} onExit={() => setChoice(null)} />
      ) : (
        <>
          <ChatPicker course={course} onPick={setChoice} />
        </>
      )}
    </div>
  );
}
