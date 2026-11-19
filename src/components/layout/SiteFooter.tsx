import Link from "next/link";
import { getLegalDocs, legalHref } from "@/content/legal";

/** Chân trang: chỉ liên kết tới các chính sách & điều khoản. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <nav
        aria-label="Chính sách"
        className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 pb-28 pt-6 text-sm text-muted md:pb-8"
      >
        <Link href="/legal" className="font-semibold text-fg hover:underline">
          Chính sách & điều khoản
        </Link>
        {getLegalDocs().map((d) => (
          <Link key={d.slug} href={legalHref(d.slug)} className="hover:text-fg hover:underline">
            {d.title}
          </Link>
        ))}
        <Link href="/credits" className="hover:text-fg hover:underline">
          Nguồn dữ liệu
        </Link>
      </nav>
    </footer>
  );
}
