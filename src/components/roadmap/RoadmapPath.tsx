"use client";

/**
 * Bản đồ lộ trình: mỗi tuần là một chặng, 7 ngày (Day n) là 7 trạm nối nhau trên một đường uốn khúc.
 * Trạng thái mỗi trạm (xong / đang học / chưa tới) do app tự tính từ bài đã học — người học chỉ việc bấm vào trạm để học.
 */
import { useEffect, useState } from "react";
import { Check, Flag, Repeat, Trophy, X } from "lucide-react";
import type { RoadmapLog, RoadmapWeek } from "@/lib/roadmap";
import { dayDone, dayTasksDone, weekDone, type RoadmapDay } from "@/lib/roadmap-days";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DayTasks, TASK_ICONS, dayMinutes } from "./DayTasks";
import { PHASE_STYLES } from "./labels";

/* Hình học của đường đi (px). Khung rộng cố định 320px để vừa màn hình điện thoại 360px. */
const TRACK_W = 320;
const ROW_H = 92;
const PILL_W = 200;
/** Độ lệch ngang của 7 trạm so với giữa khung — tạo đường uốn khúc (|lệch| + PILL_W/2 ≤ TRACK_W/2). */
const SWAY = [-56, 0, 56, 60, 8, -48, 0];
const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

type Status = "done" | "next" | "todo";

/** Biểu tượng và nhãn ngắn của một ngày: theo bài chính trong ngày. */
export function dayInfo(day: RoadmapDay): { icon: typeof Trophy; label: string } {
  if (day.kind === "checkpoint") return { icon: Trophy, label: "Kiểm tra cuối tuần" };
  if (day.day === 6) return { icon: Repeat, label: "Ôn tập cả tuần" };
  if (day.label && day.tasks[0]) return { icon: TASK_ICONS[day.tasks[0].kind], label: day.label };
  const main =
    day.tasks.find((t) => t.kind === "theory") ?? day.tasks.find((t) => t.kind === "dictation") ?? day.tasks.find((t) => t.kind !== "sound") ?? day.tasks[0];
  if (!main) return { icon: Flag, label: `Day ${day.n}` };
  const label = main.title.includes(": ") ? main.title.slice(main.title.indexOf(": ") + 2) : main.title;
  return { icon: TASK_ICONS[main.kind], label };
}

export function RoadmapPath({
  weeks,
  days,
  log,
  nextDayN,
  currentWeek,
  phaseNames,
}: {
  weeks: RoadmapWeek[];
  days: RoadmapDay[];
  log: RoadmapLog;
  nextDayN?: number;
  currentWeek: number;
  /** Tên các phần thay cho tên mặc định của lộ trình tiếng Anh (vd khoá tiếng Trung) */
  phaseNames?: readonly string[];
}) {
  const [openDay, setOpenDay] = useState<number | null>(null);
  const selected = openDay === null ? undefined : days.find((d) => d.n === openDay);

  // Quay về từ một bài (link /roadmap#day-n): cuộn tới trạm và mở lại bảng của ngày đó.
  useEffect(() => {
    const n = Number(/^#day-(\d+)$/.exec(window.location.hash)?.[1]);
    if (!n || !days.some((d) => d.n === n)) return;
    document.getElementById(`day-${n}`)?.scrollIntoView({ block: "center" });
    setOpenDay(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ đọc hash một lần khi mở trang
  }, []);

  function close() {
    setOpenDay(null);
    if (window.location.hash) history.replaceState(null, "", window.location.pathname);
  }

  return (
    <div className="space-y-10">
      {PHASE_STYLES.map((style, p) => {
        const phaseWeeks = weeks.filter((w) => w.phase === p + 1);
        if (!phaseWeeks.length) return null;
        return (
          <section key={style.name} className="space-y-6" aria-label={`Phần ${p + 1}`}>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <div className="text-center">
                <div className={`text-xs font-bold uppercase tracking-[0.2em] ${style.text}`}>Phần {p + 1}</div>
                <div className="font-bold">{phaseNames?.[p] ?? style.name}</div>
              </div>
              <span className="h-px flex-1 bg-line" />
            </div>
            {phaseWeeks.map((w) => (
              <WeekStage
                key={w.n}
                week={w}
                days={days.filter((d) => d.week === w.n)}
                log={log}
                nextDayN={nextDayN}
                isCurrent={w.n === currentWeek}
                onOpen={setOpenDay}
              />
            ))}
          </section>
        );
      })}
      {selected && <DaySheet day={selected} week={weeks[selected.week - 1]} log={log} onClose={close} />}
    </div>
  );
}

function WeekStage({
  week,
  days,
  log,
  nextDayN,
  isCurrent,
  onOpen,
}: {
  week: RoadmapWeek;
  days: RoadmapDay[];
  log: RoadmapLog;
  nextDayN?: number;
  isCurrent: boolean;
  onOpen: (n: number) => void;
}) {
  const style = PHASE_STYLES[week.phase - 1];
  const doneCount = days.filter((d) => dayDone(log, d)).length;
  const achieved = weekDone(log, days, week.n);
  const points = days.map((_, i) => ({ x: TRACK_W / 2 + SWAY[i % SWAY.length], y: i * ROW_H + ROW_H / 2 }));
  const statusOf = (d: RoadmapDay): Status => (dayDone(log, d) ? "done" : d.n === nextDayN ? "next" : "todo");

  return (
    <div className="space-y-3">
      <header className={`rounded-2xl p-4 ${style.soft} ${isCurrent ? `ring-2 ${style.ring}` : ""}`}>
        <div className={`flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide ${style.text}`}>
          <span>Tuần {week.n}</span>
          <span className="font-mono normal-case tracking-normal opacity-80">
            Day {days[0].n}–{days[days.length - 1].n}
          </span>
          {isCurrent && <span className={`chip bg-surface normal-case tracking-normal ${style.text}`}>Tuần này</span>}
        </div>
        <h3 className="mt-1 text-lg font-bold">{week.title}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm">
          <Flag className={`mt-0.5 size-4 shrink-0 ${achieved ? "text-success" : "text-muted"}`} />
          <span>
            <span className="text-muted">Cột mốc:</span> {week.milestone}{" "}
            {achieved ? (
              <span className="chip ml-1 bg-success/15 text-success">Đã đạt</span>
            ) : (
              <span className="ml-1 text-xs text-muted">({doneCount}/{days.length} ngày)</span>
            )}
          </span>
        </p>
      </header>

      <div className="relative mx-auto" style={{ width: TRACK_W, height: days.length * ROW_H }}>
        <svg className="pointer-events-none absolute inset-0" width={TRACK_W} height={days.length * ROW_H} aria-hidden="true">
          {points.slice(1).map((b, i) => {
            const a = points[i];
            const walked = dayDone(log, days[i]);
            return (
              <path
                key={i}
                d={`M ${a.x} ${a.y} C ${a.x} ${a.y + ROW_H / 2}, ${b.x} ${b.y - ROW_H / 2}, ${b.x} ${b.y}`}
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={walked ? undefined : "2 9"}
                className={walked ? "stroke-current text-success" : "stroke-current text-line"}
              />
            );
          })}
        </svg>
        {days.map((d, i) => (
          <DayNode key={d.n} day={d} log={log} status={statusOf(d)} x={points[i].x} y={points[i].y} onOpen={() => onOpen(d.n)} />
        ))}
      </div>
    </div>
  );
}

function DayNode({ day, log, status, x, y, onOpen }: { day: RoadmapDay; log: RoadmapLog; status: Status; x: number; y: number; onOpen: () => void }) {
  const { icon: Icon, label } = dayInfo(day);
  const fraction = day.tasks.length ? dayTasksDone(log, day) / day.tasks.length : 0;
  const checkpoint = day.kind === "checkpoint";
  const pill =
    status === "done"
      ? "border-success/40 bg-surface"
      : status === "next"
        ? "border-primary bg-primary-soft shadow-lg shadow-primary/20 ring-4 ring-primary/15"
        : "border-line bg-surface opacity-80 hover:opacity-100";
  const iconBox =
    status === "done" ? "bg-success text-white dark:text-bg" : checkpoint ? "bg-amber-400/20 text-amber-500" : status === "next" ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted";

  return (
    <button
      id={`day-${day.n}`}
      type="button"
      onClick={onOpen}
      className={`absolute flex items-center gap-2.5 rounded-2xl border px-2.5 py-2 text-left transition hover:-translate-y-0.5 ${pill}`}
      style={{ width: PILL_W, left: x - PILL_W / 2, top: y - 28 }}
      aria-label={`Day ${day.n}: ${label}${status === "done" ? " — đã hoàn thành" : status === "next" ? " — học tiếp" : ""}`}
    >
      {status === "next" && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-fg shadow">
          Học tiếp
        </span>
      )}
      <span className="relative grid size-10 shrink-0 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r={RING_R} fill="none" strokeWidth="3" className="stroke-current text-line" />
          {fraction > 0 && (
            <circle
              cx="20"
              cy="20"
              r={RING_R}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${fraction * RING_C} ${RING_C}`}
              className="stroke-current text-success"
            />
          )}
        </svg>
        <span className={`grid size-[30px] place-items-center rounded-full ${iconBox}`}>
          {status === "done" ? <Check className="size-4" /> : <Icon className="size-4" />}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold">Day {day.n}</span>
        <span className="block truncate text-xs text-muted">{label}</span>
      </span>
    </button>
  );
}

/** Bảng chi tiết một ngày: danh sách bài, bấm "Học" là vào bài; bài xong tự hiện dấu tích. */
function DaySheet({ day, week, log, onClose }: { day: RoadmapDay; week: RoadmapWeek; log: RoadmapLog; onClose: () => void }) {
  const { label } = dayInfo(day);
  const count = dayTasksDone(log, day);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-sheet-title"
        className="card animate-pop-in max-h-[85dvh] w-full max-w-lg space-y-4 overflow-y-auto rounded-b-none p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-b-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">
              Tuần {week.n} · {week.title}
            </div>
            <h2 id="day-sheet-title" className="text-xl font-extrabold">
              Day {day.n} · {label}
            </h2>
            <p className="text-sm text-muted">
              {day.tasks.length} bài · khoảng {dayMinutes(day)} phút
              {day.kind === "checkpoint" ? " · xong bài kiểm tra là đạt cột mốc tuần" : ""}
            </p>
          </div>
          <button type="button" onClick={onClose} autoFocus className="grid size-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2" aria-label="Đóng">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <ProgressBar value={(count / day.tasks.length) * 100} label={`Tiến độ Day ${day.n}`} />
          <span className="shrink-0 font-mono text-sm font-bold text-primary">
            {count}/{day.tasks.length}
          </span>
        </div>
        <DayTasks day={day} log={log} />
        <p className="text-xs text-muted">Không cần tự đánh dấu: học xong bài nào, EngQuiz tự ghi nhận bài đó.</p>
      </div>
    </div>
  );
}
