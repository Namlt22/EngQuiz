import { READ_ALOUD_PASS } from "@/core/speaking";

/** Điểm 0–100 với màu theo mức: đạt (xanh), khá (vàng), cần luyện (đỏ). */
export function scoreTone(score: number): string {
  if (score >= READ_ALOUD_PASS) return "bg-success-soft text-success";
  if (score >= 50) return "bg-warning-soft text-warning";
  return "bg-danger-soft text-danger";
}

export function ScoreBadge({ score, label }: { score: number; label?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 rounded-xl px-3 py-1.5 font-bold ${scoreTone(score)}`}>
      <span className="text-2xl">{score}%</span>
      {label && <span className="text-sm">{label}</span>}
    </span>
  );
}
