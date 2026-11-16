import type { NextConfig } from "next";

/**
 * Header bảo mật cho mọi trang. CSP ở đây chưa giới hạn script (Next.js và script chọn theme
 * dùng inline script); chỉ chặn nhúng trang vào iframe (clickjacking), plugin và đổi <base>.
 */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
];

/**
 * Dev server chặn tài nguyên dev (HMR, chunk) khi trang được mở bằng hostname khác `localhost`.
 * Cho phép thêm hostname trong AUTH_URL — vd IP LAN do `npm run setup:lan` đặt — để máy khác cùng mạng dùng được.
 */
function devOriginsFromAuthUrl(): string[] {
  try {
    const host = new URL(process.env.AUTH_URL ?? "").hostname;
    return host && host !== "localhost" ? [host] : [];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Không phát hành source map ra trình duyệt: DevTools chỉ thấy JS đã nén, không thấy mã TypeScript gốc.
  productionBrowserSourceMaps: false,
  // Không lộ "X-Powered-By: Next.js".
  poweredByHeader: false,
  compiler: {
    // Bỏ console.log/info/debug khỏi bản production (giữ error, warn để còn lần lỗi).
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  allowedDevOrigins: devOriginsFromAuthUrl(),
  async headers() {
    const AUDIO_CACHE_SECONDS = 7 * 24 * 60 * 60;
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // File ghi âm không đổi nội dung: cho trình duyệt giữ 7 ngày, không hỏi lại server mỗi lần bấm nghe.
      { source: "/audio/:path*", headers: [{ key: "Cache-Control", value: `public, max-age=${AUDIO_CACHE_SECONDS}` }] },
    ];
  },
};

export default nextConfig;
