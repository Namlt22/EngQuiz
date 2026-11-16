/**
 * Gộp dữ liệu học trên trình duyệt với dữ liệu trong database (khi đăng nhập lần đầu trên một máy,
 * hoặc khi hai tab/thiết bị cùng ghi). Nguyên tắc: không bao giờ làm mất thành tích —
 * điểm lấy cao nhất, bài đã hoàn thành giữ nguyên, hồ sơ lộ trình ưu tiên bản trong database.
 */
import type { CourseData, CoursesData, LearnerData } from "./learner-schema";
import { EXTRA_COURSES } from "./course";
import type { DictationProgress, ProgressState, TopicProgress } from "./progress-calc";
import { buildRoadmap, type RoadmapLog } from "./roadmap";
import { buildDays, remapTasks } from "./roadmap-days";

const maxOpt = (a?: number, b?: number) => (a === undefined ? b : b === undefined ? a : Math.max(a, b));

function mergeKeys<V>(a: Record<string, V>, b: Record<string, V>, merge: (x: V | undefined, y: V | undefined) => V): Record<string, V> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return Object.fromEntries([...keys].map((k) => [k, merge(a[k], b[k])]));
}

function mergeTopic(a: TopicProgress = {}, b: TopicProgress = {}): TopicProgress {
  const out: TopicProgress = {};
  if (a.theoryRead || b.theoryRead) out.theoryRead = true;
  const quizBest = maxOpt(a.quizBest, b.quizBest);
  if (quizBest !== undefined) out.quizBest = quizBest;
  const dictationBest = maxOpt(a.dictationBest, b.dictationBest);
  if (dictationBest !== undefined) out.dictationBest = dictationBest;
  return out;
}

/** Điểm cao nhất và số câu đã làm nhiều nhất lấy riêng từng bên (XP đọc theo mẫu tính theo `done` — không được tụt). */
function mergeDictation(a?: DictationProgress, b?: DictationProgress): DictationProgress {
  if (!a) return b as DictationProgress;
  if (!b) return a;
  const best = a.best >= b.best ? a : b;
  return { ...best, done: Math.max(a.done, b.done) };
}

export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const later = (a.lastActiveDate ?? "") >= (b.lastActiveDate ?? "") ? a : b;
  const speaking = mergeKeys(a.speaking ?? {}, b.speaking ?? {}, mergeDictation);
  const reading = mergeKeys(a.reading ?? {}, b.reading ?? {}, mergeDictation);
  const dialogues = mergeKeys(a.dialogues ?? {}, b.dialogues ?? {}, mergeDictation);
  return {
    version: 1,
    topics: mergeKeys(a.topics, b.topics, mergeTopic),
    dictations: mergeKeys(a.dictations, b.dictations, mergeDictation),
    // Bỏ trường khi rỗng để bản gộp trùng khớp với bản cũ chưa có luyện nói / reading / hội thoại.
    ...(Object.keys(speaking).length ? { speaking } : {}),
    ...(Object.keys(reading).length ? { reading } : {}),
    ...(Object.keys(dialogues).length ? { dialogues } : {}),
    xp: Math.max(a.xp, b.xp),
    streak: later.streak,
    ...(later.lastActiveDate ? { lastActiveDate: later.lastActiveDate } : {}),
    activity: mergeKeys(a.activity, b.activity, (x = 0, y = 0) => Math.max(x, y)),
  };
}

export function mergeRoadmapLog(a: RoadmapLog, b: RoadmapLog): RoadmapLog {
  const or = (x?: boolean, y?: boolean) => !!(x || y);
  return {
    sessions: mergeKeys(a.sessions, b.sessions, or),
    tasks: mergeKeys(a.tasks, b.tasks, or),
    talks: mergeKeys(a.talks, b.talks, or),
    milestones: mergeKeys(a.milestones, b.milestones, or),
    seconds: mergeKeys(a.seconds, b.seconds, (x = 0, y = 0) => Math.max(x, y)),
    notes: mergeKeys(a.notes, b.notes, (x = "", y = "") => (x.length >= y.length ? x : y)),
  };
}

/** Gộp một khoá học. `remote` = bản trong database, `local` = bản trên trình duyệt. */
export function mergeCourseData(remote: CourseData, local: CourseData): CourseData {
  // Id bài trong nhật ký theo vị trí của lịch học: máy này dùng hồ sơ khác bản trên server
  // thì chuyển tiến độ của máy này sang lịch của server trước khi gộp, để không tích nhầm bài.
  const localLog =
    remote.roadmap && local.roadmap && !sameData(remote.roadmap, local.roadmap)
      ? remapTasks(buildDays(buildRoadmap(local.roadmap)), buildDays(buildRoadmap(remote.roadmap)), local.roadmapLog)
      : local.roadmapLog;
  return {
    progress: mergeProgress(remote.progress, local.progress),
    roadmap: remote.roadmap ?? local.roadmap,
    roadmapLog: mergeRoadmapLog(remote.roadmapLog, localLog),
  };
}

/** Gộp toàn bộ: tiếng Anh ở các trường gốc, từng khoá khác trong `courses`. */
export function mergeLearnerData(remote: LearnerData, local: LearnerData): LearnerData {
  const { courses: rc = {}, ...rEn } = remote;
  const { courses: lc = {}, ...lEn } = local;
  const courses: CoursesData = {};
  for (const code of EXTRA_COURSES) {
    const r = rc[code];
    const l = lc[code];
    const merged = r && l ? mergeCourseData(r, l) : (r ?? l);
    if (merged) courses[code] = merged;
  }
  return { ...mergeCourseData(rEn, lEn), ...(Object.keys(courses).length ? { courses } : {}) };
}

/** So sánh nội dung (không phụ thuộc thứ tự khóa) để biết có cần ghi lên server không. */
export function sameData(a: unknown, b: unknown): boolean {
  return stableStringify(a) === stableStringify(b);
}

function stableStringify(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  if (v && typeof v === "object") {
    const entries = Object.entries(v as Record<string, unknown>)
      .filter(([, x]) => x !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : 1));
    return `{${entries.map(([k, x]) => `${JSON.stringify(k)}:${stableStringify(x)}`).join(",")}}`;
  }
  return JSON.stringify(v);
}
