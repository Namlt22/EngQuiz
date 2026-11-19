/**
 * Hiển thị một câu tiếng Trung đã tách từ (src/core/zh-sentence.ts), có thể kèm pinyin trên đầu từng từ.
 * "___" trong câu là chỗ trống của câu hỏi điền từ.
 */
import { tokenize } from "@/core/zh-sentence";

export function ZhText({ text, pinyin = false, className = "" }: { text: string; pinyin?: boolean; className?: string }) {
  const parts = text.trim().split(/\s+/);
  return (
    <span lang="zh-Hans" className={`inline-flex flex-wrap items-end gap-x-0.5 ${className}`}>
      {parts.map((raw, i) => {
        if (raw === "___") {
          return (
            <span key={i} className="mx-1 inline-block w-10 border-b-2 border-primary" aria-label="chỗ trống">
              &nbsp;
            </span>
          );
        }
        const [t] = tokenize(raw);
        if (!pinyin || t.kind === "punct") return <span key={i}>{t.text}</span>;
        return (
          <ruby key={i} className="px-0.5">
            {t.text}
            <rt className="text-[0.55em] font-normal text-muted">{t.pinyin}</rt>
          </ruby>
        );
      })}
    </span>
  );
}

/** Ô chữ có chứa chữ Hán không (để biết lựa chọn trắc nghiệm nào hiển thị bằng ZhText). */
export const hasHan = (s: string) => /\p{Script=Han}/u.test(s);

/** Bỏ dấu cách giữa các chữ Hán trong văn bản thường (bảng so sánh soạn ở dạng tách từ). */
export const compactHan = (s: string) => s.replace(/(?<=[\p{Script=Han}，。？！])\s+(?=[\p{Script=Han}，。？！])/gu, "");
