import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { CopyValue, OrderStatus } from "@/components/billing/OrderStatus";
import { formatVnd, getPlan } from "@/lib/plans";
import { bankInfo, getOwnOrder, ORDER_EXPIRES_DAYS, toOrderView, vietQrUrl } from "@/server/billing";

export const metadata: Metadata = { title: "Thanh toán gói AI", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function BillingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/signin?callbackUrl=${encodeURIComponent(`/billing/${code}`)}`);
  if (!/^EQ[A-Z0-9]{6}$/.test(code)) notFound();
  const row = await getOwnOrder(session.user.id, code);
  if (!row) notFound();

  const order = toOrderView(row);
  const plan = getPlan(order.plan);
  const bank = bankInfo();
  const payable = order.status === "pending" && !order.expired;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/pricing" className="text-sm font-medium text-muted hover:text-fg">
        ← Bảng giá
      </Link>
      <div className="card space-y-5 p-6 md:p-8">
        <div>
          <h1 className="text-2xl font-extrabold">Thanh toán gói AI {plan?.label ?? `${order.months} tháng`}</h1>
          <p className="mt-1 text-muted">
            Mã đơn <b className="text-fg">{order.code}</b> · {formatVnd(order.amount)}
          </p>
        </div>

        <OrderStatus code={order.code} initialStatus={order.status} expired={order.expired} />

        {payable &&
          (bank ? (
            <div className="grid gap-5 md:grid-cols-[220px_1fr]">
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh QR động từ VietQR */}
              <img
                src={vietQrUrl(bank, order.amount, order.code)}
                alt={`Mã QR chuyển khoản ${formatVnd(order.amount)}, nội dung ${order.code}`}
                width={220}
                height={220}
                className="mx-auto rounded-xl bg-white p-2"
              />
              <div className="space-y-2">
                <p className="text-sm text-muted">Quét mã QR bằng app ngân hàng, hoặc chuyển khoản thủ công với thông tin:</p>
                <CopyValue label="Ngân hàng" value={bank.bank} />
                <CopyValue label="Số tài khoản" value={bank.accountNo} />
                <CopyValue label="Chủ tài khoản" value={bank.accountName} />
                <CopyValue label="Số tiền" value={String(order.amount)} />
                <CopyValue label="Nội dung chuyển khoản (bắt buộc)" value={order.code} />
              </div>
            </div>
          ) : (
            <p className="rounded-xl bg-warning-soft p-3 text-sm">
              Chưa cấu hình tài khoản nhận tiền trên máy chủ. Hãy liên hệ EngQuiz và gửi kèm mã đơn <b>{order.code}</b>.
            </p>
          ))}

        {payable && (
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>
              Giữ nguyên nội dung <b className="text-fg">{order.code}</b> để hệ thống nhận ra đơn của bạn.
            </li>
            <li>Đơn có hiệu lực {ORDER_EXPIRES_DAYS} ngày. Gói được kích hoạt sau khi đối soát, bạn sẽ nhận email xác nhận.</li>
            <li>Đang còn hạn gói? Thời gian mới được cộng dồn vào ngày hết hạn hiện tại.</li>
            <li>
              Gói không tự gia hạn. Điều kiện hoàn tiền xem tại{" "}
              <Link href="/legal/payment" className="font-semibold text-primary hover:underline">
                Thanh toán, gia hạn & hoàn tiền
              </Link>
              .
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
