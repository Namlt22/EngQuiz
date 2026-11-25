"use client";

import { listenLabel } from "@/lib/speech-recognition";

/**
 * Dòng trạng thái dùng chung khi micro đang nghe: "Chuẩn bị… / Đang nghe… / Đang nhận dạng…" kèm lời đang nghe được.
 * `lang`: đặt ngôn ngữ cho phần lời (đọc chữ Hán đúng giọng); bỏ trống thì hiện chữ trơn.
 */
export function ListenStatus({
  recognition,
  lang,
}: {
  recognition: { listening: boolean; ready: boolean; recognizing: boolean; live: string };
  lang?: string;
}) {
  if (!recognition.listening) return null;
  return (
    <p className="text-sm text-muted">
      {listenLabel(recognition)} {lang ? <span lang={lang}>{recognition.live}</span> : recognition.live}
    </p>
  );
}
