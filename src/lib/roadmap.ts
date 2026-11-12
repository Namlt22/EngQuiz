/**
 * Lộ trình cá nhân (trang /roadmap) — hàm thuần, không phụ thuộc trình duyệt.
 * Lộ trình được TÍNH LẠI từ hồ sơ người học mỗi lần render; chỉ hồ sơ và nhật ký tích ô được lưu.
 */
import { B1_SKIP_UNITS, CORE_UNIT_COUNT, ROADMAP_UNITS, type RoadmapGoal, type RoadmapUnit } from "@/content/roadmap-units";
import { hasDictation } from "./learn";
import { PASS_PERCENT, topicStatus, type ProgressState } from "./progress-calc";

export type { RoadmapGoal } from "@/content/roadmap-units";
export type RoadmapLevel = "A1" | "A2" | "B1";
export type RoadmapFocus = "speaking" | "listening" | "grammar";
export type RoadmapWeeks = 8 | 12 | 16;

export const LEVEL_OPTIONS: RoadmapLevel[] = ["A1", "A2", "B1"];
export const GOAL_OPTIONS: RoadmapGoal[] = ["daily", "work", "travel"];
export const FOCUS_OPTIONS: RoadmapFocus[] = ["speaking", "listening", "grammar"];
export const MINUTE_OPTIONS = [30, 45, 60, 75, 90] as const;
export const WEEK_OPTIONS: RoadmapWeeks[] = [8, 12, 16];

/** Số buổi học trong tuần (ngày thứ 7 là buổi nói chuyện thật). */
export const SESSIONS_PER_WEEK = 6;
/** Mục tiêu "số giây nói liên tục" theo giai đoạn 1, 2, 3. */
export const PHASE_TARGET_SECONDS = [30, 120, 300] as const;
export const PHASE_COUNT = PHASE_TARGET_SECONDS.length;
const MINUTE_STEP = 5;
const MS_PER_DAY = 86_400_000;

export interface RoadmapProfile {
  level: RoadmapLevel;
  goal: RoadmapGoal;
  focus: RoadmapFocus;
  minutesPerDay: number;
  weeks: RoadmapWeeks;
  /** yyyy-mm-dd */
  startDate: string;
}

/** Nhật ký người học tự tích. Khóa là số tuần ("3") hoặc tuần-buổi ("3-2"). */
export interface RoadmapLog {
  sessions: Record<string, boolean>;
  talks: Record<string, boolean>;
  milestones: Record<string, boolean>;
  seconds: Record<string, number>;
  notes: Record<string, string>;
}

export const EMPTY_LOG: RoadmapLog = { sessions: {}, talks: {}, milestones: {}, seconds: {}, notes: {} };

/* ---------------- Phân bổ thời gian mỗi buổi ---------------- */

export type BlockKey = "ipa" | "dictation" | "shadowing" | "speaking" | "grammar";
export const BLOCK_ORDER: BlockKey[] = ["ipa", "dictation", "shadowing", "speaking", "grammar"];

/** Trọng số gốc: với 75 phút cho ra 10 / 15 / 15 / 20 / 15. */
const BASE_WEIGHTS: Record<BlockKey, number> = { ipa: 2, dictation: 3, shadowing: 3, speaking: 4, grammar: 3 };
/** Điểm yếu nào thì dồn thêm thời gian cho khối đó. */
const FOCUS_BONUS: Record<RoadmapFocus, Partial<Record<BlockKey, number>>> = {
  speaking: { speaking: 2, shadowing: 1 },
  listening: { dictation: 2, shadowing: 1 },
  grammar: { grammar: 2, speaking: 1 },
};

/**
 * Chia `total` phút cho 5 khối theo trọng số, làm tròn theo bội số 5 phút
 * (phương pháp phần dư lớn nhất) để tổng luôn đúng bằng `total` đã làm tròn.
 */
export function allocateMinutes(total: number, focus: RoadmapFocus): Record<BlockKey, number> {
  const weights = BLOCK_ORDER.map((k) => BASE_WEIGHTS[k] + (FOCUS_BONUS[focus][k] ?? 0));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const steps = Math.max(BLOCK_ORDER.length, Math.round(total / MINUTE_STEP));
  const exact = weights.map((w) => (w / weightSum) * steps);
  const floors = exact.map((x) => Math.max(1, Math.floor(x)));
  let left = steps - floors.reduce((a, b) => a + b, 0);
  const byRemainder = exact.map((x, i) => ({ i, r: x - Math.floor(x) })).sort((a, b) => b.r - a.r);
  const result = [...floors];
  for (let j = 0; left > 0; j = (j + 1) % byRemainder.length, left--) result[byRemainder[j].i] += 1;
  for (let i = result.length - 1; left < 0; i = (i - 1 + result.length) % result.length) {
    if (result[i] > 1) {
      result[i] -= 1;
      left++;
    }
  }
  return Object.fromEntries(BLOCK_ORDER.map((k, i) => [k, result[i] * MINUTE_STEP])) as Record<BlockKey, number>;
}

/* ---------------- Dựng lộ trình ---------------- */

export interface RoadmapWeek {
  /** 1-based */
  n: number;
  /** 1-based */
  phase: number;
  title: string;
  /** Tuần củng cố: lặp lại đơn vị của tuần trước khi lộ trình dài hơn số đơn vị. */
  review: boolean;
  grammar: string[];
  dictations: string[];
  sounds: string[];
  quizSets: string[];
  prompts: string[];
  milestone: string;
  targetSeconds: number;
  /** Tuần nên ghi âm cùng một đề để so sánh tiến bộ. */
  recordCheckpoint: boolean;
}

export interface Roadmap {
  weeks: RoadmapWeek[];
  minutes: Record<BlockKey, number>;
  talkMinutes: number;
  warnings: string[];
}

const uniq = <T,>(xs: T[]): T[] => [...new Set(xs)];

function unitsFor(profile: RoadmapProfile): RoadmapUnit[] {
  const start = profile.level === "B1" ? B1_SKIP_UNITS : 0;
  const wanted = profile.weeks > CORE_UNIT_COUNT ? profile.weeks : CORE_UNIT_COUNT;
  return ROADMAP_UNITS.slice(start, start + wanted);
}

/** Tuần thứ i (0-based) nhận các đơn vị nào. */
function unitRange(i: number, unitCount: number, weekCount: number): [number, number] {
  if (unitCount >= weekCount) {
    return [Math.floor((i * unitCount) / weekCount), Math.floor(((i + 1) * unitCount) / weekCount)];
  }
  const u = Math.floor((i * unitCount) / weekCount);
  return [u, u + 1];
}

function checkpointWeeks(weekCount: number): Set<number> {
  return new Set([1, Math.round(weekCount / 3), Math.round((2 * weekCount) / 3), weekCount]);
}

export function buildRoadmap(profile: RoadmapProfile): Roadmap {
  const units = unitsFor(profile);
  const W = profile.weeks;
  const checkpoints = checkpointWeeks(W);
  let prevStart = -1;

  const weeks = Array.from({ length: W }, (_, i): RoadmapWeek => {
    const [from, to] = unitRange(i, units.length, W);
    const picked = units.slice(from, to);
    const review = from === prevStart;
    prevStart = from;
    const phase = Math.floor((i * PHASE_COUNT) / W) + 1;
    const last = picked[picked.length - 1];
    return {
      n: i + 1,
      phase,
      title: review ? `Củng cố: ${last.title}` : picked.map((u) => u.title).join(" · "),
      review,
      grammar: uniq(picked.flatMap((u) => u.grammar)),
      dictations: uniq(picked.flatMap((u) => u.dictations)),
      sounds: uniq(picked.flatMap((u) => u.sounds)),
      quizSets: uniq(picked.flatMap((u) => u.quizSets ?? [])),
      prompts: uniq(picked.flatMap((u) => u.prompts[profile.goal] ?? u.prompts.daily)),
      milestone: review ? `Làm lại cột mốc tuần trước, nói dài hơn và ít ngập ngừng hơn` : last.milestone,
      targetSeconds: PHASE_TARGET_SECONDS[phase - 1],
      recordCheckpoint: checkpoints.has(i + 1),
    };
  });

  const warnings: string[] = [];
  if (profile.level === "A1" && W === 8) warnings.push("8 tuần khá gấp với trình độ A1: mỗi tuần có 1–2 chủ đề, nên học 60 phút/ngày trở lên.");
  if (profile.minutesPerDay < 45 && W === 8) warnings.push("Học dưới 45 phút/ngày trong 8 tuần sẽ khó theo kịp. Cân nhắc chọn 12 tuần.");

  return {
    weeks,
    minutes: allocateMinutes(profile.minutesPerDay, profile.focus),
    talkMinutes: profile.minutesPerDay <= 45 ? 20 : 30,
    warnings,
  };
}

/* ---------------- Theo dõi tiến độ ---------------- */

/** Tuần hiện tại (1-based), 0 nếu chưa bắt đầu, weeks+1 nếu đã qua hết. */
export function currentWeekNumber(startDate: string, today: string, weekCount: number): number {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const now = new Date(`${today}T00:00:00`).getTime();
  if (Number.isNaN(start) || Number.isNaN(now)) return 0;
  const days = Math.round((now - start) / MS_PER_DAY);
  if (days < 0) return 0;
  return Math.min(Math.floor(days / 7) + 1, weekCount + 1);
}

/** Ngày đầu và cuối của tuần n, dạng "d/m". */
export function weekDateRange(startDate: string, n: number): string {
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return "";
  const a = new Date(start.getTime() + (n - 1) * 7 * MS_PER_DAY);
  const b = new Date(a.getTime() + 6 * MS_PER_DAY);
  const f = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${f(a)} – ${f(b)}`;
}

export const sessionKey = (week: number, session: number) => `${week}-${session}`;

export interface WeekProgress {
  sessionsDone: number;
  talkDone: boolean;
  milestoneDone: boolean;
  grammarDone: number;
  dictationsDone: number;
}

/** Ghép nhật ký tự tích với tiến độ học thật trong app (lý thuyết, quiz, nghe chép). */
export function weekProgress(week: RoadmapWeek, log: RoadmapLog, progress: ProgressState): WeekProgress {
  let sessionsDone = 0;
  for (let s = 1; s <= SESSIONS_PER_WEEK; s++) if (log.sessions[sessionKey(week.n, s)]) sessionsDone++;
  return {
    sessionsDone,
    talkDone: !!log.talks[week.n],
    milestoneDone: !!log.milestones[week.n],
    grammarDone: week.grammar.filter((slug) => topicStatus(progress.topics[slug], hasDictation(slug)) === "done").length,
    dictationsDone: week.dictations.filter((id) => (progress.dictations[id]?.best ?? 0) >= PASS_PERCENT).length,
  };
}

export function roadmapSummary(roadmap: Roadmap, log: RoadmapLog) {
  const weekNums = roadmap.weeks.map((w) => w.n);
  const sessions = weekNums.reduce((sum, n) => {
    let c = 0;
    for (let s = 1; s <= SESSIONS_PER_WEEK; s++) if (log.sessions[sessionKey(n, s)]) c++;
    return sum + c;
  }, 0);
  return {
    sessions,
    sessionsTotal: weekNums.length * SESSIONS_PER_WEEK,
    talks: weekNums.filter((n) => log.talks[n]).length,
    milestones: weekNums.filter((n) => log.milestones[n]).length,
    weeks: weekNums.length,
  };
}

/* ---------------- Kiểm tra dữ liệu đọc từ localStorage ---------------- */

const isDate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const oneOf = <T,>(v: unknown, options: readonly T[]): v is T => options.includes(v as T);

export function parseProfile(raw: unknown): RoadmapProfile | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (!oneOf(r.level, LEVEL_OPTIONS) || !oneOf(r.goal, GOAL_OPTIONS) || !oneOf(r.focus, FOCUS_OPTIONS)) return undefined;
  if (!oneOf(r.minutesPerDay, MINUTE_OPTIONS) || !oneOf(r.weeks, WEEK_OPTIONS) || !isDate(r.startDate)) return undefined;
  return { level: r.level, goal: r.goal, focus: r.focus, minutesPerDay: r.minutesPerDay, weeks: r.weeks, startDate: r.startDate };
}

function pickRecord<T>(raw: unknown, isValue: (v: unknown) => v is T): Record<string, T> {
  if (!raw || typeof raw !== "object") return {};
  return Object.fromEntries(Object.entries(raw as Record<string, unknown>).filter((e): e is [string, T] => isValue(e[1])));
}
const isBool = (v: unknown): v is boolean => typeof v === "boolean";
const isSeconds = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 3600;
const isNote = (v: unknown): v is string => typeof v === "string" && v.length <= 500;

export function parseLog(raw: unknown): RoadmapLog {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    sessions: pickRecord(r.sessions, isBool),
    talks: pickRecord(r.talks, isBool),
    milestones: pickRecord(r.milestones, isBool),
    seconds: pickRecord(r.seconds, isSeconds),
    notes: pickRecord(r.notes, isNote),
  };
}
