"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Headphones, PenLine, Sparkles, Star, Trophy } from "lucide-react";
import { getDictation } from "@/content/dictations";
import { LEVELS } from "@/content/levels";
import { getTopicContent } from "@/content/topics";
import { levelStats, nextTopic } from "@/lib/learn";
import { useProgress } from "@/lib/progress";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function HomeDashboard() {
  const p = useProgress();
  const next = nextTopic(p);
  const nextContent = next ? getTopicContent(next.slug) : undefined;
  const isNew = p.xp === 0;
  const topicsDone = LEVELS.reduce((sum, l) => sum + levelStats(l.code, p).done, 0);
  const featuredDictation = getDictation("story-my-family");

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-500/20 md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-24 size-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="chip mb-4 bg-white/15 text-white">
            <Sparkles className="size-3.5" /> {isNew ? "Chào mừng bạn!" : "Chào bạn quay lại 👋"}
          </span>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            Nắm chắc ngữ pháp,
            <br />
            nghe tốt từng từ.
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
            Học lý thuyết ngắn gọn → làm quiz ngay → nghe & chép lại câu dùng đúng cấu trúc vừa học. Lộ trình từ A1 đến C1.
          </p>

          {next && (
            <div className="mt-6 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20 backdrop-blur md:p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
                {isNew ? "Bắt đầu với" : "Tiếp tục học"}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold">{next.level}</span>
                <span className="text-lg font-bold md:text-xl">{next.title}</span>
              </div>
              {nextContent && <p className="mt-1 text-sm text-white/80">{nextContent.intro}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/grammar/${next.slug}`} className="btn bg-white text-indigo-700 hover:bg-indigo-50">
                  <BookOpen className="size-4" /> Học lý thuyết
                </Link>
                <Link href={`/quiz/topic-${next.slug}`} className="btn bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25">
                  <PenLine className="size-4" /> Làm quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Thống kê */}
      <section className="grid grid-cols-3 gap-3">
        <Stat icon={<Flame className="size-5" />} value={p.streak} label="ngày liên tiếp" tone="text-warning bg-warning-soft" />
        <Stat icon={<Star className="size-5" />} value={p.xp} label="XP" tone="text-primary bg-primary-soft" />
        <Stat icon={<Trophy className="size-5" />} value={topicsDone} label="chủ điểm xong" tone="text-success bg-success-soft" />
      </section>

      {/* Lộ trình theo cấp độ */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold md:text-2xl">Lộ trình theo cấp độ</h2>
          <Link href="/levels" className="text-sm font-semibold text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((l) => {
            const s = levelStats(l.code, p);
            const pct = s.available ? (s.done / s.available) * 100 : 0;
            return (
              <Link
                key={l.code}
                href={`/levels/${l.code.toLowerCase()}`}
                className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-lg font-black text-white ${l.gradient}`}>
                    {l.code}
                  </span>
                  <div>
                    <div className="font-bold">{l.name}</div>
                    <div className="text-xs text-muted">
                      {s.total} chủ điểm · {s.available} đã có bài
                    </div>
                  </div>
                  <ArrowRight className="ml-auto size-5 text-muted transition group-hover:translate-x-1 group-hover:text-fg" />
                </div>
                <p className="mt-3 flex-1 text-sm text-muted">{l.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar value={pct} barClassName={l.accent} label={`Tiến độ ${l.code}`} />
                  <span className="text-xs font-semibold text-muted">
                    {s.done}/{s.available}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ba trụ cột */}
      <section className="grid gap-4 md:grid-cols-3">
        <Pillar
          href="/grammar"
          icon={<BookOpen className="size-6" />}
          tone="from-sky-500 to-indigo-500"
          title="Lý thuyết"
          text="Công thức tô màu theo thành phần câu, dòng thời gian, lỗi người Việt hay mắc."
        />
        <Pillar
          href="/quiz"
          icon={<PenLine className="size-6" />}
          tone="from-violet-500 to-fuchsia-500"
          title="Quiz ngữ pháp"
          text="7 dạng bài: trắc nghiệm, chia động từ, tìm lỗi sai, viết lại câu, sắp xếp, nối..."
        />
        <Pillar
          href="/dictation"
          icon={<Headphones className="size-6" />}
          tone="from-emerald-500 to-teal-500"
          title="Nghe & chép"
          text="Nghe từng câu, gõ lại, từ sai được che *** để bạn nghe lại và tự sửa."
        />
      </section>

      {featuredDictation && (
        <section className="card flex flex-col items-start gap-4 p-5 md:flex-row md:items-center md:p-6">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <Headphones className="size-7" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <LevelBadge level={featuredDictation.level} />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Thử ngay</span>
            </div>
            <h3 className="mt-1 text-lg font-bold">Nghe & chép: {featuredDictation.title}</h3>
            <p className="text-sm text-muted">{featuredDictation.description} {featuredDictation.sentences.length} câu.</p>
          </div>
          <Link href={`/dictation/${featuredDictation.id}`} className="btn-primary">
            Bắt đầu nghe <ArrowRight className="size-4" />
          </Link>
        </section>
      )}
    </div>
  );
}

function Stat({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: string }) {
  return (
    <div className="card flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center">
      <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>{icon}</span>
      <div>
        <div className="text-xl font-extrabold leading-none">{value}</div>
        <div className="mt-1 text-xs text-muted">{label}</div>
      </div>
    </div>
  );
}

function Pillar({ href, icon, tone, title, text }: { href: string; icon: React.ReactNode; tone: string; title: string; text: string }) {
  return (
    <Link href={href} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white ${tone}`}>{icon}</span>
      <h3 className="mt-4 flex items-center gap-1 text-lg font-bold">
        {title} <ArrowRight className="size-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
      </h3>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </Link>
  );
}
