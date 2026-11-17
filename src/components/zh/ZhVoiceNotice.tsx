"use client";

/**
 * Giọng đọc tiếng Trung trên máy người học:
 *  - không có giọng nào → hướng dẫn cài (giọng máy sẽ im lặng hoặc đọc sai);
 *  - chỉ đang dùng giọng online → báo vì sao bấm nghe bị chậm, gợi ý cài giọng offline;
 *  - có nhiều giọng → cho chọn (lựa chọn được nhớ, dùng cho mọi trang tiếng Trung).
 * Chờ một chút trước khi báo "không có giọng" vì trình duyệt nạp danh sách giọng không đồng bộ.
 */
import { useEffect, useState } from "react";
import { AlertTriangle, Volume2, Wifi } from "lucide-react";
import type { useSpeech } from "@/lib/speech";

type Speech = ReturnType<typeof useSpeech>;

const INSTALL_TIPS = [
  "Windows: Cài đặt → Thời gian & ngôn ngữ → Giọng nói → Thêm giọng → Chinese (Simplified, China).",
  "Android: Cài đặt → Chuyển văn bản thành giọng nói → tải dữ liệu tiếng Trung.",
  "iPhone / iPad: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Trung.",
];

export function ZhVoiceNotice({ speech }: { speech: Speech }) {
  const [waited, setWaited] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setWaited(true), 1500);
    return () => window.clearTimeout(t);
  }, []);
  if (!waited) return null;

  if (!speech.supported || speech.voiceOptions.length === 0) {
    return (
      <div role="alert" className="flex gap-2 rounded-2xl border border-warning/30 bg-warning-soft p-3 text-sm leading-relaxed">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <div>
          <b>Máy chưa có giọng đọc tiếng Trung</b>, nên âm mẫu có thể không phát được.
          <ul className="mt-1 list-disc pl-4 text-muted">
            {INSTALL_TIPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li>Hoặc dùng Chrome / Edge mới nhất (có sẵn giọng tiếng Trung trực tuyến).</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {speech.voiceOptions.length > 1 && (
        <label className="flex items-center gap-1.5">
          <Volume2 className="size-4 text-muted" />
          <span className="sr-only">Giọng đọc</span>
          <select value={speech.voiceId} onChange={(e) => speech.chooseVoice(e.target.value)} className="max-w-64 rounded-lg border border-line bg-surface px-2 py-1 text-sm">
            {speech.voiceOptions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {speech.voiceIsOnline && (
        <details className="text-muted">
          <summary className="inline-flex cursor-pointer items-center gap-1">
            <Wifi className="size-4" /> Giọng online: mỗi lần nghe chậm khoảng 0,3–1 giây
          </summary>
          <p className="mt-1">Cài giọng tiếng Trung offline để nghe ngay khi bấm:</p>
          <ul className="list-disc pl-4">
            {INSTALL_TIPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
