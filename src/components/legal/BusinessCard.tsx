import { readBusinessInfo, safeNoticeUrl, shown } from "@/lib/business";

/** Bảng thông tin chủ sở hữu website (trang /legal). Ẩn hẳn khi chưa điền thông tin nào trong .env. */
export function BusinessCard() {
  const b = readBusinessInfo();
  if (!Object.values(b).some(Boolean)) return null;
  const notice = safeNoticeUrl(b.noticeUrl);
  const rows: [string, string][] = [
    ["Người bán, chủ sở hữu website", shown(b.name)],
    ["Mã số thuế", shown(b.taxCode)],
    ["Địa chỉ", shown(b.address)],
    ["Email", shown(b.email)],
    ["Điện thoại", shown(b.phone)],
  ];
  return (
    <section className="card space-y-3 p-5" aria-label="Thông tin chủ sở hữu">
      <h2 className="text-lg font-bold">Thông tin người bán</h2>
      <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[180px_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {notice && (
        <a href={notice} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-primary hover:underline">
          Đã thông báo website với Bộ Công Thương ↗
        </a>
      )}
    </section>
  );
}
