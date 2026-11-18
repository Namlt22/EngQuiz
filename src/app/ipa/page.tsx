import type { Metadata } from "next";
import { IpaExplorer } from "@/components/ipa/IpaExplorer";

export const metadata: Metadata = {
  title: "Bảng phiên âm IPA — cách đọc 44 âm tiếng Anh",
  description:
    "Bảng IPA 44 âm tiếng Anh: nguyên âm đơn, nguyên âm đôi, phụ âm. Hướng dẫn khẩu hình, âm tiếng Việt gần giống, lỗi hay gặp và phát âm mẫu.",
};

export default function IpaPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-extrabold md:text-3xl">Bảng phiên âm IPA</h1>
        <p className="mt-2 text-sm text-muted">Bấm từng âm để nghe và xem khẩu hình.</p>
      </header>
      <IpaExplorer />
    </div>
  );
}
