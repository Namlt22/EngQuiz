import Link from "next/link";
import { AudioLines, BookOpen, Brush, Headphones, Layers, MessagesSquare, PenLine, Route } from "lucide-react";
import { HSK_INFO, HSK_LEVELS, ZH_INTRO_STAGE } from "@/content/zh/hsk-levels";

/** Lối tắt tới các phần của khoá tiếng Trung — chỉ icon + tên. */
const MODULES = [
  { icon: AudioLines, title: "Pinyin", href: "/zh/pinyin" },
  { icon: Brush, title: "Hán tự", href: "/zh/hanzi" },
  { icon: Layers, title: "Từ vựng", href: "/zh/vocab" },
  { icon: BookOpen, title: "Ngữ pháp", href: "/zh/grammar" },
  { icon: MessagesSquare, title: "Hội thoại", href: "/zh/dialogues" },
  { icon: Headphones, title: "Nghe chép", href: "/zh/dictation" },
  { icon: PenLine, title: "Thi thử", href: "/zh/mock/hsk1" },
] as const;

export default function ZhHomePage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-6 text-white shadow-xl shadow-rose-500/20 md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-6 select-none text-[9rem] font-black leading-none text-white/10" lang="zh-Hans" aria-hidden="true">
          学
        </div>
        <div className="relative max-w-2xl">
          <span className="chip mb-3 bg-white/15 text-white">中 · HSK 3.0</span>
          <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">Từ pinyin đầu tiên đến HSK 4.</h1>
          <p className="mt-2 text-white/85">40 tuần · 45 phút mỗi ngày</p>
          <Link href="/zh/roadmap" className="btn mt-5 bg-white text-rose-700 hover:bg-rose-50">
            <Route className="size-4" /> Bắt đầu lộ trình
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Lộ trình</h2>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stage badge="0" gradient="from-slate-500 to-slate-700" name={ZH_INTRO_STAGE.name} weeks={ZH_INTRO_STAGE.weeks} detail="Pinyin, nét" />
          {HSK_LEVELS.map((lv) => {
            const info = HSK_INFO[lv];
            return <Stage key={lv} badge={String(lv)} gradient={info.gradient} name={`HSK ${lv}`} weeks={info.weeks} detail={`${info.words.toLocaleString("vi-VN")} từ`} />;
          })}
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Luyện tập</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {MODULES.map(({ icon: Icon, title, href }) => (
            <Link key={href} href={href} className="card flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-bold">{title}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-muted">
        Từ vựng & pinyin:{" "}
        <a href="https://github.com/bezlant/hsk-3-vocabulary" className="underline" target="_blank" rel="noopener noreferrer">
          HSKStory
        </a>{" "}
        / CC-CEDICT ·{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline" target="_blank" rel="noopener noreferrer">
          CC BY-SA 4.0
        </a>
      </p>
    </div>
  );
}

function Stage({ badge, gradient, name, weeks, detail }: { badge: string; gradient: string; name: string; weeks: [number, number]; detail: string }) {
  return (
    <li className="card flex items-center gap-3 p-3">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-black text-white ${gradient}`}>{badge}</span>
      <div className="min-w-0">
        <div className="font-bold">{name}</div>
        <div className="text-xs text-muted">
          Tuần {weeks.join("–")} · {detail}
        </div>
      </div>
    </li>
  );
}
