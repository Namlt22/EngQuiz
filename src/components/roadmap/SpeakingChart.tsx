import type { RoadmapWeek } from "@/lib/roadmap";
import { PHASE_STYLES } from "./labels";

const W = 640;
const H = 220;
const PAD = { left: 40, right: 8, top: 16, bottom: 26 };
const MAX_SECONDS = 360;
const TICK_STEP = 60;

/** Cột = số giây nói liên tục người học ghi lại mỗi tuần; vạch đứt = mục tiêu của giai đoạn. */
export function SpeakingChart({ weeks, seconds }: { weeks: RoadmapWeek[]; seconds: Record<string, number> }) {
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const y = (v: number) => PAD.top + plotH - (Math.min(v, MAX_SECONDS) / MAX_SECONDS) * plotH;
  const slot = plotW / weeks.length;
  const barW = Math.min(28, slot * 0.55);
  const ticks = Array.from({ length: MAX_SECONDS / TICK_STEP + 1 }, (_, i) => i * TICK_STEP);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[520px]" role="img" aria-label="Số giây nói liên tục từng tuần so với mục tiêu">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted font-mono text-[11px]">
              {t === 0 ? "0" : `${t / 60}p`}
            </text>
          </g>
        ))}
        {weeks.map((w, i) => {
          const x = PAD.left + i * slot;
          const v = seconds[w.n] ?? 0;
          const style = PHASE_STYLES[w.phase - 1];
          return (
            <g key={w.n}>
              <line
                x1={x + 4}
                x2={x + slot - 4}
                y1={y(w.targetSeconds)}
                y2={y(w.targetSeconds)}
                className="stroke-muted"
                strokeWidth={2}
                strokeDasharray="4 3"
              />
              {v > 0 && (
                <>
                  <rect x={x + (slot - barW) / 2} y={y(v)} width={barW} height={PAD.top + plotH - y(v)} rx={4} className={style.fill} />
                  <text x={x + slot / 2} y={y(v) - 5} textAnchor="middle" className="fill-fg font-mono text-[10.5px]">
                    {v}s
                  </text>
                </>
              )}
              <text x={x + slot / 2} y={H - 8} textAnchor="middle" className="fill-muted font-mono text-[11px]">
                T{w.n}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
