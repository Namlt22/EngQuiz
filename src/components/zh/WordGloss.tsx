"use client";

/** Thẻ nghĩa của một từ khi người học chạm vào từ trong bài đọc / hội thoại. */
import { Volume2, X } from "lucide-react";
import type { ZhToken } from "@/core/zh-sentence";
import { POS_LABEL, vocabVi } from "@/content/zh/vocab-vi";

export function WordGloss({ token, onSpeak, onClose }: { token: ZhToken; onSpeak: () => void; onClose: () => void }) {
  const vi = token.kind === "word" ? vocabVi(token.text) : undefined;
  return (
    <div role="dialog" aria-label={`Nghĩa của ${token.text}`} className="card fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md animate-pop-in p-4 md:bottom-6">
      <div className="flex items-start gap-3">
        <span className="text-4xl" lang="zh-Hans">
          {token.text}
        </span>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onSpeak} className="inline-flex items-center gap-1 text-lg font-bold text-primary">
            <Volume2 className="size-4" /> {token.pinyin}
          </button>
          {vi ? (
            <>
              {vi[2] && <div className="text-xs uppercase tracking-wide text-muted">Hán-Việt: {vi[2]}</div>}
              <div>
                <span className="text-xs text-muted">({POS_LABEL[vi[0]]})</span> {vi[1]}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted">{token.kind === "name" ? "Tên riêng" : token.kind === "number" ? "Số" : `Từ HSK ${token.level ?? ""}`}</div>
          )}
        </div>
        <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted hover:text-fg" aria-label="Đóng">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
