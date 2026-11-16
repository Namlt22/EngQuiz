"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Máy không có giọng đọc tiếng Trung: giọng máy sẽ im lặng hoặc đọc sai, nên báo rõ cách cài.
 * Chờ một chút trước khi báo vì trình duyệt nạp danh sách giọng không đồng bộ.
 */
export function ZhVoiceNotice({ supported, voiceCount }: { supported: boolean; voiceCount: number }) {
  const [waited, setWaited] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setWaited(true), 1500);
    return () => window.clearTimeout(t);
  }, []);
  if (!waited || (supported && voiceCount > 0)) return null;
  return (
    <div role="alert" className="flex gap-2 rounded-2xl border border-warning/30 bg-warning-soft p-3 text-sm leading-relaxed">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
      <div>
        <b>Máy chưa có giọng đọc tiếng Trung</b>, nên âm mẫu có thể không phát được.
        <ul className="mt-1 list-disc pl-4 text-muted">
          <li>Windows: Cài đặt → Thời gian & ngôn ngữ → Giọng nói → Thêm giọng → Chinese (Simplified, China).</li>
          <li>Android: Cài đặt → Chuyển văn bản thành giọng nói → tải dữ liệu tiếng Trung.</li>
          <li>Hoặc dùng Chrome / Edge mới nhất (có sẵn giọng tiếng Trung trực tuyến).</li>
        </ul>
      </div>
    </div>
  );
}
