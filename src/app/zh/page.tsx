import Link from "next/link";
import { ArrowLeftRight, AudioLines, BookOpen, Brush, Headphones, Layers, MessagesSquare, Mic, PenLine, Route } from "lucide-react";
import { HSK_INFO, HSK_LEVELS, ZH_INTRO_STAGE } from "@/content/zh/hsk-levels";

/** Các phần của khoá tiếng Trung, theo thứ tự xây dựng (docs/PLAN-ZH.md mục 7). */
const MODULES: { icon: typeof AudioLines; title: string; hint: string; href?: string }[] = [
  { icon: AudioLines, title: "Pinyin & thanh điệu", hint: "Thanh mẫu, vận mẫu, 4 thanh, biến điệu 3-3, 不, 一", href: "/zh/pinyin" },
  { icon: Brush, title: "Hán tự", hint: "Thứ tự nét có hoạt hình, bộ thủ, âm Hán-Việt" },
  { icon: Layers, title: "Từ vựng HSK", hint: "Thẻ ghi nhớ ôn lặp lại ngắt quãng, theo từng cấp" },
  { icon: BookOpen, title: "Ngữ pháp", hint: "Theo danh mục điểm ngữ pháp của chuẩn HSK 3.0" },
  { icon: PenLine, title: "Quiz & thi thử", hint: "Sắp xếp câu, chọn thanh, chọn chữ, mô phỏng cấu trúc đề" },
  { icon: Headphones, title: "Nghe chép", hint: "Gõ pinyin (HSK 1–2) hoặc chữ Hán, chấm theo từng chữ" },
  { icon: MessagesSquare, title: "Đọc & hội thoại", hint: "Bật/tắt pinyin, chạm từ để xem nghĩa, nhập vai" },
  { icon: Mic, title: "Luyện nói", hint: "Đọc theo mẫu, nhận dạng giọng nói tiếng phổ thông" },
];

export default function ZhHomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-6 text-white shadow-xl shadow-rose-500/20 md:p-10">
        <div className="pointer-events-none absolute -right-10 -top-6 select-none text-[11rem] font-black leading-none text-white/10" lang="zh-Hans" aria-hidden="true">
          学
        </div>
        <div className="relative max-w-2xl">
          <span className="chip mb-4 bg-white/15 text-white">中 · Tiếng Trung · chuẩn HSK 3.0</span>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            Từ pinyin đầu tiên
            <br />
            đến HSK 4.
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
            Lộ trình khoảng 40 tuần, mỗi ngày 45 phút: thanh điệu → Hán tự → từ vựng → ngữ pháp → nghe, nói, đọc. Bám đề cương thi HSK mới (kỳ thi đầu tiên 13/12/2026).
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm ring-1 ring-white/20">
            <Route className="size-4" /> Khoá học đang được xây dựng — các phần sẽ mở dần theo thứ tự bên dưới.
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold">Lộ trình HSK</h2>
        <ol className="space-y-3">
          <li className="card flex items-start gap-4 p-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 text-lg font-black text-white">0</span>
            <div className="min-w-0">
              <div className="font-bold">
                {ZH_INTRO_STAGE.name} <span className="text-sm font-semibold text-muted">· tuần {ZH_INTRO_STAGE.weeks.join("–")}</span>
              </div>
              <p className="text-sm text-muted">{ZH_INTRO_STAGE.canDo}</p>
            </div>
          </li>
          {HSK_LEVELS.map((lv) => {
            const info = HSK_INFO[lv];
            return (
              <li key={lv} className="card flex items-start gap-4 p-5">
                <span className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-lg font-black text-white ${info.gradient}`}>{lv}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">
                    {info.name} <span className="text-sm font-semibold text-muted">· tuần {info.weeks.join("–")}</span>
                  </div>
                  <p className="text-sm text-muted">{info.canDo}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                    <span className="chip bg-surface-2">{info.words.toLocaleString("vi-VN")} từ (cộng dồn)</span>
                    <span className="chip bg-surface-2">{info.chars.toLocaleString("vi-VN")} chữ Hán</span>
                    <span className="chip bg-surface-2">+{info.grammarPoints} điểm ngữ pháp</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-muted">
          Số từ theo đề cương thi HSK mới (11/2025); số chữ Hán và điểm ngữ pháp theo tiêu chuẩn GF 0025-2021. Danh mục từ và pinyin:{" "}
          <a href="https://github.com/bezlant/hsk-3-vocabulary" className="underline" target="_blank" rel="noopener noreferrer">
            HSKStory
          </a>{" "}
          / CC-CEDICT, giấy phép{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline" target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold">Các phần của khoá học</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map(({ icon: Icon, title, hint, href }) => {
            const body = (
              <>
                <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="font-bold">{title}</div>
                <p className="text-sm text-muted">{hint}</p>
                {href ? (
                  <span className="chip bg-primary-soft text-primary">Học ngay →</span>
                ) : (
                  <span className="chip bg-surface-2 text-muted">Đang xây dựng</span>
                )}
              </>
            );
            return href ? (
              <Link key={title} href={href} className="card space-y-2 p-4 transition hover:shadow-md">
                {body}
              </Link>
            ) : (
              <div key={title} className="card space-y-2 p-4">
                {body}
              </div>
            );
          })}
        </div>
      </section>

      <p className="flex items-center justify-center gap-1.5 text-center text-sm text-muted">
        <ArrowLeftRight className="size-4" /> Muốn học tiếng Anh? Đổi ngôn ngữ ở nút cạnh logo.
      </p>
    </div>
  );
}
