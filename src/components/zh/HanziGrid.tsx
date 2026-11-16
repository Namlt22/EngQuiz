"use client";

/** Lưới chữ Hán theo cấp HSK để chọn chữ tập viết; chữ đã viết được tô xanh. Cấp đang xem lưu trên đường dẫn (?level=). */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CHAR_COUNT_BY_LEVEL, charCode, charsAtLevel } from "@/content/zh/hanzi-chars";
import { HSK_LEVELS, type HskLevel } from "@/content/zh/hsk-levels";
import { useProgress } from "@/lib/progress";

function readLevel(v: string | null): HskLevel {
  const n = Number(v);
  return (HSK_LEVELS as number[]).includes(n) ? (n as HskLevel) : 1;
}

export function HanziGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const level = readLevel(params.get("level"));
  const written = useProgress().hanzi ?? "";
  const chars = charsAtLevel(level);
  const doneCount = chars.filter((c) => written.includes(c.char)).length;

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="Cấp HSK" className="flex flex-wrap gap-2">
        {HSK_LEVELS.map((lv) => (
          <button
            key={lv}
            type="button"
            role="tab"
            aria-selected={lv === level}
            onClick={() => router.replace(`/zh/hanzi?level=${lv}#tap-viet`, { scroll: false })}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${lv === level ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"}`}
          >
            HSK {lv} · {CHAR_COUNT_BY_LEVEL[lv]} chữ
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">
        Đã viết được {doneCount}/{chars.length} chữ mới của HSK {level}. Bấm một chữ để xem cách viết và tự viết.
      </p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5">
        {chars.map((c) => {
          const done = written.includes(c.char);
          return (
            <li key={c.char}>
              <Link
                href={`/zh/hanzi/${charCode(c.char)}`}
                lang="zh-Hans"
                aria-label={`${c.char} ${c.readings.join(", ")}${done ? " (đã viết được)" : ""}`}
                className={`grid aspect-square place-items-center rounded-xl border text-2xl transition hover:border-primary ${done ? "border-success/50 bg-success/10" : "border-line bg-surface"}`}
              >
                {c.char}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
