import type { Metadata } from "next";
import { HanziBasics } from "@/components/zh/HanziBasics";

export const metadata: Metadata = { title: "Chữ Hán: nét, thứ tự nét, bộ thủ" };

export default function HanziPage() {
  return <HanziBasics />;
}
