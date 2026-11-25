/**
 * Dữ liệu điền sẵn khi lưu một từ / cụm vào Sổ tay từ bài học (hàm thuần):
 *  - sentenceWith: câu trong bài chứa từ đó (làm ví dụ);
 *  - lookupWord: nghĩa + phiên âm nếu từ có trong bộ từ của app (vocab-en / HSK).
 */
import { getEnWord } from "@/content/vocab-en";
import { getHskWord } from "@/content/zh/vocab";
import { vocabVi } from "@/content/zh/vocab-vi";
import type { CourseCode } from "./course";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function sentenceWith(text: string, term: string, course: CourseCode): string | undefined {
  const t = term.trim();
  if (!t) return undefined;
  const sentences = (course === "zh" ? text.match(/[^。！？!?]+[。！？!?]?/g) : text.match(/[^.!?]+[.!?]*/g)) ?? [];
  const re = course === "zh" ? null : new RegExp(`(^|[^\\p{L}])${escape(t)}($|[^\\p{L}])`, "iu");
  const hit = sentences.find((s) => (re ? re.test(s) : s.includes(t)));
  return hit?.trim();
}

export function lookupWord(term: string, course: CourseCode): { meaning?: string; reading?: string } {
  const t = term.trim();
  if (course === "zh") {
    const w = getHskWord(t);
    const vi = vocabVi(t);
    return { ...(vi ? { meaning: vi[1] } : {}), ...(w ? { reading: w.pinyin } : {}) };
  }
  const w = getEnWord(t.toLowerCase());
  return w ? { meaning: w[3], reading: w[2] } : {};
}
