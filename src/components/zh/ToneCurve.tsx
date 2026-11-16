import type { Tone } from "@/core/pinyin";

/**
 * Đường cao độ của thanh điệu theo thang 5 bậc (Chao): thanh 1 = 55, thanh 2 = 35, thanh 3 = 214, thanh 4 = 51.
 * Bậc 5 ở trên cùng, bậc 1 ở dưới cùng.
 */
const CONTOURS: Record<Exclude<Tone, 5>, number[]> = { 1: [5, 5], 2: [3, 5], 3: [2, 1, 4], 4: [5, 1] };

export function ToneCurve({ tone, className = "h-10 w-16" }: { tone: Tone; className?: string }) {
  const W = 64;
  const H = 40;
  const y = (level: number) => H - 4 - ((level - 1) / 4) * (H - 8);
  if (tone === 5) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="Thanh nhẹ: ngắn, nhẹ">
        <circle cx={W / 2} cy={y(2.5)} r={4} className="fill-current" />
      </svg>
    );
  }
  const pts = CONTOURS[tone];
  const step = (W - 12) / (pts.length - 1);
  const d = pts.map((lv, i) => `${i ? "L" : "M"}${6 + i * step},${y(lv)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`Đường giọng thanh ${tone}: ${pts.join("")}`}>
      {[1, 2, 3, 4, 5].map((lv) => (
        <line key={lv} x1={2} x2={W - 2} y1={y(lv)} y2={y(lv)} className="stroke-line" strokeWidth={0.75} />
      ))}
      <path d={d} className="stroke-current" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
