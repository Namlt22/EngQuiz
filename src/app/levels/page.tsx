import { permanentRedirect } from "next/navigation";

/** "Cấp độ" đã gộp vào trang Ngữ pháp (lọc theo cấp); /levels/[level] vẫn giữ làm đường đi theo cấp. */
export default function LevelsPage() {
  permanentRedirect("/grammar");
}
