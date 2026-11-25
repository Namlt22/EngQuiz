"use client";

/**
 * Ngôi sao lưu từ vào Sổ tay của khoá đang học. Rỗng = chưa lưu, đầy = đã lưu (bấm lại để bỏ khỏi sổ).
 * Không có chữ chú thích — trạng thái thể hiện bằng hình ngôi sao.
 */
import { Star } from "lucide-react";
import { findEntry, type NewEntry } from "@/core/notebook";
import { progressActions, useProgress } from "@/lib/progress";

export function SaveWordButton({ entry, className = "" }: { entry: NewEntry; className?: string }) {
  const p = useProgress();
  const saved = findEntry(p.notebook ?? [], entry.term);
  const label = saved ? `Bỏ "${entry.term}" khỏi Sổ tay` : `Lưu "${entry.term}" vào Sổ tay`;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (saved) progressActions.removeNotebookEntry(saved.id);
        else progressActions.addToNotebook(entry);
      }}
      aria-pressed={!!saved}
      aria-label={label}
      title={label}
      className={`grid size-9 shrink-0 place-items-center rounded-full transition hover:bg-surface-2 ${saved ? "text-warning" : "text-muted hover:text-fg"} ${className}`}
    >
      <Star key={saved ? "on" : "off"} className={`size-5 ${saved ? "animate-pop-in fill-current" : ""}`} />
    </button>
  );
}
