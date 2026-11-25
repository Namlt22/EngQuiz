/** Từ loại (viết tắt) dùng trong dữ liệu từ vựng tiếng Việt. */
export type Pos = "n" | "v" | "adj" | "adv" | "pron" | "num" | "mw" | "part" | "conj" | "prep" | "interj" | "prefix" | "suffix" | "phrase";

/** [từ loại, nghĩa tiếng Việt, âm Hán-Việt theo từng chữ ("" nếu không có)] */
export type VocabEntry = [pos: Pos, vi: string, hanViet: string];

export const POS_LABEL: Record<Pos, string> = {
  n: "danh từ",
  v: "động từ",
  adj: "tính từ",
  adv: "phó từ",
  pron: "đại từ",
  num: "số từ",
  mw: "lượng từ",
  part: "trợ từ",
  conj: "liên từ",
  prep: "giới từ",
  interj: "thán từ",
  prefix: "tiền tố",
  suffix: "hậu tố",
  phrase: "cụm từ",
};
