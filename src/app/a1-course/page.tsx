import type { Metadata } from "next";
import { CourseHome } from "@/components/en-course/CourseHome";

export const metadata: Metadata = {
  title: "Khoá A1 20 ngày",
  description: "Khoá tiếng Anh A1 20 ngày: mỗi ngày từ vựng, ngữ pháp, nghe, đọc, viết, nói.",
};

export default function Page() {
  return <CourseHome />;
}
