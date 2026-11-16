import type { Metadata } from "next";
import { RememberCourse } from "@/components/zh/RememberCourse";

export const metadata: Metadata = {
  title: { default: "Tiếng Trung HSK 3.0", template: "%s · Tiếng Trung · EngQuiz" },
  description: "Học tiếng Trung theo chuẩn HSK 3.0: pinyin, thanh điệu, Hán tự, từ vựng, ngữ pháp và lộ trình HSK 1 → HSK 4.",
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RememberCourse />
      {children}
    </>
  );
}
