"use client";

/**
 * Ẩn thanh tab dưới (điện thoại) khi đang làm bài ở các màn hình tiếng Anh mới (game, khoá A1), để thanh tab không che nút
 * "Kiểm tra / Tiếp". Danh sách màn hình làm bài chuẩn nằm trong components/layout/nav-items.ts (khu dùng chung,
 * docs/CODE-AREAS.md) nên không sửa ở đó; component này chỉ chèn CSS khi đang hiển thị.
 */
export function HideBottomNav() {
  return <style>{`@media (max-width: 767px){nav[aria-label="Điều hướng"]{display:none!important}}`}</style>;
}
