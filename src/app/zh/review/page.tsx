import type { Metadata } from "next";
import { ReviewHome } from "@/components/vocab/ReviewHome";

export const metadata: Metadata = { title: "Ôn thẻ hôm nay" };

export default function ZhReviewPage() {
  return <ReviewHome course="zh" />;
}
