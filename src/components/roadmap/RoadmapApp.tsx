"use client";

import { useState } from "react";
import { AlertTriangle, CalendarDays, PartyPopper, Pencil, RotateCcw } from "lucide-react";
import { todayKey } from "@/lib/progress";
import { buildRoadmap, currentWeekNumber, type Roadmap, type RoadmapLog, type RoadmapProfile } from "@/lib/roadmap";
import { buildDays, dayDone, dayTasksDone, nextOpenDay, type RoadmapDay } from "@/lib/roadmap-days";
import { roadmapActions, useHydrated, useRoadmapState } from "@/lib/roadmap-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SaveToAccountHint } from "@/components/auth/SaveToAccountHint";
import { DayTasks, dayMinutes } from "./DayTasks";
import { FOCUS_LABELS, GOAL_LABELS, PHASE_GOALS, PHASE_STYLES, RESCUE_PHRASES } from "./labels";
import { RoadmapSetup } from "./RoadmapSetup";
import { SpeakingChart } from "./SpeakingChart";
import { WeekCard } from "./WeekCard";

export function RoadmapApp() {
  const hydrated = useHydrated();
  const { profile, log } = useRoadmapState();
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
  const days = buildDays(roadmap);
  const next = nextOpenDay(days, log);
  const current = currentWeekNumber(profile.startDate, todayKey(), profile.weeks);

  return (
    <div className="space-y-8">
      <SaveToAccountHint />
      <Overview profile={profile} roadmap={roadmap} days={days} log={log} current={current} onEdit={() => setEditing(true)} />
      <NextDayCard day={next} log={log} talkMinutes={roadmap.talkMinutes} />
      {(!next || next.week === 1) && <RescuePhrases />}

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
                  days={days.filter((d) => d.week === w.n)}
                  log={log}
                  nextDayN={next?.n}
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

function Overview({
  profile,
  roadmap,
  days,
  log,
  current,
  onEdit,
}: {
  profile: RoadmapProfile;
  roadmap: Roadmap;
  days: RoadmapDay[];
  log: RoadmapLog;
  current: number;
  onEdit: () => void;
}) {
  const daysDone = days.filter((d) => dayDone(log, d)).length;
  const talks = roadmap.weeks.filter((w) => log.talks[w.n]).length;
  const milestones = roadmap.weeks.filter((w) => log.milestones[w.n]).length;
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
        <OverviewStat value={daysDone} total={days.length} label="ngày đã hoàn thành" />
        <OverviewStat value={talks} total={roadmap.weeks.length} label="buổi nói chuyện thật" />
        <OverviewStat value={milestones} total={roadmap.weeks.length} label="cột mốc đã đạt" />
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

/** Thẻ lớn đầu trang: ngày học tiếp theo (Day n) với danh sách bài — chỉ cần bấm "Học" lần lượt. */
function NextDayCard({ day, log, talkMinutes }: { day?: RoadmapDay; log: RoadmapLog; talkMinutes: number }) {
  if (!day) {
    return (
      <section className="card flex flex-col items-center gap-2 p-8 text-center">
        <PartyPopper className="size-10 text-primary" />
        <h2 className="text-xl font-bold">Bạn đã hoàn thành toàn bộ lộ trình!</h2>
        <p className="text-sm text-muted">Tạo lộ trình mới ở cấp độ cao hơn để học tiếp.</p>
      </section>
    );
  }
  if (day.kind === "talk") {
    return (
      <section className="card space-y-3 p-5 md:p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">Học tiếp · Day {day.n} · Tuần {day.week}</div>
        <h2 className="text-xl font-bold">Nói chuyện thật {talkMinutes} phút</h2>
        <p className="text-sm text-muted">
          Ngày cuối tuần: nói chuyện bằng tiếng Anh với bạn bè, gia sư hoặc người nước ngoài. Xong thì tích ô “Nói chuyện thật” ở Day {day.n} bên dưới.
        </p>
      </section>
    );
  }
  const count = dayTasksDone(log, day);
  return (
    <section className="card space-y-4 p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Học tiếp · Tuần {day.week}</div>
          <h2 className="text-2xl font-extrabold">Day {day.n}</h2>
          <p className="text-sm text-muted">
            {day.tasks.length} bài · khoảng {dayMinutes(day)} phút. Bấm “Học” lần lượt — học xong bài nào, bài đó tự được tích; đủ bài là xong Day {day.n}.
          </p>
        </div>
        <span className="font-mono text-sm font-bold text-primary">
          {count}/{day.tasks.length}
        </span>
      </div>
      <ProgressBar value={(count / day.tasks.length) * 100} label={`Tiến độ Day ${day.n}`} />
      <DayTasks day={day} log={log} />
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
