"use client";

/**
 * Thanh đầu của mọi màn hình đang làm bài (docs/REDESIGN.md mục 6.3): nút ✕ thoát · thanh tiến độ · "n/N".
 * Thoát bằng link (`exitHref`, về danh sách) hoặc nút (`onExit`, khi thoát cần lưu / đổi trạng thái trước).
 */
import Link from "next/link";
import { X } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

const EXIT_CLASS = "grid size-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg";

export function SessionHeader({
  current,
  total,
  value,
  exitHref,
  onExit,
}: {
  /** Số thứ tự câu / thẻ đang làm (1-based). */
  current: number;
  total: number;
  /** Độ dài thanh tiến độ, 0–100. */
  value: number;
  exitHref?: string;
  onExit?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {exitHref ? (
        <Link href={exitHref} className={EXIT_CLASS} aria-label="Thoát">
          <X className="size-5" />
        </Link>
      ) : (
        <button type="button" onClick={onExit} className={EXIT_CLASS} aria-label="Thoát">
          <X className="size-5" />
        </button>
      )}
      <ProgressBar value={value} label="Tiến độ" />
      <span className="shrink-0 text-sm font-semibold text-muted">
        {Math.min(current, total)}/{total}
      </span>
    </div>
  );
}
