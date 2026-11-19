"use client";

/**
 * Bôi đen một từ / cụm trong vùng bài học → hiện nút nổi "Lưu vào Sổ tay" → mở khung điền sẵn
 * (nghĩa + phiên âm nếu từ có trong bộ từ của app, câu chứa từ làm ví dụ).
 */
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { NOTEBOOK_LIMITS, type NewEntry } from "@/core/notebook";
import type { CourseCode } from "@/lib/course";
import { lookupWord, sentenceWith } from "@/lib/notebook-lookup";
import { progressActions } from "@/lib/progress";
import { NotebookEntrySheet } from "./NotebookEntrySheet";

export function SelectionSave({
  course,
  source,
  glossary,
  children,
  className,
}: {
  course: CourseCode;
  source: string;
  /** Từ vựng chú thích của bài — tra trước bộ từ chung của app. */
  glossary?: readonly { word: string; meaning: string }[];
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<NewEntry> | null>(null);

  useEffect(() => {
    const onChange = () => {
      const sel = window.getSelection();
      const text = sel?.toString().replace(/\s+/g, " ").trim() ?? "";
      const inside = !!sel?.anchorNode && !!ref.current?.contains(sel.anchorNode);
      setPicked(inside && text && text.length <= NOTEBOOK_LIMITS.term ? text : null);
    };
    document.addEventListener("selectionchange", onChange);
    return () => document.removeEventListener("selectionchange", onChange);
  }, []);

  function open() {
    if (!picked) return;
    const term = course === "en" ? picked.replace(/^[^\p{L}]+|[^\p{L}']+$/gu, "") : picked.replace(/[\s\p{P}]/gu, "");
    const example = sentenceWith(ref.current?.innerText ?? "", term, course);
    const fromGlossary = glossary?.find((g) => g.word.toLowerCase() === term.toLowerCase());
    setDraft({ term, ...lookupWord(term, course), ...(fromGlossary ? { meaning: fromGlossary.meaning } : {}), ...(example ? { example } : {}), source });
    window.getSelection()?.removeAllRanges();
    setPicked(null);
  }

  return (
    <div ref={ref} className={className}>
      {children}
      {picked && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={open}
          className="btn-primary fixed bottom-24 left-1/2 z-40 -translate-x-1/2 animate-pop-in shadow-lg md:bottom-8"
        >
          <Star className="size-4" /> Lưu vào Sổ tay
        </button>
      )}
      {draft && (
        <NotebookEntrySheet
          course={course}
          title="Lưu vào Sổ tay"
          initial={draft}
          onClose={() => setDraft(null)}
          onSave={(entry) => progressActions.addToNotebook({ ...entry, source })}
        />
      )}
    </div>
  );
}
