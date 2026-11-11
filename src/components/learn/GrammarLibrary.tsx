"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import { CATEGORY_LABELS, LEVELS } from "@/content/levels";
import type { Category, LevelCode, TopicMeta } from "@/content/types";
import { LevelBadge } from "@/components/ui/LevelBadge";

/** Bỏ dấu tiếng Việt để tìm "dieu kien" vẫn ra "điều kiện". */
function fold(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

export function GrammarLibrary({ topics, available }: { topics: TopicMeta[]; available: string[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<LevelCode | "ALL">("ALL");
  const [cat, setCat] = useState<Category | "ALL">("ALL");
  const avail = useMemo(() => new Set(available), [available]);

  const filtered = topics.filter(
    (t) =>
      (level === "ALL" || t.level === level) &&
      (cat === "ALL" || t.category === cat) &&
      (!q || fold(`${t.title} ${t.titleEn}`).includes(fold(q))),
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm chủ điểm: if, bị động, hiện tại đơn..."
          className="input pl-12"
          aria-label="Tìm chủ điểm ngữ pháp"
        />
      </div>

      <div className="space-y-2">
        <FilterRow
          value={level}
          onChange={(v) => setLevel(v as LevelCode | "ALL")}
          options={[["ALL", "Tất cả cấp"], ...LEVELS.map((l) => [l.code, l.code] as [string, string])]}
        />
        <FilterRow
          value={cat}
          onChange={(v) => setCat(v as Category | "ALL")}
          options={[["ALL", "Mọi chủ đề"], ...(Object.entries(CATEGORY_LABELS) as [string, string][])]}
        />
      </div>

      <p className="text-sm text-muted">{filtered.length} chủ điểm</p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => {
          const ok = avail.has(t.slug);
          return (
            <li key={t.slug}>
              <Link
                href={`/grammar/${t.slug}`}
                className={`card flex items-center gap-3 p-4 transition hover:shadow-md ${ok ? "" : "opacity-70"}`}
              >
                <LevelBadge level={t.level} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{t.title}</div>
                  <div className="truncate text-xs text-muted">
                    {t.titleEn} · {CATEGORY_LABELS[t.category]}
                  </div>
                </div>
                {!ok && (
                  <span className="chip shrink-0 bg-surface-2 text-muted" title="Đang biên soạn">
                    <Clock className="size-3" />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterRow({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            value === v ? "bg-primary text-primary-fg" : "border border-line bg-surface text-muted hover:text-fg"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
