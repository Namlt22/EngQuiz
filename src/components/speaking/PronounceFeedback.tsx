"use client";

/** Âm sai trong một lượt đọc (chấm tới từng âm): từ · âm đúng → âm nghe được. Không có âm sai thì không hiện gì. */
import type { PronounceResult } from "@/lib/pronounce";
import { confidentErrors } from "@/lib/pronounce";

export function PronounceFeedback({ result, onSpeakWord }: { result: PronounceResult; onSpeakWord?: (word: string) => void }) {
  const errors = confidentErrors(result);
  if (!errors.length) return null;
  return (
    <ul className="space-y-1.5 text-sm" aria-label="Âm cần sửa">
      {errors.map((e, k) => {
        const wrong = e.phones.filter((p) => (p.confidence ?? 1) >= 0.5 && p.expected !== p.heard);
        return (
          <li key={k} className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-warning-soft px-3 py-2">
            {e.word && (
              <button type="button" onClick={() => onSpeakWord?.(e.word!)} lang="en" className="font-semibold underline decoration-dotted underline-offset-4">
                {e.word}
              </button>
            )}
            {wrong.length ? (
              wrong.map((p, j) => (
                <span key={j} className="font-ipa">
                  <b className="text-success">/{p.expected || "∅"}/</b>
                  <span className="text-muted"> ← </span>
                  <span className="text-danger">/{p.heard || "∅"}/</span>
                </span>
              ))
            ) : (
              <span className="font-ipa">
                <b className="text-success">/{e.expected}/</b>
                <span className="text-muted"> ← </span>
                <span className="text-danger">/{e.heard || "∅"}/</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
