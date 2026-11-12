/**
 * Làm sạch dữ liệu học đọc từ nguồn không tin cậy (localStorage, hoặc bản ghi cũ trong DB):
 * giữ lại phần hợp lệ, bỏ mục sai thay vì vứt cả khối dữ liệu. Kết quả luôn qua được learnerDataSchema.
 */
import { LIMITS, progressSchema, topicProgressSchema, type LearnerData } from "./learner-schema";
import type { DictationProgress, ProgressState, TopicProgress } from "./progress-calc";
import { parseLog, parseProfile } from "./roadmap";

/** Khóa không được dùng làm tên mục (chống prototype pollution khi gộp object). */
export const RESERVED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const isDate = (k: string) => /^\d{4}-\d{2}-\d{2}$/.test(k);
const validKey = (k: string) => k.length > 0 && k.length <= LIMITS.keyLength && !RESERVED_KEYS.has(k);
const clampInt = (v: unknown, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.round(v))) : 0;

function entries(raw: unknown, max: number, keyOk: (k: string) => boolean = validKey): [string, unknown][] {
  return isObj(raw) ? Object.entries(raw).filter(([k]) => keyOk(k)).slice(0, max) : [];
}

function cleanTopic(v: unknown): TopicProgress | undefined {
  const parsed = topicProgressSchema.safeParse(v);
  return parsed.success ? parsed.data : undefined;
}

function cleanDictation(v: unknown): DictationProgress | undefined {
  if (!isObj(v) || typeof v.best !== "number" || v.best < 0 || v.best > 100) return undefined;
  return { best: v.best, done: clampInt(v.done, 100_000), total: clampInt(v.total, 100_000) };
}

function pick<T>(raw: unknown, max: number, clean: (v: unknown) => T | undefined, keyOk?: (k: string) => boolean) {
  const out: Record<string, T> = {};
  for (const [k, v] of entries(raw, max, keyOk)) {
    const c = clean(v);
    if (c !== undefined) out[k] = c;
  }
  return out;
}

export function sanitizeProgress(raw: unknown): ProgressState {
  const r = isObj(raw) ? raw : {};
  const activityDays = Object.keys(isObj(r.activity) ? r.activity : {}).filter(isDate).sort().slice(-LIMITS.activityDays);
  const keepDays = new Set(activityDays);
  const state: ProgressState = {
    version: 1,
    topics: pick(r.topics, LIMITS.topics, cleanTopic),
    dictations: pick(r.dictations, LIMITS.dictations, cleanDictation),
    xp: clampInt(r.xp, LIMITS.maxXp),
    streak: clampInt(r.streak, 100_000),
    activity: pick(r.activity, Number.MAX_SAFE_INTEGER, (v) => clampInt(v, LIMITS.maxXp), (k) => keepDays.has(k)),
  };
  if (typeof r.lastActiveDate === "string" && isDate(r.lastActiveDate)) state.lastActiveDate = r.lastActiveDate;
  return progressSchema.parse(state);
}

export function sanitizeLearnerData(raw: { progress: unknown; roadmap: unknown; roadmapLog: unknown }): LearnerData {
  return {
    progress: sanitizeProgress(raw.progress),
    roadmap: parseProfile(raw.roadmap) ?? null,
    roadmapLog: parseLog(raw.roadmapLog),
  };
}
