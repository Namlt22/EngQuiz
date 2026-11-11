"use client";

import { Volume2 } from "lucide-react";
import { useSpeech } from "@/lib/speech";

/** Nút loa nhỏ: bấm để nghe câu ví dụ. */
export function SpeakButton({ text, rate = 0.9 }: { text: string; rate?: number }) {
  const { speak, supported, speaking } = useSpeech();
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text, rate)}
      className={`inline-grid size-8 shrink-0 place-items-center rounded-full transition ${
        speaking ? "bg-primary text-primary-fg" : "bg-primary-soft text-primary hover:brightness-95"
      }`}
      aria-label={`Nghe: ${text}`}
      title="Nghe phát âm"
    >
      <Volume2 className="size-4" />
    </button>
  );
}
