/**
 * Các cấp HSK của khoá tiếng Trung (docs/PLAN-ZH.md mục 1 & 5).
 *
 * Nguồn số liệu:
 *  - words: 新版HSK考试大纲 (đề cương thi HSK mới, công bố 11/2025), số từ CỘNG DỒN đến hết cấp.
 *  - chars, syllables, grammarPoints: GF 0025-2021 《国际中文教育中文水平等级标准》.
 *    chars / syllables là số cộng dồn; grammarPoints là số điểm ngữ pháp MỚI của riêng cấp đó.
 * Khi có danh mục chính thức trong src/content/zh/data, test sẽ đối chiếu các con số này.
 */
export type HskLevel = 1 | 2 | 3 | 4;
export const HSK_LEVELS: HskLevel[] = [1, 2, 3, 4];

export interface HskLevelInfo {
  level: HskLevel;
  name: string;
  /** Mục tiêu giao tiếp khi xong cấp */
  canDo: string;
  words: number;
  chars: number;
  syllables: number;
  grammarPoints: number;
  /** Tuần trong lộ trình chuẩn (45 phút/ngày, bắt đầu từ con số 0) */
  weeks: [from: number, to: number];
  gradient: string;
}

export const HSK_INFO: Record<HskLevel, HskLevelInfo> = {
  1: {
    level: 1,
    name: "HSK 1 · Sơ cấp 1",
    canDo: "Giới thiệu bản thân, hỏi giá, gọi món, nói ngày giờ bằng câu ngắn.",
    words: 300,
    chars: 300,
    syllables: 269,
    grammarPoints: 48,
    weeks: [3, 10],
    gradient: "from-rose-500 to-red-500",
  },
  2: {
    level: 2,
    name: "HSK 2 · Sơ cấp 2",
    canDo: "Kể việc đã làm, hỏi đường, hẹn lịch, nói về thời tiết và sức khoẻ.",
    words: 500,
    chars: 600,
    syllables: 468,
    grammarPoints: 81,
    weeks: [11, 16],
    gradient: "from-orange-500 to-amber-500",
  },
  3: {
    level: 3,
    name: "HSK 3 · Sơ cấp 3",
    canDo: "Kể chuyện ngắn, nêu ý kiến, viết câu bằng chữ Hán về đời sống hằng ngày.",
    words: 1000,
    chars: 900,
    syllables: 608,
    grammarPoints: 81,
    weeks: [17, 28],
    gradient: "from-emerald-500 to-teal-500",
  },
  4: {
    level: 4,
    name: "HSK 4 · Trung cấp 1",
    canDo: "Trao đổi công việc, đọc bài ngắn về xã hội, viết đoạn khoảng 80 chữ.",
    words: 2000,
    chars: 1200,
    syllables: 724,
    grammarPoints: 76,
    weeks: [29, 40],
    gradient: "from-sky-500 to-indigo-500",
  },
};

/** Chặng nhập môn trước HSK 1: pinyin, thanh điệu, nét và bộ thủ. */
export const ZH_INTRO_STAGE = {
  name: "Nhập môn",
  weeks: [1, 2] as [number, number],
  canDo: "Đọc đúng mọi âm tiết pinyin và 4 thanh; viết đúng thứ tự nét; nhận 30 chữ đầu tiên.",
};
