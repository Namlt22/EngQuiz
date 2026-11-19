"use client";

/** Trang Sổ tay (/notebook, /zh/notebook): danh sách từ người học tự lưu, thêm / sửa / xoá, ôn thẻ. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Plus, Search, Star, Trash2, Volume2 } from "lucide-react";
import { activeEntries, buildNotebookQueue, type NotebookEntry } from "@/core/notebook";
import { MASTERED_BOX, dayNumber } from "@/core/srs";
import type { CourseCode } from "@/lib/course";
import { progressActions, useProgress } from "@/lib/progress";
import { useHydrated } from "@/lib/roadmap-store";
import { useSpeech } from "@/lib/speech";
import { CardSession, type Card, type CardMode } from "@/components/vocab/CardSession";
import { NotebookEntrySheet } from "./NotebookEntrySheet";

type Filter = "all" | "due" | "mastered";
const UNDO_MS = 5000;

export const notebookCard = (e: NotebookEntry): Card => ({
  id: `nb:${e.id}`,
  term: e.term,
  meaning: e.meaning,
  reading: e.reading,
  example: e.example,
  grade: (g) => progressActions.reviewNotebookEntry(e.id, g),
});

export function NotebookHome({ course }: { course: CourseCode }) {
  const hydrated = useHydrated();
  const p = useProgress();
  const { speak } = useSpeech({ lang: course });
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState<{ edit?: NotebookEntry } | null>(null);
  const [session, setSession] = useState<{ cards: Card[]; mode: CardMode } | null>(null);
  const [undo, setUndo] = useState<NotebookEntry | null>(null);
  const undoTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  const today = dayNumber();
  const entries = useMemo(() => activeEntries(p.notebook ?? []).slice().reverse(), [p.notebook]);
  const queue = buildNotebookQueue(p.notebook ?? [], today);
  const lang = course === "zh" ? "zh-Hans" : "en";

  if (!hydrated) return <div className="card h-64 animate-pulse" aria-busy="true" />;

  if (session) {
    return (
      <div className="mx-auto max-w-xl">
        <CardSession cards={session.cards} mode={session.mode} course={course} speak={(t) => speak(t, 0.9)} onExit={() => setSession(null)} />
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const shown = entries.filter((e) => {
    if (filter === "due" && !(e.box === 0 || e.due <= today)) return false;
    if (filter === "mastered" && e.box < MASTERED_BOX) return false;
    return !q || e.term.toLowerCase().includes(q) || e.meaning.toLowerCase().includes(q);
  });

  function remove(e: NotebookEntry) {
    progressActions.removeNotebookEntry(e.id);
    setUndo(e);
    window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), UNDO_MS);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">Sổ tay</h1>
        <button type="button" onClick={() => setSheet({})} className="btn-primary px-3" aria-label="Thêm từ">
          <Plus className="size-5" />
        </button>
      </header>

      {queue.length > 0 && (
        <div className="flex gap-2">
          <button type="button" onClick={() => setSession({ cards: queue.map(notebookCard), mode: "meaning" })} className="btn-primary flex-1">
            Ôn {queue.length} thẻ
          </button>
          <button type="button" onClick={() => setSession({ cards: queue.map(notebookCard), mode: "type" })} className="btn-ghost">
            Gõ từ
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <section className="card flex flex-col items-center gap-3 p-10 text-center">
          <Star className="size-10 text-warning" />
          <p className="font-semibold">Chưa có từ</p>
          <button type="button" onClick={() => setSheet({})} className="btn-primary">
            <Plus className="size-4" /> Thêm từ
          </button>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ["all", "Tất cả"],
                ["due", "Đến hạn"],
                ["mastered", "Đã thuộc"],
              ] as const
            ).map(([f, label]) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`chip text-sm ${filter === f ? "bg-primary-soft font-semibold text-primary ring-1 ring-primary/40" : "bg-surface-2 text-muted hover:text-fg"}`}
              >
                {label}
              </button>
            ))}
            <label className="relative ml-auto w-full sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="input py-2 pl-9" aria-label="Tìm trong Sổ tay" />
            </label>
          </div>

          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {shown.map((e) => (
              <li key={e.id} className="flex items-center gap-2 p-3">
                <span
                  className={`size-2 shrink-0 rounded-full ${e.box >= MASTERED_BOX ? "bg-success" : e.box > 0 ? "bg-primary" : "bg-line"}`}
                  aria-label={e.box >= MASTERED_BOX ? "Đã thuộc" : e.box > 0 ? "Đang học" : "Chưa ôn"}
                />
                <button type="button" onClick={() => speak(e.term, 0.9)} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-primary" aria-label={`Nghe ${e.term}`}>
                  <Volume2 className="size-4" />
                </button>
                <span className="min-w-0 flex-1">
                  <span lang={lang} className="font-bold">
                    {e.term}
                  </span>{" "}
                  {e.reading && <span className="text-sm text-muted">{e.reading}</span>}
                  <span className="block truncate text-sm text-muted">{e.meaning}</span>
                </span>
                <button type="button" onClick={() => setSheet({ edit: e })} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg" aria-label={`Sửa ${e.term}`}>
                  <Pencil className="size-4" />
                </button>
                <button type="button" onClick={() => remove(e)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-danger" aria-label={`Xoá ${e.term}`}>
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {undo && (
        <div role="status" className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl bg-fg px-4 py-3 text-sm text-surface shadow-lg md:bottom-6">
          <span className="min-w-0 flex-1 truncate">Đã xoá “{undo.term}”</span>
          <button
            type="button"
            onClick={() => {
              progressActions.restoreNotebookEntry(undo.id);
              setUndo(null);
            }}
            className="font-bold underline"
          >
            Hoàn tác
          </button>
        </div>
      )}

      {sheet && (
        <NotebookEntrySheet
          course={course}
          title={sheet.edit ? "Sửa từ" : "Thêm từ"}
          initial={sheet.edit}
          onClose={() => setSheet(null)}
          onSave={(entry) => {
            if (!sheet.edit) return progressActions.addToNotebook({ ...entry, source: "manual" });
            progressActions.editNotebookEntry(sheet.edit.id, entry);
            return true;
          }}
        />
      )}
    </div>
  );
}
