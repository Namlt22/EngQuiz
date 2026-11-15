"use client";

/**
 * Một tuần của lộ trình: 7 ngày (Day n) — 6 ngày học với danh sách bài cụ thể (tự hoàn thành khi học xong)
 * và ngày 7 nói chuyện thật (tự tích) — cùng cột mốc, số giây nói, ghi chú lỗi của tuần.
 */
import { Check, ChevronDown, MessagesSquare, Repeat } from "lucide-react";
import { weekDateRange, type RoadmapLog, type RoadmapWeek } from "@/lib/roadmap";
import { dayDone, dayTasksDone, type RoadmapDay } from "@/lib/roadmap-days";
import { roadmapActions } from "@/lib/roadmap-store";
import { DayTasks, dayMinutes } from "./DayTasks";
import { PHASE_STYLES, formatSeconds } from "./labels";

interface Props {
  week: RoadmapWeek;
  days: RoadmapDay[];
  log: RoadmapLog;
  startDate: string;
  talkMinutes: number;
  isCurrent: boolean;
  /** Day đang học tiếp theo (để mở sẵn ngày đó) */
  nextDayN?: number;
}

export function WeekCard({ week, days, log, startDate, talkMinutes, isCurrent, nextDayN }: Props) {
  const style = PHASE_STYLES[week.phase - 1];
  const doneDays = days.filter((d) => dayDone(log, d)).length;
  const complete = doneDays === days.length && !!log.milestones[week.n];
  const containsNext = days.some((d) => d.n === nextDayN);

  return (
    <details open={isCurrent || containsNext} className={`card group overflow-hidden ${isCurrent ? `ring-2 ${style.ring}` : ""}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 md:p-5 [&::-webkit-details-marker]:hidden">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl font-mono text-sm font-bold ${style.soft} ${style.text}`}>
          {complete ? <Check className="size-5" /> : week.n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <h3 className="font-bold">{week.title}</h3>
            {isCurrent && <span className={`chip ${style.soft} ${style.text}`}>Tuần này</span>}
            {week.review && (
              <span className="chip bg-surface-2 text-muted">
                <Repeat className="size-3" /> Củng cố
              </span>
            )}
          </div>
          <div className="text-xs text-muted">
            Tuần {week.n} · Day {days[0].n}–{days[days.length - 1].n} · {weekDateRange(startDate, week.n)}
          </div>
        </div>
        <span className="hidden text-right text-xs font-semibold text-muted sm:block">
          {doneDays}/{days.length} ngày
        </span>
        <ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" />
      </summary>

      <div className="space-y-3 border-t border-line p-4 md:p-5">
        {days.map((day) => (
          <DayRow key={day.n} day={day} log={log} talkMinutes={talkMinutes} isNext={day.n === nextDayN} />
        ))}

        <label htmlFor={`m-${week.n}`} className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface-2 p-3 text-sm">
          <input
            id={`m-${week.n}`}
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
            checked={!!log.milestones[week.n]}
            onChange={(e) => roadmapActions.toggle("milestones", String(week.n), e.target.checked)}
          />
          <span>
            <b>Cột mốc tuần {week.n}:</b> {week.milestone}
            {week.recordCheckpoint && (
              <span className="mt-1 block text-xs text-muted">
                Tuần ghi âm so sánh: nói đề “Tell me about yourself and your plans” và giữ file để nghe lại sau.
              </span>
            )}
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
          <label htmlFor={`sec-${week.n}`} className="space-y-1 text-xs font-semibold text-muted">
            <span>Giây nói liên tục (mục tiêu {formatSeconds(week.targetSeconds)})</span>
            <input
              id={`sec-${week.n}`}
              type="number"
              inputMode="numeric"
              min={0}
              max={3600}
              step={5}
              value={log.seconds[week.n] ?? ""}
              onChange={(e) => roadmapActions.setSeconds(week.n, e.target.value === "" ? undefined : Number(e.target.value))}
              className="input py-2 text-sm"
            />
          </label>
          <label htmlFor={`note-${week.n}`} className="space-y-1 text-xs font-semibold text-muted">
            <span>3 lỗi hay mắc tuần này</span>
            <textarea
              id={`note-${week.n}`}
              rows={2}
              maxLength={500}
              placeholder="vd: quên -s sau he/she, đọc thiếu âm cuối…"
              value={log.notes[week.n] ?? ""}
              onChange={(e) => roadmapActions.setNote(week.n, e.target.value)}
              className="input resize-y py-2 text-sm"
            />
          </label>
        </div>
      </div>
    </details>
  );
}

function DayRow({ day, log, talkMinutes, isNext }: { day: RoadmapDay; log: RoadmapLog; talkMinutes: number; isNext: boolean }) {
  const done = dayDone(log, day);

  if (day.kind === "talk") {
    return (
      <label
        htmlFor={`talk-${day.week}`}
        className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-3 ${done ? "border-success/40 bg-success/10" : "border-line"}`}
      >
        <DayBadge n={day.n} done={done} />
        <span className="min-w-0 flex-1 text-sm">
          <b>Nói chuyện thật {talkMinutes} phút</b>
          <span className="block text-xs text-muted">
            <MessagesSquare className="mr-1 inline size-3.5" />
            Với bạn bè, gia sư hoặc người nước ngoài — dùng 20 câu cứu nguy. Nói xong thì tự tích.
          </span>
        </span>
        <input
          id={`talk-${day.week}`}
          type="checkbox"
          className="size-5 shrink-0 accent-[var(--primary)]"
          checked={done}
          onChange={(e) => roadmapActions.toggle("talks", String(day.week), e.target.checked)}
        />
      </label>
    );
  }

  const count = dayTasksDone(log, day);
  return (
    <details open={isNext} className={`group/day rounded-xl border ${isNext ? "border-primary/40" : "border-line"}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
        <DayBadge n={day.n} done={done} />
        <span className="min-w-0 flex-1">
          <span className="text-sm font-bold">Day {day.n}</span>
          {isNext && <span className="chip ml-2 bg-primary-soft text-primary">Học tiếp</span>}
          <span className="block text-xs text-muted">
            {done ? "Hoàn thành" : `${count}/${day.tasks.length} bài`} · ~{dayMinutes(day)} phút
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted transition group-open/day:rotate-180" />
      </summary>
      <div className="px-3 pb-3">
        <DayTasks day={day} log={log} />
      </div>
    </details>
  );
}

function DayBadge({ n, done }: { n: number; done: boolean }) {
  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold ${
        done ? "bg-success text-white dark:text-bg" : "bg-surface-2 text-muted"
      }`}
    >
      {done ? <Check className="size-5" /> : n}
    </span>
  );
}
