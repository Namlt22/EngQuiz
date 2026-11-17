"use client";

/**
 * Trang /zh/pinyin: giới thiệu cấu tạo âm tiết, bảng thanh mẫu bấm để nghe, 4 thanh, và danh sách bài học.
 * Bài đã xong lấy từ tiến độ của khoá tiếng Trung (chủ điểm "pinyin-<id>").
 */
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { INITIAL_CHART, PINYIN_GROUP_INFO, PINYIN_LESSONS, type PinyinItem } from "@/content/zh/pinyin-lessons";
import type { Tone } from "@/core/pinyin";
import { useProgress } from "@/lib/progress";
import { useSpeech } from "@/lib/speech";
import { ToneCurve } from "./ToneCurve";
import { ZhVoiceNotice } from "./ZhVoiceNotice";

const TONE_DEMO: { tone: Tone; item: PinyinItem; hint: string }[] = [
  { tone: 1, item: { pinyin: "mā", hanzi: "妈", vi: "mẹ" }, hint: "cao, bằng" },
  { tone: 2, item: { pinyin: "má", hanzi: "麻", vi: "tê" }, hint: "đi lên" },
  { tone: 3, item: { pinyin: "mǎ", hanzi: "马", vi: "ngựa" }, hint: "xuống rồi lên" },
  { tone: 4, item: { pinyin: "mà", hanzi: "骂", vi: "mắng" }, hint: "rơi xuống" },
];

export function PinyinOverview() {
  const speech = useSpeech({ lang: "zh" });
  const progress = useProgress();
  const say = (hanzi: string) => speech.speak(hanzi, 0.8);
  const doneCount = PINYIN_LESSONS.filter((l) => progress.topics[`pinyin-${l.id}`]?.theoryRead).length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <span className="chip bg-surface-2">Chặng 0 · Nhập môn</span>
        <h1 className="text-2xl font-extrabold md:text-3xl">Pinyin & thanh điệu</h1>
        <p className="max-w-2xl text-muted">
          Pinyin là cách ghi âm tiếng phổ thông bằng chữ Latin. Mỗi âm tiết gồm <b>thanh mẫu</b> (phụ âm đầu) + <b>vận mẫu</b> (vần) +{" "}
          <b>thanh điệu</b>: <span lang="zh-Hans">妈</span> = m + a + thanh 1 → <b>mā</b>. Cùng một âm, đổi thanh là đổi nghĩa.
        </p>
      </header>

      <ZhVoiceNotice speech={speech} />

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">Bốn thanh — bấm để nghe</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {TONE_DEMO.map(({ tone, item, hint }) => (
            <button key={tone} type="button" onClick={() => say(item.hanzi)} className="card flex flex-col items-center gap-1 p-4 text-center transition hover:shadow-md">
              <ToneCurve tone={tone} className="h-10 w-16 text-primary" />
              <span className="text-2xl font-bold">{item.pinyin}</span>
              <span className="text-sm text-muted">
                <span lang="zh-Hans">{item.hanzi}</span> · {item.vi}
              </span>
              <span className="text-xs font-semibold text-primary">
                Thanh {tone}: {hint}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">Bảng 21 thanh mẫu</h2>
        <div className="space-y-2">
          {INITIAL_CHART.map((group) => (
            <div key={group.label} className="flex flex-wrap items-center gap-2">
              <span className="w-32 shrink-0 text-xs font-semibold text-muted">{group.label}</span>
              {group.cells.map(({ symbol, sample }) => (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => say(sample.hanzi)}
                  className="flex min-w-16 flex-col items-center rounded-xl border border-line bg-surface px-3 py-1.5 transition hover:border-primary"
                  aria-label={`Nghe ${symbol}: ${sample.pinyin} ${sample.hanzi}`}
                >
                  <span className="text-lg font-bold">{symbol}</span>
                  <span className="text-xs text-muted">
                    {sample.pinyin} <span lang="zh-Hans">{sample.hanzi}</span>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-extrabold">Bài học</h2>
          <span className="text-sm text-muted">
            Đã xong {doneCount}/{PINYIN_LESSONS.length}
          </span>
        </div>
        <ol className="space-y-2">
          {PINYIN_LESSONS.map((l, i) => {
            const done = !!progress.topics[`pinyin-${l.id}`]?.theoryRead;
            const info = PINYIN_GROUP_INFO[l.group];
            return (
              <li key={l.id}>
                <Link href={`/zh/pinyin/${l.id}`} className={`card group flex items-center gap-4 p-4 transition hover:shadow-md ${done ? "border-success/40" : ""}`}>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl font-black ${done ? "bg-success text-white" : "bg-surface-2"}`}>
                    {done ? <CheckCircle2 className="size-5" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`chip ${info.chip}`}>{info.label}</span>
                    <span className="mt-1 block font-bold">{l.title}</span>
                    <span className="block text-sm text-muted">{l.goal}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
