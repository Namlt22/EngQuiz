import type { Metadata } from "next";
import { ReviewHome } from "@/components/vocab/ReviewHome";

export const metadata: Metadata = { title: "Ôn thẻ hôm nay" };

export default function ReviewPage() {
  return <ReviewHome course="en" />;
}
