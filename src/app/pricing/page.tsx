import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus, Sparkles } from "lucide-react";
import { PlanPicker } from "@/components/billing/PlanPicker";
import { AI_DAILY_LIMIT, AI_TRIAL_TURNS, formatVnd, GUEST_TRIAL_ITEMS, perMonth, PLANS } from "@/lib/plans";
import { REFUND_MAX_AI_TURNS, REFUND_WINDOW_DAYS } from "@/lib/legal-policy";

export const metadata: Metadata = {
  title: "Bảng giá gói AI",
  description: "Học miễn phí toàn bộ lý thuyết, quiz, nghe chép. Mua gói AI để được chấm và sửa bài nói tiếng Anh.",
};

type Cell = boolean | string;
const ROWS: { label: string; guest: Cell; free: Cell; ai: Cell }[] = [
  { label: "Lý thuyết, quiz, nghe chép, luyện nói theo mẫu", guest: `Thử ${GUEST_TRIAL_ITEMS} bài`, free: "Không giới hạn", ai: "Không giới hạn" },
  { label: "Bảng phát âm IPA", guest: true, free: true, ai: true },
  { label: "Lộ trình học cá nhân", guest: "Trong lượt thử", free: true, ai: true },
  { label: "Lưu tiến độ, học trên nhiều thiết bị", guest: false, free: true, ai: true },
  { label: "AI chấm & sửa lỗi bài nói tự do", guest: false, free: `Tặng ${AI_TRIAL_TURNS} lượt`, ai: `${AI_DAILY_LIMIT} lượt/ngày` },
];

function Value({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto size-5 text-success" aria-label="Có" />;
  if (v === false) return <Minus className="mx-auto size-5 text-muted" aria-label="Không" />;
  return <span className="text-sm">{v}</span>;
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Thanh toán như thế nào?",
    a: "Chọn gói → quét mã QR bằng app ngân hàng (số tiền và nội dung chuyển khoản đã điền sẵn). Giữ nguyên nội dung chuyển khoản để hệ thống nhận ra đơn của bạn.",
  },
  {
    q: "Bao lâu thì gói được kích hoạt?",
    a: "Gói được kích hoạt sau khi EngQuiz đối soát chuyển khoản, thường trong vài giờ (giờ hành chính). Bạn nhận email khi gói bắt đầu, và trang thanh toán cũng tự cập nhật.",
  },
  {
    q: "Mua thêm khi gói còn hạn thì sao?",
    a: "Thời gian được cộng dồn: gói mới bắt đầu tính từ ngày gói hiện tại hết hạn, bạn không mất ngày nào.",
  },
  {
    q: `Vì sao giới hạn ${AI_DAILY_LIMIT} lượt AI mỗi ngày?`,
    a: `Mỗi lượt AI chấm tốn chi phí thật. ${AI_DAILY_LIMIT} lượt/ngày là thoải mái cho việc luyện nói đều đặn; lượt mới có lại lúc 0 giờ.`,
  },
  {
    q: "Gói có tự gia hạn không?",
    a: "Không. EngQuiz không lưu thẻ và không tự trừ tiền. Hết hạn thì gói tự dừng, muốn dùng tiếp bạn mua gói mới.",
  },
  {
    q: "Có được hoàn tiền không?",
    a: `Được hoàn 100% nếu bạn yêu cầu trong ${REFUND_WINDOW_DAYS} ngày kể từ khi kích hoạt và chưa dùng quá ${REFUND_MAX_AI_TURNS} lượt AI. Chi tiết ở trang Thanh toán, gia hạn & hoàn tiền.`,
  },
  {
    q: "Hết hạn gói thì dữ liệu học có mất không?",
    a: "Không. Tiến độ, lộ trình và mọi tính năng không dùng AI vẫn dùng miễn phí như tài khoản thường.",
  },
];

export default function PricingPage() {
  const cheapest = Math.min(...PLANS.map(perMonth));
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="space-y-3 text-center">
        <span className="chip mx-auto bg-primary-soft text-primary">
          <Sparkles className="size-3.5" /> Gói AI
        </span>
        <h1 className="text-3xl font-extrabold md:text-4xl">Học miễn phí. Nâng cấp khi muốn AI sửa bài nói.</h1>
        <p className="mx-auto max-w-2xl text-muted">
          Tài khoản miễn phí mở toàn bộ lý thuyết, quiz, nghe chép và luyện nói theo mẫu. Gói AI thêm phần chấm điểm và sửa từng lỗi khi bạn nói tự do — chỉ từ{" "}
          <b className="text-fg">{formatVnd(cheapest)}/tháng</b>.
        </p>
      </header>

      <section className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-line text-sm">
              <th className="p-4 font-semibold text-muted">Tính năng</th>
              <th className="p-4 text-center font-semibold">Khách</th>
              <th className="p-4 text-center font-semibold">Tài khoản miễn phí</th>
              <th className="bg-primary-soft p-4 text-center font-semibold text-primary">Gói AI</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <td className="p-4 text-sm">{r.label}</td>
                <td className="p-4 text-center"><Value v={r.guest} /></td>
                <td className="p-4 text-center"><Value v={r.free} /></td>
                <td className="bg-primary-soft/40 p-4 text-center font-semibold"><Value v={r.ai} /></td>
              </tr>
            ))}
            <tr>
              <td className="p-4 text-sm font-semibold">Giá</td>
              <td className="p-4 text-center text-sm">0đ</td>
              <td className="p-4 text-center text-sm">
                0đ ·{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Tạo tài khoản
                </Link>
              </td>
              <td className="bg-primary-soft/40 p-4 text-center text-sm font-semibold">từ {formatVnd(cheapest)}/tháng</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Chọn thời hạn gói AI</h2>
        <PlanPicker />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Câu hỏi thường gặp</h2>
        <div className="space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="card group p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
