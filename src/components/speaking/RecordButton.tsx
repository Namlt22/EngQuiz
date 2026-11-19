"use client";

import { Mic, Square } from "lucide-react";

/** Nút ghi âm dùng chung: bấm để nói, bấm lần nữa để dừng. */
export function RecordButton({
  listening,
  disabled,
  idleLabel,
  listeningLabel = "Dừng",
  onClick,
}: {
  listening: boolean;
  disabled?: boolean;
  idleLabel: string;
  listeningLabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={listening}
      className={`btn-primary min-w-40 ${listening ? "animate-pulse !bg-danger" : ""}`}
    >
      {listening ? <Square className="size-4" /> : <Mic className="size-4" />}
      {listening ? listeningLabel : idleLabel}
    </button>
  );
}
