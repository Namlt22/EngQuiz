/**
 * Chia mỗi tuần của lộ trình thành 7 ngày học cụ thể (Day 1, Day 2, …):
 *  - ngày 1–6: danh sách bài trong EngQuiz (lý thuyết, quiz, nghe chép, đọc theo mẫu, phát âm, nói tự do),
 *    mỗi bài có link học ngay và TỰ HOÀN THÀNH khi người học làm xong hoạt động tương ứng;
 *  - ngày 7: KIỂM TRA CUỐI TUẦN — đọc hiểu, nhập vai hội thoại, nói tự do về chủ đề tuần; cũng tự chấm.
 * Một ngày hoàn thành khi mọi bài trong ngày đã xong; một tuần (và cột mốc của tuần) hoàn thành khi xong cả 7 ngày.
 * Người học KHÔNG tự tích ô nào — mọi trạng thái đều do app ghi nhận. Hàm thuần — kiểm thử được.
 */
import { getTopicMeta } from "@/content/catalog";
import { getDialogue } from "@/content/dialogues";
import { getDictation } from "@/content/dictations";
import { IPA_MAP } from "@/content/ipa";
import { getReading } from "@/content/readings";
import { getSentenceSet, sentenceSetsFor } from "@/content/sentence-practice";
import { promptIdByText } from "@/content/speaking-prompts";
import { getQuizSet, topicSetId } from "./quiz-sets";
import { SESSIONS_PER_WEEK, type Roadmap, type RoadmapLog, type RoadmapWeek } from "./roadmap";

export type TaskKind = "theory" | "quiz" | "dictation" | "read" | "sound" | "talk" | "quizset" | "reading" | "dialogue" | "sentence";

export interface RoadmapTask {
  /** Duy nhất trong lộ trình: "tuần-ngày-thứ tự" */
  id: string;
  kind: TaskKind;
  /** Khóa tài nguyên — hoạt động nào xong thì báo khóa này (xem resourceKey) */
  key: string;
  title: string;
  /** Mô tả ngắn: làm gì thì được tính là xong */
  hint: string;
  href: string;
  minutes: number;
  /** Bài lặp lại để ôn */
  review?: boolean;
}

export interface RoadmapDay {
  week: number;
  /** 1–7 trong tuần */
  day: number;
  /** Số thứ tự ngày trong cả lộ trình: Day 1, Day 2, … */
  n: number;
  /** study = ngày học; checkpoint = ngày 7, kiểm tra cuối tuần */
  kind: "study" | "checkpoint";
  tasks: RoadmapTask[];
  /** Nhãn ngắn của ngày trên bản đồ (bỏ trống thì tự suy ra từ bài chính) */
  label?: string;
}

export const DAYS_PER_WEEK = SESSIONS_PER_WEEK + 1;
export const resourceKey = (kind: TaskKind, ref: string) => `${kind}:${ref}`;

const MIN_TASKS_PER_DAY = 2;
const MINUTES: Record<TaskKind, number> = { theory: 10, quiz: 8, dictation: 12, read: 10, sound: 5, talk: 8, quizset: 15, reading: 12, dialogue: 12, sentence: 8 };

type Draft = Omit<RoadmapTask, "id">;

function draft(kind: TaskKind, ref: string, review = false): Draft | null {
  const base = { kind, key: resourceKey(kind, ref), minutes: MINUTES[kind], ...(review ? { review: true } : {}) };
  switch (kind) {
    case "theory": {
      const t = getTopicMeta(ref)?.title ?? ref;
      return { ...base, title: `Lý thuyết: ${t}`, hint: "Đọc hết bài đến cuối trang", href: `/grammar/${ref}` };
    }
    case "quiz": {
      const t = getTopicMeta(ref)?.title ?? ref;
      return { ...base, title: `${review ? "Ôn quiz" : "Quiz"}: ${t}`, hint: "Đạt từ 80% trở lên", href: `/quiz/${topicSetId(ref)}` };
    }
    case "dictation":
      return { ...base, title: `${review ? "Nghe chép lại" : "Nghe chép"}: ${getDictation(ref)?.title ?? ref}`, hint: "Đạt từ 80% trở lên", href: `/dictation/${ref}` };
    case "read":
      return {
        ...base,
        title: `Đọc theo mẫu: ${getDictation(ref)?.title ?? ref}`,
        hint: "Nghe rồi đọc to từng câu, đạt từ 80%",
        href: `/speaking?set=${encodeURIComponent(ref)}`,
      };
    case "sound": {
      const s = IPA_MAP[ref];
      return { ...base, title: `Phát âm /${s?.symbol ?? ref}/`, hint: "Nghe âm, đọc theo từ ví dụ, đạt bài nghe phân biệt", href: `/ipa/${ref}` };
    }
    case "talk": {
      const id = promptIdByText(ref);
      if (!id) return null;
      return {
        ...base,
        key: resourceKey("talk", id),
        title: `${review ? "Nói lại, dài hơn" : "Nói tự do"}: “${ref}”`,
        hint: "Ghi âm câu trả lời (có thể nhờ AI chấm & sửa)",
        href: `/speaking?tab=talk&prompt=${id}`,
      };
    }
    case "quizset":
      return { ...base, title: `Quiz tổng hợp: ${getQuizSet(ref)?.title ?? ref}`, hint: "Đạt từ 80% trở lên", href: `/quiz/${ref}` };
    case "reading": {
      const r = getReading(ref);
      return r ? { ...base, title: `Đọc hiểu: ${r.title}`, hint: "Trả lời câu hỏi đọc hiểu, đạt từ 80%", href: `/reading/${ref}` } : null;
    }
    case "dialogue": {
      const d = getDialogue(ref);
      return d ? { ...base, title: `Hội thoại: ${d.title}`, hint: "Nhập vai rồi làm bài tập hội thoại, đạt từ 80%", href: `/dialogues/${ref}` } : null;
    }
    case "sentence":
      return sentenceDraft(ref);
  }
}

/** Nhiệm vụ "Đặt câu" (dùng cho cả hai khoá — id bộ câu đã gồm tiền tố khoá). */
export function sentenceDraft(setId: string): Draft | null {
  const set = getSentenceSet(setId);
  if (!set) return null;
  const href = `${set.course === "zh" ? "/zh" : ""}/sentences/${set.id}`;
  return { kind: "sentence", key: resourceKey("sentence", set.id), minutes: MINUTES.sentence, title: `Đặt câu: ${set.title}`, hint: "Đạt từ 80% trở lên", href };
}

/** Bộ đặt câu của tuần thứ `week` (1-based) trong lộ trình tiếng Anh: lần lượt theo cấp độ, hết thì quay vòng. */
export function enSentenceSetForWeek(week: number): string {
  const sets = sentenceSetsFor("en");
  return sets[(week - 1) % sets.length].id;
}

/**
 * Ngày 7 — kiểm tra cuối tuần, mọi bài đều tự chấm: bài đọc và hội thoại của tuần, rồi nói tự do đề cuối tuần.
 * Tuần không có bài đọc / hội thoại thì kiểm tra bằng quiz tổng hợp hoặc quiz các chủ điểm của tuần.
 */
export function weekCheckpoint(week: RoadmapWeek): Draft[] {
  const tasks: (Draft | null)[] = [
    ...week.readings.slice(0, 1).map((id) => draft("reading", id)),
    ...week.conversations.slice(0, 1).map((id) => draft("dialogue", id)),
  ];
  if (!tasks.length) tasks.push(...(week.quizSets.length ? week.quizSets.map((id) => draft("quizset", id, true)) : week.grammar.map((slug) => draft("quiz", slug, true))));
  const lastPrompt = week.prompts[week.prompts.length - 1];
  if (lastPrompt) tasks.push(draft("talk", lastPrompt, true));
  return tasks.filter((t): t is Draft => t !== null);
}


/** Chia tài nguyên của một tuần cho 6 ngày học: 5 ngày học mới + ngày 6 ôn tập. */
export function weekStudyDays(week: RoadmapWeek): Draft[][] {
  const NEW_DAYS = SESSIONS_PER_WEEK - 1;
  const days: (Draft | null)[][] = Array.from({ length: SESSIONS_PER_WEEK }, () => []);

  const load = Array.from({ length: SESSIONS_PER_WEEK }, () => 0);
  const put = (d: number, ...tasks: (Draft | null)[]) => {
    days[d].push(...tasks);
    load[d] += tasks.reduce((sum, t) => sum + (t?.minutes ?? 0), 0);
  };
  /** Ngày nhẹ nhất (ít phút nhất) trong khoảng [from, to]; bằng nhau thì lấy ngày sớm hơn. */
  const lightest = (from: number, to: number) => {
    let best = from;
    for (let d = from + 1; d <= to; d++) if (load[d] < load[best]) best = d;
    return best;
  };

  // Phát âm: một âm mỗi ngày, xoay vòng — bài khởi động ngắn.
  if (week.sounds.length) for (let d = 0; d < NEW_DAYS; d++) put(d, draft("sound", week.sounds[d % week.sounds.length], d >= week.sounds.length));

  // Ngữ pháp: lý thuyết + quiz cùng ngày, các chủ điểm trải đều 5 ngày theo đúng thứ tự (vd 3 chủ điểm → ngày 1, 3, 5).
  week.grammar.forEach((slug, k) => put(Math.min(NEW_DAYS - 1, Math.floor(((k + 0.5) * NEW_DAYS) / week.grammar.length)), draft("theory", slug), draft("quiz", slug)));

  // Các bài còn lại xếp lần lượt vào ngày nhẹ nhất (ít phút nhất), vẫn giữ thứ tự học:
  //  - nghe chép trước, đọc theo mẫu cùng bộ câu vào một ngày sau đó (nghe trước, nói sau);
  //  - nói tự do từ ngày 2, khi đã có ngữ pháp & mẫu câu.
  let lastDictation = 0;
  let lastTalk = 1;
  const rounds = Math.max(week.dictations.length, week.prompts.length);
  for (let k = 0; k < rounds; k++) {
    const id = week.dictations[k];
    if (id) {
      const d = (lastDictation = lightest(lastDictation, NEW_DAYS - 2));
      put(d, draft("dictation", id));
      put(lightest(d + 1, NEW_DAYS - 1), draft("read", id));
    }
    const prompt = week.prompts[k];
    if (prompt) put((lastTalk = lightest(lastTalk, NEW_DAYS - 1)), draft("talk", prompt));
  }

  // Ngày 6 — ôn tập: quiz tổng hợp (nếu có), làm lại quiz từng chủ điểm, nói lại đề đầu tiên dài hơn.
  const review = days[SESSIONS_PER_WEEK - 1];
  week.quizSets.forEach((id) => review.push(draft("quizset", id)));
  week.grammar.forEach((slug) => review.push(draft("quiz", slug, true)));
  if (week.prompts[0]) review.push(draft("talk", week.prompts[0], true));

  // Ngày ít bài (tuần có ít tài nguyên) → thêm bài ôn: nghe chép lại, rồi nói lại đề của tuần.
  const fillers = [
    ...week.dictations.map((id) => draft("dictation", id, true)),
    ...week.prompts.map((p) => draft("talk", p, true)),
  ].filter((t): t is Draft => t !== null);
  let next = 0;
  const out = days.map((raw) => {
    const list = raw.filter((t): t is Draft => t !== null);
    while (list.length < MIN_TASKS_PER_DAY && fillers.length) list.push(fillers[next++ % fillers.length]);
    return list;
  });
  // Ngày 6 — thêm một bộ Đặt câu, đặt CUỐI ngày để id các bài có sẵn không đổi (xem settleAddedTasks).
  const sentence = sentenceDraft(enSentenceSetForWeek(week.n));
  if (sentence) out[SESSIONS_PER_WEEK - 1].push(sentence);
  return out;
}

/** Toàn bộ ngày học của lộ trình (7 ngày mỗi tuần). */
export function buildDays(roadmap: Roadmap): RoadmapDay[] {
  return roadmap.weeks.flatMap((week) => {
    const study = weekStudyDays(week).map(
      (drafts, i): RoadmapDay => ({
        week: week.n,
        day: i + 1,
        n: (week.n - 1) * DAYS_PER_WEEK + i + 1,
        kind: "study",
        tasks: drafts.map((t, j) => ({ ...t, id: `${week.n}-${i + 1}-${j + 1}` })),
      }),
    );
    const checkpoint: RoadmapDay = {
      week: week.n,
      day: DAYS_PER_WEEK,
      n: week.n * DAYS_PER_WEEK,
      kind: "checkpoint",
      tasks: weekCheckpoint(week).map((t, j) => ({ ...t, id: `${week.n}-${DAYS_PER_WEEK}-${j + 1}` })),
    };
    return [...study, checkpoint];
  });
}

/* ---------------- Trạng thái hoàn thành (chỉ do app ghi nhận) ---------------- */

export const taskDone = (log: RoadmapLog, task: RoadmapTask) => !!log.tasks[task.id];

/** Ngày xong khi mọi bài trong ngày đã xong. Ô tự tích của bản cũ (sessions, talks) không còn được tính. */
export function dayDone(log: RoadmapLog, day: RoadmapDay): boolean {
  return day.tasks.length > 0 && day.tasks.every((t) => taskDone(log, t));
}

/** Tuần xong — và đạt cột mốc của tuần — khi xong cả 7 ngày, kể cả bài kiểm tra cuối tuần. */
export function weekDone(log: RoadmapLog, days: RoadmapDay[], week: number): boolean {
  const own = days.filter((d) => d.week === week);
  return own.length > 0 && own.every((d) => dayDone(log, d));
}

/**
 * Ghi lần nói tự do dài nhất (giây) vào tuần người học đang học (tuần của ngày học tiếp theo,
 * hoặc tuần cuối nếu đã xong lộ trình). Trả về chính `log` nếu không dài hơn kỷ lục của tuần.
 */
export function recordSpeakingSeconds(days: RoadmapDay[], log: RoadmapLog, seconds: number, maxSeconds = 3600): RoadmapLog {
  if (!days.length || !Number.isFinite(seconds) || seconds <= 0) return log;
  const week = String((nextOpenDay(days, log) ?? days[days.length - 1]).week);
  const value = Math.min(Math.round(seconds), maxSeconds);
  if ((log.seconds[week] ?? 0) >= value) return log;
  return { ...log, seconds: { ...log.seconds, [week]: value } };
}

export const dayTasksDone = (log: RoadmapLog, day: RoadmapDay) => day.tasks.filter((t) => taskDone(log, t)).length;

/** Ngày học tiếp theo: ngày đầu tiên chưa xong (theo thứ tự Day 1, 2, …). */
export const nextOpenDay = (days: RoadmapDay[], log: RoadmapLog) => days.find((d) => !dayDone(log, d));

/**
 * Người học vừa làm xong một hoạt động (khóa `key`) → đánh dấu bài CHƯA XONG SỚM NHẤT có khóa đó.
 * Bài lặp lại (ôn tập) vì vậy chỉ được tính khi làm lại lần nữa. Trả về nhật ký mới, hoặc chính `log` nếu không có gì đổi.
 * `preferredId`: bài người học vừa mở từ lộ trình — nếu đúng khóa và chưa xong thì tích chính bài đó (vd mở bài ôn tập ở Day 6).
 */
export function completeResource(days: RoadmapDay[], log: RoadmapLog, key: string, preferredId?: string): RoadmapLog {
  const tick = (id: string): RoadmapLog => ({ ...log, tasks: { ...log.tasks, [id]: true } });
  if (preferredId && !log.tasks[preferredId]) {
    const preferred = days.flatMap((d) => d.tasks).find((t) => t.id === preferredId);
    if (preferred?.key === key) return tick(preferred.id);
  }
  for (const day of days) {
    const task = day.tasks.find((t) => t.key === key && !taskDone(log, t));
    if (task) return tick(task.id);
  }
  return log;
}

/**
 * Đổi hồ sơ lộ trình (trình độ, mục tiêu, số tuần…) làm bài dời vị trí, mà id bài theo vị trí (tuần-ngày-thứ tự).
 * Chuyển tiến độ theo BÀI HỌC: mỗi bài đã xong ở lịch cũ tích bài chưa xong sớm nhất cùng khóa ở lịch mới.
 * Bài không còn trong lịch mới thì bỏ; các mục khác của nhật ký (số giây nói…) giữ nguyên.
 */
export function remapTasks(oldDays: RoadmapDay[], newDays: RoadmapDay[], log: RoadmapLog): RoadmapLog {
  const markers = Object.fromEntries(Object.entries(log.tasks).filter(([id]) => id.startsWith(MARKER_PREFIX)));
  let next: RoadmapLog = { ...log, tasks: markers };
  for (const task of oldDays.flatMap((d) => d.tasks)) {
    if (taskDone(log, task)) next = completeResource(newDays, next, task.key);
  }
  return next;
}

/* ---------------- Bài mới thêm vào lộ trình có sẵn ---------------- */

/** Mục đánh dấu trong log.tasks (không phải id bài): "đã chuyển dữ liệu cho đợt thêm bài này". */
const MARKER_PREFIX = "v:";
export const SENTENCE_TASKS_MARKER = `${MARKER_PREFIX}sentence-tasks`;

/**
 * Lộ trình vừa được thêm bài Đặt câu (cuối một số ngày). Ngày người học ĐÃ XONG trước đợt thêm
 * không được mở lại: bài mới ở ngày đó coi như đã xong. Ngày chưa xong thì phải làm cả bài mới.
 * Chỉ chạy một lần cho mỗi nhật ký (đánh dấu SENTENCE_TASKS_MARKER, đồng bộ cùng nhật ký giữa các máy).
 */
export function settleAddedTasks(days: RoadmapDay[], log: RoadmapLog): RoadmapLog {
  if (log.tasks[SENTENCE_TASKS_MARKER]) return log;
  const tasks: Record<string, boolean> = { ...log.tasks, [SENTENCE_TASKS_MARKER]: true };
  for (const day of days) {
    const old = day.tasks.filter((t) => t.kind !== "sentence");
    if (old.length && old.every((t) => taskDone(log, t))) day.tasks.filter((t) => t.kind === "sentence").forEach((t) => (tasks[t.id] = true));
  }
  return { ...log, tasks };
}
