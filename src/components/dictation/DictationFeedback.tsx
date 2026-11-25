"use client";

import { ArrowRight, CheckCircle2, Eye } from "lucide-react";
import type { DictationExercise } from "@/content/types";
import { maskWord, type DictationCheck } from "@/core/dictation";
import { SpeakButton } from "@/components/ui/SpeakButton";

/** Phản hồi sau khi kiểm tra: chưa đúng → các từ bị che; đã đúng / xem đáp án → câu đầy đủ và nút câu tiếp. */
export function DictationFeedback({
  sentence,
  result,
  solved,
  revealed,
  firstTry,
  isLast,
  rate,
  hinted,
  onNext,
}: {
  sentence: DictationExercise["sentences"][number];
  result: DictationCheck;
  solved: boolean;
  revealed: boolean;
  firstTry: boolean;
  isLast: boolean;
  rate: number;
  hinted: Set<number>;
  onNext: () => void;
}) {
  if (solved) {
    return (
      <div className="space-y-3">
        <div className={`flex items-center gap-2 font-bold ${revealed && !result.passed ? "text-warning" : "text-success"}`}>
          {revealed && !result.passed ? <Eye className="size-5" /> : <CheckCircle2 className="size-5" />}
          {revealed && !result.passed ? "Đáp án" : firstTry ? "Hoàn hảo ngay lần đầu! 🎉" : "Chính xác!"}
        </div>
        <div className="flex items-start gap-2">
          <SpeakButton text={sentence.text} rate={rate} />
          <div>
            <p className="text-lg font-semibold">{sentence.text}</p>
            <p className="text-sm text-muted">{sentence.vi}</p>
          </div>
        </div>
        {result.nearTokens > 0 && !revealed && (
          <p className="text-sm text-warning">Có {result.nearTokens} lỗi chính tả nhỏ — xem các từ màu vàng bên dưới.</p>
        )}
        {!revealed && <WordFeedback result={result} hinted={hinted} />}
        <button type="button" onClick={onNext} className="btn-success w-full py-3 sm:w-auto sm:px-8">
          {isLast ? "Xem kết quả" : "Câu tiếp theo"} <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">
          Đúng {result.correctTokens}/{result.totalTokens} từ
        </span>
        <span className="text-muted">Sửa lại các từ bị che rồi kiểm tra tiếp</span>
      </div>
      <WordFeedback result={result} hinted={hinted} />
      {result.extras.length > 0 && (
        <p className="text-sm text-danger">
          Từ thừa: <span className="font-mono line-through">{result.extras.join(" ")}</span>
        </p>
      )}
    </div>
  );
}

/** Hiển thị câu gốc: từ đúng hiện ra, từ sai/thiếu bị che ***, từ gợi ý hiện màu xanh. */
function WordFeedback({ result, hinted }: { result: DictationCheck; hinted: Set<number> }) {
  return (
    <p className="flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-lg leading-relaxed">
      {result.words.map((w, i) => {
        if (w.status === "correct") return <span key={i} className="text-success">{w.display}</span>;
        if (w.status === "near")
          return (
            <span key={i} className="text-warning underline decoration-wavy underline-offset-4" title={`Bạn gõ: ${w.typed}`}>
              {w.display}
            </span>
          );
        if (hinted.has(i)) return <span key={i} className="rounded bg-primary-soft px-1 text-primary">{w.display}</span>;
        return (
          <span
            key={i}
            className={`rounded px-1 ${w.status === "missing" ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"}`}
            title={w.status === "missing" ? "Thiếu từ" : `Sai: ${w.typed}`}
          >
            {maskWord(w.display)}
          </span>
        );
      })}
    </p>
  );
}
