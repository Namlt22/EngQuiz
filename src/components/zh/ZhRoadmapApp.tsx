"use client";

/**
 * Lộ trình khoá tiếng Trung (/zh/roadmap): chọn điểm bắt đầu → đường đi theo tuần, mỗi ngày một danh sách bài.
 * Bài tự hoàn thành khi người học làm xong hoạt động tương ứng (không có ô tự tích).
 */
import { useState } from "react";
import { CalendarDays, PartyPopper, RotateCcw } from "lucide-react";
import { ZH_PHASE_NAMES, ZH_INTRO_WEEKS, ZH_WEEKS } from "@/content/zh/roadmap-zh";

const HSK_WEEKS = ZH_WEEKS.length - ZH_INTRO_WEEKS;
const TOP_HSK = Math.max(...ZH_WEEKS.map((w) => w.hsk ?? 0));
import { currentWeekNumber, type RoadmapLog } from "@/lib/roadmap";
import { dayDone, dayTasksDone, nextOpenDay, weekDone, type RoadmapDay } from "@/lib/roadmap-days";
import { roadmapActions, useHydrated, useRoadmapState } from "@/lib/roadmap-store";
import { todayKey } from "@/lib/progress";
import { buildZhRoadmap, zhProfile, zhSkipsIntro } from "@/lib/zh-roadmap";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SaveToAccountHint } from "@/components/auth/SaveToAccountHint";
import { DayTasks, dayMinutes } from "@/components/roadmap/DayTasks";
import { RoadmapPath, dayInfo } from "@/components/roadmap/RoadmapPath";

export function ZhRoadmapApp() {
  const hydrated = useHydrated();
  const { profile, log } = useRoadmapState();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!hydrated) return <div className="card h-64 animate-pulse" aria-busy="true" />;
  if (!profile) return <ZhRoadmapSetup />;

  const { weeks, days } = buildZhRoadmap(profile);
  const next = nextOpenDay(days, log);
  const current = currentWeekNumber(profile.startDate, todayKey(), weeks.length);
  const daysDone = days.filter((d) => dayDone(log, d)).length;
  const milestones = weeks.filter((w) => weekDone(log, days, w.n)).length;

  return (
    <div className="space-y-8">
      <SaveToAccountHint />
      <section className="card space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="chip bg-surface-2">Lộ trình tiếng Trung · {weeks.length} tuần</span>
            <h1 className="mt-1 text-2xl font-extrabold">{zhSkipsIntro(profile) ? `HSK 1 → HSK ${TOP_HSK} (đã biết pinyin)` : `Từ con số 0 đến HSK ${TOP_HSK}`}</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <CalendarDays className="size-4" /> {current === 0 ? `Bắt đầu ${profile.startDate.split("-").reverse().join("/")}` : `Đang ở tuần ${current}/${weeks.length}`}
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="font-bold">
              {daysDone}/{days.length} ngày
            </div>
            <div className="text-muted">
              {milestones}/{weeks.length} cột mốc
            </div>
          </div>
        </div>
        <ProgressBar value={(daysDone / days.length) * 100} />
      </section>

      <NextDay day={next} log={log} />

      <RoadmapPath weeks={weeks} days={days} log={log} nextDayN={next?.n} currentWeek={current} phaseNames={ZH_PHASE_NAMES} />

      <section className="card space-y-2 p-5 text-sm">
        <h2 className="font-bold">Làm lại lộ trình</h2>
        <p className="text-muted">Chọn lại điểm bắt đầu. Bài đã xong được giữ và chuyển sang lịch mới.</p>
        {confirmReset ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => roadmapActions.saveProfile(zhProfile(!zhSkipsIntro(profile), todayKey()))} className="btn-primary">
              {zhSkipsIntro(profile) ? "Học từ Nhập môn" : "Bỏ qua Nhập môn"}
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="btn-ghost">
              Huỷ
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="btn-ghost">
            <RotateCcw className="size-4" /> Đổi điểm bắt đầu
          </button>
        )}
      </section>
    </div>
  );
}

function NextDay({ day, log }: { day?: RoadmapDay; log: RoadmapLog }) {
  if (!day) {
    return (
      <section className="card space-y-2 p-6 text-center">
        <PartyPopper className="mx-auto size-10 text-primary" />
        <h2 className="text-xl font-extrabold">Bạn đã hoàn thành lộ trình đến HSK {TOP_HSK}!</h2>
        <p className="text-muted">Ôn thẻ từ vựng hằng ngày để giữ từ đã học, và làm lại các bài thi thử để chuẩn bị cho kỳ thi thật.</p>
      </section>
    );
  }
  const info = dayInfo(day);
  return (
    <section className="card space-y-3 p-5" id={`day-${day.n}`}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-extrabold">
          Hôm nay: Day {day.n} · {info.label}
        </h2>
        <span className="text-sm text-muted">
          {dayTasksDone(log, day)}/{day.tasks.length} bài · ~{dayMinutes(day)} phút
        </span>
      </div>
      <DayTasks day={day} log={log} />
    </section>
  );
}

function ZhRoadmapSetup() {
  const start = (skipIntro: boolean) => roadmapActions.saveProfile(zhProfile(skipIntro, todayKey()));
  return (
    <div className="space-y-6">
      <SaveToAccountHint />
      <header className="space-y-2">
        <h1 className="text-2xl font-extrabold md:text-3xl">Lộ trình tiếng Trung</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <button type="button" onClick={() => start(false)} className="card space-y-2 p-6 text-left transition hover:shadow-lg">
          <div className="text-xl font-extrabold">Mới bắt đầu</div>
          <p className="text-sm text-muted">
            {ZH_WEEKS.length} tuần · Nhập môn → HSK {TOP_HSK}
          </p>
          <span className="chip bg-primary-soft text-primary">Khuyên dùng nếu chưa học pinyin</span>
        </button>
        <button type="button" onClick={() => start(true)} className="card space-y-2 p-6 text-left transition hover:shadow-lg">
          <div className="text-xl font-extrabold">Đã biết pinyin</div>
          <p className="text-sm text-muted">{HSK_WEEKS} tuần · HSK 1 → HSK {TOP_HSK}</p>
        </button>
      </div>
    </div>
  );
}
