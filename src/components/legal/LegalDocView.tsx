import Link from "next/link";
import type { LegalDoc } from "@/content/legal";
import { LEGAL_UPDATED_VI } from "@/lib/legal-policy";

/** Hiển thị một văn bản pháp lý: tiêu đề, ngày cập nhật, mục lục và các mục. */
export function LegalDocView({ doc }: { doc: LegalDoc }) {
  const anchor = (i: number) => `muc-${i + 1}`;
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/legal" className="text-sm font-medium text-muted hover:text-fg">
        ← Chính sách & điều khoản
      </Link>
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold">{doc.title}</h1>
        <p className="text-muted">{doc.summary}</p>
        <p className="text-sm text-muted">Cập nhật lần cuối: {LEGAL_UPDATED_VI}</p>
      </header>

      <nav aria-label="Mục lục" className="card p-4">
        <ol className="space-y-1 text-sm">
          {doc.sections.map((s, i) => (
            <li key={s.heading}>
              <a href={`#${anchor(i)}`} className="text-primary hover:underline">
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {doc.sections.map((s, i) => (
        <section key={s.heading} id={anchor(i)} className="scroll-mt-24 space-y-3">
          <h2 className="text-xl font-bold">{s.heading}</h2>
          {s.blocks.map((b, j) =>
            typeof b === "string" ? (
              <p key={j} className="leading-relaxed">
                {b}
              </p>
            ) : (
              <ul key={j} className="list-disc space-y-1.5 pl-5 leading-relaxed">
                {b.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}
    </article>
  );
}
