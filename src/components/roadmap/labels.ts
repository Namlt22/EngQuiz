import type { BlockKey, RoadmapFocus, RoadmapGoal, RoadmapLevel } from "@/lib/roadmap";

export const LEVEL_LABELS: Record<RoadmapLevel, { title: string; hint: string }> = {
  A1: { title: "A1 · Mới bắt đầu", hint: "Biết vài từ, câu đơn giản" },
  A2: { title: "A2 · Sơ trung cấp", hint: "Hiểu ngữ pháp cơ bản nhưng chưa nói được" },
  B1: { title: "B1 · Trung cấp", hint: "Nói được ít, hay ngập ngừng" },
};

export const GOAL_LABELS: Record<RoadmapGoal, { title: string; hint: string; headline: string }> = {
  daily: { title: "Giao tiếp hằng ngày", hint: "Bạn bè, đời sống, sở thích", headline: "giao tiếp hằng ngày" },
  work: { title: "Công việc", hint: "Đồng nghiệp, họp, giới thiệu công việc", headline: "giao tiếp trong công việc" },
  travel: { title: "Du lịch", hint: "Khách sạn, hỏi đường, gọi món", headline: "giao tiếp khi du lịch" },
};

export const FOCUS_LABELS: Record<RoadmapFocus, { title: string; hint: string }> = {
  speaking: { title: "Nói", hint: "Hiểu nhưng không bật ra được câu" },
  listening: { title: "Nghe", hint: "Người ta nói nhanh là không theo kịp" },
  grammar: { title: "Ngữ pháp", hint: "Hay nói sai thì, sai cấu trúc" },
};

export const BLOCK_LABELS: Record<BlockKey, { title: string; how: string }> = {
  ipa: { title: "Phát âm", how: "Học âm của tuần, nghe mẫu và đọc theo" },
  dictation: { title: "Nghe & chép", how: "Làm 1 bài nghe chép của tuần" },
  shadowing: { title: "Shadowing", how: "Nghe từng câu trong bài vừa chép rồi nói đuổi theo ngay, bắt chước ngữ điệu" },
  speaking: { title: "Tự nói, ghi âm", how: "Chọn 1 đề, nói và ghi âm, nghe lại để tìm lỗi" },
  grammar: { title: "Ngữ pháp", how: "Đọc lý thuyết hoặc làm quiz của chủ điểm tuần này" },
};

/** Màu theo giai đoạn 1, 2, 3 (lớp Tailwind, đều có biến thể tối). */
export const PHASE_STYLES = [
  { name: "Phá băng, mở miệng nói", text: "text-teal-600 dark:text-teal-300", bg: "bg-teal-500", soft: "bg-teal-50 dark:bg-teal-500/10", ring: "ring-teal-500", fill: "fill-teal-500" },
  { name: "Kể chuyện, xử lý tình huống", text: "text-sky-600 dark:text-sky-300", bg: "bg-sky-500", soft: "bg-sky-50 dark:bg-sky-500/10", ring: "ring-sky-500", fill: "fill-sky-500" },
  { name: "Nêu ý kiến, nói trôi chảy", text: "text-violet-600 dark:text-violet-300", bg: "bg-violet-500", soft: "bg-violet-50 dark:bg-violet-500/10", ring: "ring-violet-500", fill: "fill-violet-500" },
] as const;

export const PHASE_GOALS = [
  "Nói tròn câu ngắn về bản thân mà không cần dịch trong đầu.",
  "Kể lại sự việc trong quá khứ, xử lý các tình huống ngoài đời.",
  "Nêu và bảo vệ ý kiến, nói nhiều phút không đứt mạch.",
] as const;

/** 20 câu cứu nguy — thuộc trong tuần đầu. */
export const RESCUE_PHRASES = [
  "Sorry, could you say that again?",
  "Could you speak more slowly, please?",
  "What does … mean?",
  "How do you say … in English?",
  "Let me think…",
  "I mean…",
  "I'm not sure, but I think…",
  "Do you mean…?",
  "That's interesting! Tell me more.",
  "What about you?",
  "Really? Why?",
  "I agree. / I'm not sure I agree.",
  "In my opinion…",
  "For example…",
  "Sorry, I don't understand.",
  "Can you give me an example?",
  "It's on the tip of my tongue.",
  "Anyway…",
  "Nice talking to you!",
  "See you next time.",
] as const;

export function formatSeconds(s: number): string {
  if (s < 60) return `${s} giây`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m} phút ${r} giây` : `${m} phút`;
}
