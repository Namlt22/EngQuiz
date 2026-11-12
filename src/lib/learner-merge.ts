/**
 * Gộp dữ liệu học trên trình duyệt với dữ liệu trong database (khi đăng nhập lần đầu trên một máy,
 * hoặc khi hai tab/thiết bị cùng ghi). Nguyên tắc: không bao giờ làm mất thành tích —
 * điểm lấy cao nhất, ô đã tích giữ nguyên, hồ sơ lộ trình ưu tiên bản trong database.
 */
import type { LearnerData } from "./learner-schema";
import type { DictationProgress, ProgressState, TopicProgress } from "./progress-calc";
import type { RoadmapLog } from "./roadmap";

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

function mergeDictation(a?: DictationProgress, b?: DictationProgress): DictationProgress {
  if (!a) return b as DictationProgress;
  if (!b) return a;
  return a.best >= b.best ? a : b;
}

export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const later = (a.lastActiveDate ?? "") >= (b.lastActiveDate ?? "") ? a : b;
  const speaking = mergeKeys(a.speaking ?? {}, b.speaking ?? {}, mergeDictation);
  return {
    version: 1,
    topics: mergeKeys(a.topics, b.topics, mergeTopic),
    dictations: mergeKeys(a.dictations, b.dictations, mergeDictation),
    // Bỏ trường khi rỗng để bản gộp trùng khớp với bản cũ chưa có luyện nói.
    ...(Object.keys(speaking).length ? { speaking } : {}),
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
    talks: mergeKeys(a.talks, b.talks, or),
    milestones: mergeKeys(a.milestones, b.milestones, or),
    seconds: mergeKeys(a.seconds, b.seconds, (x = 0, y = 0) => Math.max(x, y)),
    notes: mergeKeys(a.notes, b.notes, (x = "", y = "") => (x.length >= y.length ? x : y)),
  };
}

/** `remote` = bản trong database, `local` = bản trên trình duyệt. */
export function mergeLearnerData(remote: LearnerData, local: LearnerData): LearnerData {
  return {
    progress: mergeProgress(remote.progress, local.progress),
    roadmap: remote.roadmap ?? local.roadmap,
    roadmapLog: mergeRoadmapLog(remote.roadmapLog, local.roadmapLog),
  };
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
