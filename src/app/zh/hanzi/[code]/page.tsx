import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HANZI_CHARS, charCode, charFromCode, getHanziChar } from "@/content/zh/hanzi-chars";
import { HanziCharView } from "@/components/zh/HanziCharView";

export function generateStaticParams() {
  return HANZI_CHARS.map((c) => ({ code: charCode(c.char) }));
}

async function load(params: Promise<{ code: string }>) {
  const ch = charFromCode((await params).code);
  return ch ? getHanziChar(ch) : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const info = await load(params);
  return { title: info ? `Chữ ${info.char} (${info.readings.join(", ")}) — cách viết` : "Chữ Hán" };
}

export default async function HanziCharPage({ params }: { params: Promise<{ code: string }> }) {
  const info = await load(params);
  if (!info) notFound();
  return <HanziCharView info={info} />;
}
