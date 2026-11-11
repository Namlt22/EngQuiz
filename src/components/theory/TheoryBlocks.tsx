import { CheckCircle2, Lightbulb, Search, XCircle } from "lucide-react";
import type { FormulaPart, TheoryBlock, TimelineItem } from "@/content/types";
import { SpeakButton } from "@/components/ui/SpeakButton";

const ROLE_CLASS: Record<FormulaPart["role"], string> = {
  subject: "bg-role-subject/12 text-role-subject ring-role-subject/30",
  aux: "bg-role-aux/12 text-role-aux ring-role-aux/30",
  verb: "bg-role-verb/12 text-role-verb ring-role-verb/30",
  object: "bg-role-object/12 text-role-object ring-role-object/30",
  other: "bg-transparent text-fg ring-transparent",
};

export function RoleLegend() {
  const items: [FormulaPart["role"], string][] = [
    ["subject", "Chủ ngữ"],
    ["aux", "Trợ động từ / to be"],
    ["verb", "Động từ chính"],
    ["object", "Tân ngữ / bổ ngữ"],
  ];
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {items.map(([role, label]) => (
        <span key={role} className={`rounded-md px-2 py-0.5 font-medium ring-1 ${ROLE_CLASS[role]}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children, id }: { title?: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="card p-5 md:p-6" id={id}>
      {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
      {children}
    </section>
  );
}

function Timeline({ items, caption }: { items: TimelineItem[]; caption?: string }) {
  const x = (v: number) => `${((v + 1) / 2) * 100}%`;
  return (
    <Section title="Dòng thời gian">
      <div className="relative mx-2 mb-2 mt-10 h-14">
        <div className="absolute inset-x-0 top-6 h-0.5 rounded bg-line" />
        <div className="absolute top-3 h-6 w-0.5 bg-danger" style={{ left: "50%" }} />
        <span className="absolute top-10 -translate-x-1/2 text-xs font-semibold text-danger" style={{ left: "50%" }}>
          NOW
        </span>
        <span className="absolute left-0 top-10 text-xs text-muted">Quá khứ</span>
        <span className="absolute right-0 top-10 text-xs text-muted">Tương lai</span>
        {items.map((it, i) => {
          if (it.kind === "point")
            return (
              <div key={i} className="absolute top-6 -translate-x-1/2 -translate-y-1/2" style={{ left: x(it.at) }}>
                <div className="size-4 rounded-full bg-primary ring-4 ring-primary/20" />
                {it.label && (
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary-soft px-1.5 py-0.5 text-xs font-semibold text-primary">
                    {it.label}
                  </span>
                )}
              </div>
            );
          const from = it.at;
          const to = it.to ?? it.at;
          if (it.kind === "span")
            return (
              <div
                key={i}
                className="absolute top-[18px] h-3 rounded-full bg-primary/70"
                style={{ left: x(from), width: `calc(${x(to)} - ${x(from)})` }}
              >
                {it.label && (
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary-soft px-1.5 py-0.5 text-xs font-semibold text-primary">
                    {it.label}
                  </span>
                )}
              </div>
            );
          const n = 7;
          return (
            <div key={i}>
              {Array.from({ length: n }, (_, k) => {
                const v = from + ((to - from) * k) / (n - 1);
                return (
                  <span
                    key={k}
                    className="absolute top-6 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center text-xl font-black leading-none text-primary"
                    style={{ left: x(v) }}
                  >
                    ×
                  </span>
                );
              })}
              {it.label && (
                <span
                  className="absolute -top-2 -translate-x-1/2 rounded bg-primary-soft px-1.5 py-0.5 text-xs font-semibold text-primary"
                  style={{ left: x((from + to) / 2 + 0.25) }}
                >
                  {it.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {caption && <p className="mt-4 text-center text-sm text-muted">{caption}</p>}
    </Section>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[480px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="border-b border-line bg-surface-2 px-3 py-2 text-left font-semibold first:rounded-tl-lg last:rounded-tr-lg">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={`border-b border-line px-3 py-2.5 align-top ${j === 0 ? "font-medium" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TheoryBlockView({ block }: { block: TheoryBlock }) {
  switch (block.type) {
    case "summary":
      return (
        <div className="rounded-2xl border border-primary/20 bg-primary-soft p-5 text-[17px] leading-relaxed">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-primary">Tóm tắt</span>
          {block.text}
        </div>
      );
    case "formula":
      return (
        <Section title={block.title ?? "Công thức"}>
          <div className="mb-4">
            <RoleLegend />
          </div>
          <div className="space-y-4">
            {block.rows.map((row) => (
              <div key={row.label} className="rounded-xl bg-surface-2 p-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{row.label}</div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {row.parts.map((p, i) => (
                    <span
                      key={i}
                      className={`rounded-lg px-2.5 py-1 font-mono text-sm font-semibold ring-1 ${ROLE_CLASS[p.role]} ${
                        p.role === "other" ? "px-1" : ""
                      }`}
                    >
                      {p.t}
                    </span>
                  ))}
                </div>
                {row.example && (
                  <div className="mt-3 flex items-center gap-2 text-[15px] italic">
                    <SpeakButton text={row.example} />
                    {row.example}
                  </div>
                )}
              </div>
            ))}
          </div>
          {block.note && <p className="mt-4 text-sm leading-relaxed text-muted">📝 {block.note}</p>}
        </Section>
      );
    case "usage":
      return (
        <Section title={block.title}>
          {block.text && <p className="mb-3 text-muted">{block.text}</p>}
          <ul className="space-y-3">
            {block.examples.map((ex) => (
              <li key={ex.en} className="flex items-start gap-3">
                <SpeakButton text={ex.en} />
                <div>
                  <p className="text-[16px] font-medium">{ex.en}</p>
                  <p className="text-sm text-muted">{ex.vi}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      );
    case "signals":
      return (
        <Section title={block.title ?? "Dấu hiệu nhận biết"}>
          <div className="flex flex-wrap gap-2">
            {block.words.map((w) => (
              <span key={w} className="inline-flex items-center gap-1 rounded-lg bg-warning-soft px-2.5 py-1 text-sm font-medium text-warning">
                <Search className="size-3.5" /> {w}
              </span>
            ))}
          </div>
        </Section>
      );
    case "timeline":
      return <Timeline items={block.items} caption={block.caption} />;
    case "mistakes":
      return (
        <Section title="⚠️ Lỗi người Việt hay mắc">
          <ul className="space-y-3">
            {block.items.map((m) => (
              <li key={m.wrong} className="rounded-xl border border-line p-4">
                <p className="flex items-start gap-2 text-danger line-through decoration-danger/50">
                  <XCircle className="mt-0.5 size-4 shrink-0" /> {m.wrong}
                </p>
                <p className="mt-1 flex items-start gap-2 font-semibold text-success">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> {m.right}
                </p>
                <p className="mt-2 text-sm text-muted">{m.why}</p>
              </li>
            ))}
          </ul>
        </Section>
      );
    case "compare":
      return (
        <Section title={block.title}>
          <SimpleTable headers={block.headers} rows={block.rows} />
        </Section>
      );
    case "table":
      return (
        <Section title={block.title}>
          <SimpleTable headers={block.headers} rows={block.rows} />
        </Section>
      );
    case "tip":
      return (
        <div className="flex gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-4 text-[15px] leading-relaxed">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-warning" />
          <p>{block.text}</p>
        </div>
      );
  }
}

export function TheoryBlocks({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => (
        <TheoryBlockView key={i} block={b} />
      ))}
    </div>
  );
}

