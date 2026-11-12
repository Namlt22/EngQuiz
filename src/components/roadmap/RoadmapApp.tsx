"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, Pencil, RotateCcw } from "lucide-react";
import { useProgress, todayKey, PASS_PERCENT, topicStatus, type ProgressState } from "@/lib/progress";
import { hasDictation } from "@/lib/learn";
import { getDictation } from "@/content/dictations";
import { getTopicMeta } from "@/content/catalog";
import { IPA_MAP } from "@/content/ipa";
import {
  BLOCK_ORDER,
  buildRoadmap,
  currentWeekNumber,
  roadmapSummary,
  type BlockKey,
  type Roadmap,
  type RoadmapProfile,
  type RoadmapWeek,
} from "@/lib/roadmap";
import { roadmapActions, useHydrated, useRoadmapState } from "@/lib/roadmap-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SaveToAccountHint } from "@/components/auth/SaveToAccountHint";
import { BLOCK_LABELS, FOCUS_LABELS, GOAL_LABELS, PHASE_GOALS, PHASE_STYLES, RESCUE_PHRASES } from "./labels";
import { RoadmapSetup } from "./RoadmapSetup";
import { SpeakingChart } from "./SpeakingChart";
import { WeekCard } from "./WeekCard";

export function RoadmapApp() {
  const hydrated = useHydrated();
  const { profile, log } = useRoadmapState();
  const progress = useProgress();
  const [editing, setEditing] = useState(false);

  if (!hydrated) return <div className="card h-64 animate-pulse" aria-busy="true" />;
  if (!profile) {
    return (
      <div className="space-y-4">
        <SaveToAccountHint />
        <RoadmapSetup />
      </div>
    );
  }
  if (editing) return <RoadmapSetup initial={profile} onDone={() => setEditing(false)} />;

  const roadmap = buildRoadmap(profile);
  const current = currentWeekNumber(profile.startDate, todayKey(), profile.weeks);
  const currentWeek = roadmap.weeks[current - 1];

  return (
    <div className="space-y-8">
      <SaveToAccountHint />
      <Overview profile={profile} roadmap={roadmap} current={current} onEdit={() => setEditing(true)} />
      {currentWeek && <TodayPlan week={currentWeek} roadmap={roadmap} progress={progress} />}
      {current === 1 && <RescuePhrases />}

      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-lg font-bold">Giây nói liên tục theo tuần</h2>
          <span className="text-xs text-muted">Vạch đứt là mục tiêu của giai đoạn. Nhập số giây ở thẻ từng tuần.</span>
        </div>
        <SpeakingChart weeks={roadmap.weeks} seconds={log.seconds} />
      </section>

      {PHASE_STYLES.map((style, i) => {
        const weeks = roadmap.weeks.filter((w) => w.phase === i + 1);
        if (weeks.length === 0) return null;
        return (
          <section key={style.name} className="space-y-3">
            <div className={`border-l-4 pl-3 ${style.text}`} style={{ borderColor: "currentColor" }}>
              <h2 className="text-lg font-bold">
                Giai đoạn {i + 1} · {style.name}
              </h2>
              <p className="text-sm text-muted">{PHASE_GOALS[i]}</p>
            </div>
            <div className="space-y-3">
              {weeks.map((w) => (
                <WeekCard
                  key={w.n}
                  week={w}
                  log={log}
                  progress={progress}
                  startDate={profile.startDate}
                  talkMinutes={roadmap.talkMinutes}
                  isCurrent={w.n === current}
                />
              ))}
            </div>
          </section>
        );
      })}

      <ResetPanel />
    </div>
  );
}

function Overview({ profile, roadmap, current, onEdit }: { profile: RoadmapProfile; roadmap: Roadmap; current: number; onEdit: () => void }) {
  const { log } = useRoadmapState();
  const s = roadmapSummary(roadmap, log);
  const status =
    current === 0
      ? `Bắt đầu ngày ${profile.startDate.split("-").reverse().join("/")}`
      : current > profile.weeks
        ? "Đã qua hết lộ trình"
        : `Tuần ${current}/${profile.weeks}`;

  return (
    <section className="space-y-4 rounded-3xl bg-gradient-to-br from-teal-600 via-sky-600 to-violet-600 p-6 text-white shadow-lg md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/75">Lộ trình của tôi</div>
          <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">
            {profile.level} → {GOAL_LABELS[profile.goal].headline} trong {profile.weeks} tuần
          </h1>
          <p className="mt-1 text-white/85">
            {profile.minutesPerDay} phút/ngày · tập trung {FOCUS_LABELS[profile.focus].title.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip bg-white/20 text-white">
            <CalendarDays className="size-3.5" /> {status}
          </span>
          <button type="button" onClick={onEdit} className="btn bg-white/15 py-2 text-white ring-1 ring-white/30 hover:bg-white/25">
            <Pencil className="size-4" /> Chỉnh
          </button>
        </div>
      </div>

      {roadmap.warnings.map((w) => (
        <p key={w} className="flex gap-2 rounded-xl bg-white/15 p-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {w}
        </p>
      ))}

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <OverviewStat value={s.sessions} total={s.sessionsTotal} label="buổi học" />
        <OverviewStat value={s.talks} total={s.weeks} label="buổi nói chuyện thật" />
        <OverviewStat value={s.milestones} total={s.weeks} label="cột mốc đã đạt" />
      </div>
    </section>
  );
}

function OverviewStat({ value, total, label }: { value: number; total: number; label: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/12 p-3 ring-1 ring-white/20 sm:p-4">
      <div className="font-mono text-xl font-bold tabular-nums sm:text-2xl">
        {value}
        <span className="text-base text-white/70">/{total}</span>
      </div>
      <div className="text-xs text-white/80">{label}</div>
      <ProgressBar value={total ? (value / total) * 100 : 0} className="mt-2 bg-white/20" barClassName="bg-white" label={label} />
    </div>
  );
}

/** Chọn bài chưa xong đầu tiên trong tuần cho từng khối của buổi hôm nay. */
function todayLinks(week: RoadmapWeek, progress: ProgressState): Record<BlockKey, { href: string; label: string } | undefined> {
  const dict = week.dictations.find((id) => (progress.dictations[id]?.best ?? 0) < PASS_PERCENT) ?? week.dictations[0];
  const topic = week.grammar.find((slug) => topicStatus(progress.topics[slug], hasDictation(slug)) !== "done") ?? week.grammar[0];
  const sound = week.sounds[0];
  const dictLink = dict ? { href: `/dictation/${dict}`, label: getDictation(dict)?.title ?? dict } : undefined;
  return {
    ipa: sound ? { href: `/ipa#${sound}`, label: week.sounds.map((id) => `/${IPA_MAP[id]?.symbol ?? id}/`).join(" ") } : undefined,
    dictation: dictLink,
    shadowing: dictLink,
    speaking: undefined,
    grammar: topic ? { href: `/grammar/${topic}`, label: getTopicMeta(topic)?.title ?? topic } : undefined,
  };
}

function TodayPlan({ week, roadmap, progress }: { week: RoadmapWeek; roadmap: Roadmap; progress: ProgressState }) {
  const links = todayLinks(week, progress);
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-bold">Buổi học hôm nay</h2>
        <p className="text-sm text-muted">
          Tuần {week.n}: {week.title}
        </p>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BLOCK_ORDER.map((key) => {
          const link = links[key];
          return (
            <li key={key} className="card flex flex-col gap-1 p-4">
              <span className="font-mono text-sm font-bold text-primary">{roadmap.minutes[key]} phút</span>
              <span className="font-bold">{BLOCK_LABELS[key].title}</span>
              <span className="flex-1 text-xs text-muted">{BLOCK_LABELS[key].how}</span>
              {key === "speaking" ? (
                <span lang="en" className="mt-2 text-sm font-medium">
                  “{week.prompts[0]}”
                </span>
              ) : (
                link && (
                  <Link href={link.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    {link.label} <ArrowRight className="size-3.5" />
                  </Link>
                )
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function RescuePhrases() {
  return (
    <section className="card space-y-3 p-5">
      <div>
        <h2 className="text-lg font-bold">20 câu cứu nguy — thuộc trong tuần đầu</h2>
        <p className="text-sm text-muted">Dùng khi không nghe kịp, quên từ hoặc cần thêm thời gian nghĩ.</p>
      </div>
      <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2" lang="en">
        {RESCUE_PHRASES.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );
}

function ResetPanel() {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button type="button" className="btn-ghost text-muted" onClick={() => setConfirming(true)}>
        <RotateCcw className="size-4" /> Xóa lộ trình và làm lại
      </button>
    );
  }
  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <span className="flex-1 text-sm">Xóa lộ trình và toàn bộ ô đã tích? Tiến độ lý thuyết, quiz, nghe chép vẫn giữ nguyên.</span>
      <button type="button" className="btn bg-danger text-white hover:brightness-110" onClick={() => roadmapActions.reset()}>
        Xóa
      </button>
      <button type="button" className="btn-ghost" onClick={() => setConfirming(false)}>
        Hủy
      </button>
    </div>
  );
}
