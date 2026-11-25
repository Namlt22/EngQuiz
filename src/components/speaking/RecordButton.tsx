"use client";

import { Loader2, Mic, Square } from "lucide-react";

/**
 * Nút ghi âm dùng chung: bấm để nói, bấm lần nữa để dừng.
 * `busy`: đã ghi xong, đang chờ máy chủ nhận dạng / chấm — nút khoá, không còn hiện "Dừng" (bấm cũng không có gì để dừng).
 */
export function RecordButton({
  listening,
  busy = false,
  disabled,
  idleLabel,
  listeningLabel = "Dừng",
  busyLabel = "Đang nhận dạng…",
  onClick,
}: {
  listening: boolean;
  busy?: boolean;
  disabled?: boolean;
  idleLabel: string;
  listeningLabel?: string;
  busyLabel?: string;
  onClick: () => void;
}) {
  const recording = listening && !busy;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      aria-pressed={recording}
      aria-busy={busy}
      className={`btn-primary min-w-40 ${recording ? "animate-pulse !bg-danger" : ""}`}
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : recording ? <Square className="size-4" /> : <Mic className="size-4" />}
      {busy ? busyLabel : recording ? listeningLabel : idleLabel}
    </button>
  );
}
