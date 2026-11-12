// Cho các máy cùng mạng (Wi-Fi/LAN) dùng được EngQuiz: đặt AUTH_URL trong .env thành IP LAN của máy này.
// Link đăng nhập trong email được tạo từ AUTH_URL, nên phải là địa chỉ máy khác truy cập được.
// Chạy: npm run setup:lan                 (tự chọn IP, giữ cổng đang dùng)
//       npm run setup:lan -- 192.168.1.10 (chỉ định IP)
//       npm run setup:lan -- localhost    (quay về chỉ dùng trên máy này)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";

const ENV_FILE = ".env";
const DEFAULT_PORT = "3000";
// Card mạng ảo (WSL, Hyper-V, Docker, VirtualBox, VMware, VPN) — máy khác trong mạng không tới được.
const VIRTUAL_ADAPTER = /vEthernet|WSL|Hyper-V|Docker|VirtualBox|VMware|vboxnet|Loopback|Tailscale|ZeroTier/i;

function lanCandidates() {
  return Object.entries(networkInterfaces()).flatMap(([name, addrs]) =>
    (addrs ?? [])
      .filter((a) => a.family === "IPv4" && !a.internal && !a.address.startsWith("169.254."))
      .map((a) => ({ name, address: a.address, virtual: VIRTUAL_ADAPTER.test(name) })),
  );
}

if (!existsSync(ENV_FILE)) {
  console.error("Chưa có .env — chạy `npm run setup:env` trước.");
  process.exit(1);
}

const env = readFileSync(ENV_FILE, "utf8");
const currentUrl = env.match(/^AUTH_URL=(.*)$/m)?.[1]?.trim();
let port = DEFAULT_PORT;
try {
  if (currentUrl) port = new URL(currentUrl).port || DEFAULT_PORT;
} catch {
  // AUTH_URL hỏng → dùng cổng mặc định
}

const candidates = lanCandidates();
const host = process.argv[2] ?? candidates.find((c) => !c.virtual)?.address;
if (!host) {
  console.error("Không tìm thấy IP mạng LAN. Kiểm tra Wi-Fi/dây mạng, hoặc chỉ định: npm run setup:lan -- <IP>");
  process.exit(1);
}

const url = `http://${host}:${port}`;
const updated = /^AUTH_URL=.*$/m.test(env) ? env.replace(/^AUTH_URL=.*$/m, `AUTH_URL=${url}`) : `${env.trimEnd()}\nAUTH_URL=${url}\n`;
writeFileSync(ENV_FILE, updated);

console.log(`Đã đặt AUTH_URL=${url}`);
if (candidates.length > 1) {
  console.log("Các IP tìm thấy:", candidates.map((c) => `${c.address} (${c.name}${c.virtual ? ", ảo" : ""})`).join(", "));
}
if (host !== "localhost") {
  console.log(`\nTiếp theo:
  1. Khởi động lại server (npm run dev, cổng ${port}).
  2. Mở cổng ${port} trên Windows Firewall (PowerShell "Run as administrator", làm 1 lần):
     New-NetFirewallRule -DisplayName "EngQuiz ${port}" -Direction Inbound -Protocol TCP -LocalPort ${port} -Action Allow -Profile Private
  3. Trên máy khác cùng mạng mở: ${url}`);
}
