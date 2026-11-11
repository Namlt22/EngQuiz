import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <div className="text-6xl font-black text-primary">404</div>
      <h1 className="text-xl font-bold">Không tìm thấy trang</h1>
      <p className="text-muted">Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>
      <Link href="/" className="btn-primary mt-2">Về trang chủ</Link>
    </div>
  );
}
