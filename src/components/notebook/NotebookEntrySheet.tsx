"use client";

/**
 * Khung thêm / sửa một mục Sổ tay (bottom sheet trên điện thoại, hộp giữa màn hình trên máy tính).
 * Bắt buộc: Từ và Nghĩa. Mở với dữ liệu điền sẵn khi lưu từ bài đọc / chọn văn bản.
 */
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { NOTEBOOK_LIMITS, type NewEntry } from "@/core/notebook";
import type { CourseCode } from "@/lib/course";

export function NotebookEntrySheet({
  course,
  initial,
  title,
  onSave,
  onClose,
}: {
  course: CourseCode;
  initial?: Partial<NewEntry>;
  title: string;
  /** Trả về false nếu không lưu được (trùng từ / sổ đầy) để giữ khung mở. */
  onSave: (entry: NewEntry) => boolean;
  onClose: () => void;
}) {
  const [term, setTerm] = useState(initial?.term ?? "");
  const [meaning, setMeaning] = useState(initial?.meaning ?? "");
  const [reading, setReading] = useState(initial?.reading ?? "");
  const [example, setExample] = useState(initial?.example ?? "");
  const [failed, setFailed] = useState(false);
  const termRef = useRef<HTMLInputElement>(null);
  const meaningRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (initial?.term ? meaningRef : termRef).current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [initial?.term, onClose]);

  const lang = course === "zh" ? "zh-Hans" : "en";
  const canSave = term.trim() && meaning.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center" onClick={onClose} role="presentation">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSave) return;
          const ok = onSave({ term, meaning, reading, example, source: initial?.source });
          if (ok) onClose();
          else setFailed(true);
        }}
        className="card w-full max-w-md animate-pop-in space-y-3 rounded-b-none p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:rounded-b-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Đóng">
            <X className="size-5" />
          </button>
        </div>
        <Field label={course === "zh" ? "Từ (chữ Hán)" : "Từ"}>
          <input ref={termRef} value={term} onChange={(e) => setTerm(e.target.value)} maxLength={NOTEBOOK_LIMITS.term} lang={lang} className="input" required />
        </Field>
        <Field label="Nghĩa">
          <input ref={meaningRef} value={meaning} onChange={(e) => setMeaning(e.target.value)} maxLength={NOTEBOOK_LIMITS.meaning} className="input" required />
        </Field>
        <Field label={course === "zh" ? "Pinyin" : "Phiên âm"}>
          <input value={reading} onChange={(e) => setReading(e.target.value)} maxLength={NOTEBOOK_LIMITS.reading} className="input" />
        </Field>
        <Field label="Ví dụ">
          <textarea value={example} onChange={(e) => setExample(e.target.value)} maxLength={NOTEBOOK_LIMITS.example} lang={lang} rows={2} className="input resize-none" />
        </Field>
        {failed && <p className="text-sm text-danger">Từ này đã có trong Sổ tay hoặc sổ đã đầy.</p>}
        <button type="submit" disabled={!canSave} className="btn-primary w-full">
          Lưu
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
