/**
 * Schema Zod cho dữ liệu học lưu trong database (bảng LearnerState).
 * Dùng ở API để kiểm tra dữ liệu gửi lên và dữ liệu đọc ra — không tin dữ liệu từ client hay từ DB.
 */
import { z } from "zod";
import {
  FOCUS_OPTIONS,
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  MINUTE_OPTIONS,
  WEEK_OPTIONS,
  type RoadmapFocus,
  type RoadmapGoal,
  type RoadmapLevel,
  type RoadmapWeeks,
} from "./roadmap";

/** Giới hạn để một request không thể làm phình database. */
export const LIMITS = {
  keyLength: 100,
  topics: 200,
  dictations: 500,
  /** Số ngày hoạt động giữ lại (~10 năm); client cắt bớt ngày cũ nhất trước khi gửi. */
  activityDays: 3660,
  logEntries: 400,
  noteLength: 500,
  maxSeconds: 3600,
  maxXp: 10_000_000,
} as const;

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
/** Tên mục: chặn __proto__/constructor/prototype (chống prototype pollution khi gộp object). */
const key = z
  .string()
  .min(1)
  .max(LIMITS.keyLength)
  .refine((k) => k !== "__proto__" && k !== "constructor" && k !== "prototype", { message: "Tên mục không hợp lệ" });
const percent = z.number().min(0).max(100);
const count = z.number().int().min(0).max(100_000);

/** Giá trị phải nằm trong danh sách lựa chọn cho phép. */
function oneOf<T extends string | number>(options: readonly T[]) {
  return z.custom<T>((v) => (options as readonly unknown[]).includes(v), { message: `Phải là một trong: ${options.join(", ")}` });
}

/** Record có giới hạn số khóa. */
function boundedRecord<V extends z.ZodType>(keySchema: z.ZodString, value: V, maxKeys: number) {
  return z.record(keySchema, value).refine((r) => Object.keys(r).length <= maxKeys, { message: `Tối đa ${maxKeys} mục` });
}

export const topicProgressSchema = z.strictObject({
  theoryRead: z.boolean().optional(),
  quizBest: percent.optional(),
  dictationBest: percent.optional(),
});

export const progressSchema = z.strictObject({
  version: z.literal(1),
  topics: boundedRecord(key, topicProgressSchema, LIMITS.topics),
  dictations: boundedRecord(key, z.strictObject({ best: percent, done: count, total: count }), LIMITS.dictations),
  xp: z.number().int().min(0).max(LIMITS.maxXp),
  streak: z.number().int().min(0).max(100_000),
  lastActiveDate: dateKey.optional(),
  activity: boundedRecord(dateKey, z.number().int().min(0).max(LIMITS.maxXp), LIMITS.activityDays),
});

export const roadmapProfileSchema = z.strictObject({
  level: oneOf<RoadmapLevel>(LEVEL_OPTIONS),
  goal: oneOf<RoadmapGoal>(GOAL_OPTIONS),
  focus: oneOf<RoadmapFocus>(FOCUS_OPTIONS),
  minutesPerDay: oneOf<number>(MINUTE_OPTIONS),
  weeks: oneOf<RoadmapWeeks>(WEEK_OPTIONS),
  startDate: dateKey,
});

export const roadmapLogSchema = z.strictObject({
  sessions: boundedRecord(key, z.boolean(), LIMITS.logEntries),
  talks: boundedRecord(key, z.boolean(), LIMITS.logEntries),
  milestones: boundedRecord(key, z.boolean(), LIMITS.logEntries),
  seconds: boundedRecord(key, z.number().min(0).max(LIMITS.maxSeconds), LIMITS.logEntries),
  notes: boundedRecord(key, z.string().max(LIMITS.noteLength), LIMITS.logEntries),
});

export const learnerDataSchema = z.strictObject({
  progress: progressSchema,
  roadmap: roadmapProfileSchema.nullable(),
  roadmapLog: roadmapLogSchema,
});

/** Body của PUT /api/learner. `baseVersion` = version client đã đọc lần cuối (null nếu chưa có bản ghi). */
export const learnerPutSchema = learnerDataSchema.extend({
  baseVersion: z.number().int().min(1).nullable(),
});

export type LearnerData = z.infer<typeof learnerDataSchema>;
export type LearnerPutBody = z.infer<typeof learnerPutSchema>;

/** Dữ liệu trả về từ API: dữ liệu học + version hiện tại trong DB. */
export interface LearnerSnapshot extends LearnerData {
  version: number;
}

/** Phong bì chung cho mọi response của API. */
export type ApiResponse<T> = { success: true; data: T; error: null } | { success: false; data: null; error: string };

/** Response 409 của PUT /api/learner: kèm bản hiện tại trong DB để client gộp rồi ghi lại. */
export type LearnerConflictResponse = { success: false; data: null; error: string; current: LearnerSnapshot | null };
