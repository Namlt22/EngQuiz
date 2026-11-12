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
        <p className="mt-2 text-muted">
          44 âm của tiếng Anh theo ký hiệu quốc tế (giọng Anh-Anh chuẩn, giống từ điển Oxford & Cambridge). Bấm vào từng âm để nghe âm đó
          đứng riêng và xem cách đặt môi, lưỡi. Từ ví dụ dùng giọng đọc của trình duyệt — nghe cả <b className="text-fg">từ ví dụ</b> để biết âm
          trong tiếng Anh thật.
        </p>
      </header>
      <IpaExplorer />
    </div>
  );
}
