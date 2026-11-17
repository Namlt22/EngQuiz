/**
 * Lộ trình khoá tiếng Trung — hàm thuần. Dựng ra các ngày cùng kiểu với lộ trình tiếng Anh (RoadmapDay),
 * nên dùng lại được cơ chế tự hoàn thành (completeResource), remapTasks và giao diện RoadmapPath.
 *
 * Hồ sơ dùng chung kiểu RoadmapProfile (để đồng bộ/kiểm tra như tiếng Anh) nhưng chỉ đọc hai trường:
 *  - level "A1" = bắt đầu từ Nhập môn (tuần 1); "A2" = đã biết pinyin, bắt đầu từ HSK 1 (bỏ ZH_INTRO_WEEKS tuần);
 *  - startDate. Các trường còn lại giữ giá trị mặc định, không ảnh hưởng lịch.
 * Khoá nhiệm vụ khớp với các hoạt động báo xong trong src/lib/progress.ts (ZH_TASK_KIND, ZH_VOCAB_TASK_REF).
 */
import { PINYIN_LESSON_MAP } from "@/content/zh/pinyin-lessons";
import { ZH_GRAMMAR_MAP } from "@/content/zh/grammar";
import { ZH_TEXT_MAP } from "@/content/zh/texts";
import { ZH_INTRO_WEEKS, ZH_WEEKS, type ZhWeekPlan } from "@/content/zh/roadmap-zh";
import type { RoadmapProfile, RoadmapWeek } from "./roadmap";
import { DAYS_PER_WEEK, resourceKey, type RoadmapDay, type RoadmapTask, type TaskKind } from "./roadmap-days";

type Draft = Omit<RoadmapTask, "id">;

/** Hồ sơ mặc định của khoá tiếng Trung (chỉ level và startDate có ý nghĩa). */
export function zhProfile(skipIntro: boolean, startDate: string): RoadmapProfile {
  return { level: skipIntro ? "A2" : "A1", goal: "daily", focus: "speaking", minutesPerDay: 45, weeks: 12, startDate };
}

export const zhSkipsIntro = (p: RoadmapProfile) => p.level !== "A1";

const task = (kind: TaskKind, ref: string, title: string, hint: string, href: string, minutes: number, review = false): Draft => ({
  kind,
  key: resourceKey(kind, ref),
  title,
  hint,
  href,
  minutes,
  ...(review ? { review: true } : {}),
});

const pinyinTask = (id: string, review = false) =>
  task("sound", `pinyin-${id}`, `${review ? "Ôn pinyin" : "Pinyin"}: ${PINYIN_LESSON_MAP[id]?.title ?? id}`, "Làm đủ 3 bước, đạt bài luyện tai", `/zh/pinyin/${id}`, 12, review);
const grammarTask = (id: string, review = false) =>
  task("theory", `grammar-${id}`, `${review ? "Ôn ngữ pháp" : "Ngữ pháp"}: ${ZH_GRAMMAR_MAP[id]?.title ?? id}`, "Đọc lý thuyết, làm bài tập đạt từ 80%", `/zh/grammar/${id}`, 15, review);
const dialogueTask = (id: string) => task("dialogue", id, `Hội thoại: ${ZH_TEXT_MAP[id]?.title ?? id}`, "Nghe cả bài, trả lời câu hỏi đạt từ 80%", `/zh/dialogues/${id}`, 12);
const readingTask = (id: string) => task("reading", id, `Bài đọc: ${ZH_TEXT_MAP[id]?.title ?? id}`, "Đọc bài, trả lời câu hỏi đạt từ 80%", `/zh/reading/${id}`, 12);
const dictationTask = (id: string, review = false) =>
  task("dictation", `zh-${id}`, `${review ? "Nghe chép lại" : "Nghe chép"}: ${ZH_TEXT_MAP[id]?.title ?? id}`, "Chép cả bài, điểm trung bình từ 80%", `/zh/dictation/${id}`, 12, review);
const vocabTask = (hsk: number) => task("quizset", "zh-vocab", `Ôn thẻ từ vựng HSK ${hsk}`, "Ôn hết một lượt thẻ của hôm nay", `/zh/vocab?level=${hsk}`, 10);
const charTask = (ch: string) => task("quiz", `hanzi-${ch}`, `Tập viết chữ ${ch}`, "Tự viết đúng thứ tự nét (sai không quá 3 lần)", `/zh/hanzi/${ch.codePointAt(0)!.toString(16)}`, 5);
const radicalsTask = () => task("quiz", "hanzi-radicals", "Chữ Hán: nét, thứ tự nét, bộ thủ", "Đọc bài, qua bài kiểm tra bộ thủ (từ 75%)", "/zh/hanzi", 15);
const mockTask = (id: string) => task("quizset", `mock-${id}`, `Thi thử ${id.toUpperCase()}`, "Làm hết bài thi, đạt từ 60%", `/zh/mock/${id}`, 25);

/** Chia tài nguyên của một tuần thành 6 ngày học. */
function studyDays(w: ZhWeekPlan): Draft[][] {
  const days: Draft[][] = Array.from({ length: DAYS_PER_WEEK - 1 }, () => []);
  if (w.phase === 1) {
    // Nhập môn: chia đều bài pinyin cho 5 ngày đầu, ngày 6 ôn bài khó nhất (bài đầu tuần) + bộ thủ.
    w.pinyin.forEach((id, i) => days[Math.floor((i * 5) / w.pinyin.length)].push(pinyinTask(id)));
    w.chars.forEach((ch, i) => days[i + 1]?.push(charTask(ch)));
    days[5].push(pinyinTask(w.pinyin[0], true));
    if (w.radicals) days[5].push(radicalsTask());
    return days;
  }
  // HSK: ngữ pháp mở tuần, hội thoại giữa tuần, bài đọc cuối tuần; ôn từ vựng mỗi ngày; mỗi ngày một chữ tập viết.
  const [g1, g2] = w.grammar;
  days[0].push(grammarTask(g1));
  if (g2) days[1].push(grammarTask(g2));
  if (w.dialogue) days[g2 ? 2 : 1].push(dialogueTask(w.dialogue));
  if (w.dialogue) days[3].push(dictationTask(w.dialogue));
  if (w.reading) days[4].push(readingTask(w.reading));
  else days[4].push(grammarTask(g1, true));
  if (!g2 && w.dialogue) days[2].push(grammarTask(g1, true));
  w.chars.forEach((ch, i) => days[i]?.push(charTask(ch)));
  days.forEach((d) => w.vocab && d.push(vocabTask(w.hsk ?? 1)));
  // Ngày 6: ôn tập — nghe chép bài đọc (hoặc chép lại hội thoại).
  if (w.reading) days[5].push(dictationTask(w.reading));
  else if (w.dialogue) days[5].push(dictationTask(w.dialogue, true));
  return days;
}

/** Ngày 7 — kiểm tra cuối tuần: làm lại bài khó của tuần (tự chấm); tuần cuối là thi thử. */
function checkpoint(w: ZhWeekPlan): Draft[] {
  if (w.mock) return [mockTask(w.mock)];
  if (w.phase === 1) return w.pinyin.slice(-2).map((id) => pinyinTask(id, true));
  const tasks = w.grammar.map((id) => grammarTask(id, true));
  if (w.dialogue) tasks.push(dictationTask(w.dialogue, true));
  return tasks;
}

/** "Ngữ pháp: Câu chữ 是" → "Câu chữ 是"; tiêu đề không có tiền tố thì giữ nguyên. */
const shortTitle = (title: string) => {
  const i = title.indexOf(": ");
  return i < 0 ? title : title.slice(i + 2);
};

export interface ZhRoadmap {
  weeks: RoadmapWeek[];
  days: RoadmapDay[];
}

function toRoadmapWeek(w: ZhWeekPlan, n: number): RoadmapWeek {
  return {
    n,
    phase: w.phase,
    title: w.title,
    review: false,
    grammar: [],
    dictations: [],
    readings: [],
    conversations: [],
    sounds: [],
    quizSets: [],
    prompts: [],
    milestone: w.milestone,
    targetSeconds: 0,
    recordCheckpoint: false,
  };
}

export function buildZhRoadmap(profile: RoadmapProfile): ZhRoadmap {
  const plans = zhSkipsIntro(profile) ? ZH_WEEKS.slice(ZH_INTRO_WEEKS) : ZH_WEEKS;
  const weeks = plans.map((w, i) => toRoadmapWeek(w, i + 1));
  const days: RoadmapDay[] = [];
  plans.forEach((w, wi) => {
    const week = wi + 1;
    const drafts = [...studyDays(w), checkpoint(w)];
    drafts.forEach((tasks, di) => {
      const day = di + 1;
      days.push({
        week,
        day,
        n: wi * DAYS_PER_WEEK + day,
        kind: day === DAYS_PER_WEEK ? "checkpoint" : "study",
        tasks: tasks.map((t, ti) => ({ ...t, id: `${week}-${day}-${ti + 1}` })),
        // Bài đầu tiên của ngày là bài chính (builder đặt bài mới trước, ôn từ vựng / tập viết sau).
        ...(tasks[0] ? { label: shortTitle(tasks[0].title) } : {}),
      });
    });
  });
  return { weeks, days };
}
