// Cho các máy cùng mạng (Wi-Fi/LAN) dùng được EngQuiz qua HTTPS (micro chỉ chạy trên HTTPS hoặc localhost):
//  - đặt AUTH_URL trong .env thành https://<IP LAN>:<cổng> (link đăng nhập trong email trỏ về đây)
//  - tạo chứng chỉ tự ký cho IP đó + localhost trong certificates/ (chỉ tạo lại khi IP đổi)
// Chạy: npm run setup:lan                 (tự chọn IP, giữ cổng đang dùng)
//       npm run setup:lan -- 192.168.1.10 (chỉ định IP)
//       npm run setup:lan -- localhost    (quay về chỉ dùng trên máy này, http://localhost)
// Sau đó chạy server bằng: npm run dev:lan
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { generate } from "selfsigned";

const ENV_FILE = ".env";
const CERT_DIR = "certificates";
const CERT_FILE = `${CERT_DIR}/lan-cert.pem`;
const KEY_FILE = `${CERT_DIR}/lan-key.pem`;
const HOST_FILE = `${CERT_DIR}/lan-host.txt`;
const DEFAULT_PORT = "3000";
const CERT_VALID_DAYS = 365;
// Card mạng ảo (WSL, Hyper-V, Docker, VirtualBox, VMware, VPN) — máy khác trong mạng không tới được.
const VIRTUAL_ADAPTER = /vEthernet|WSL|Hyper-V|Docker|VirtualBox|VMware|vboxnet|Loopback|Tailscale|ZeroTier/i;

function lanCandidates() {
  return Object.entries(networkInterfaces()).flatMap(([name, addrs]) =>
    (addrs ?? [])
      .filter((a) => a.family === "IPv4" && !a.internal && !a.address.startsWith("169.254."))
      .map((a) => ({ name, address: a.address, virtual: VIRTUAL_ADAPTER.test(name) })),
  );
}

function currentPort(env) {
  const url = env.match(/^AUTH_URL=(.*)$/m)?.[1]?.trim();
  if (!url) return DEFAULT_PORT;
  try {
    return new URL(url).port || DEFAULT_PORT;
  } catch {
    console.warn(`AUTH_URL hiện tại không hợp lệ ("${url}") — dùng cổng ${DEFAULT_PORT}.`);
    return DEFAULT_PORT;
  }
}

const isIPv4 = (s) => /^\d{1,3}(\.\d{1,3}){3}$/.test(s) && s.split(".").every((n) => Number(n) <= 255);

/** Tạo chứng chỉ tự ký cho `host` (+ localhost); bỏ qua nếu đã có chứng chỉ đúng host đó. */
async function ensureCertificate(host) {
  const sameHost = existsSync(HOST_FILE) && readFileSync(HOST_FILE, "utf8").trim() === host;
  if (sameHost && existsSync(CERT_FILE) && existsSync(KEY_FILE)) {
    console.log(`Chứng chỉ cho ${host} đã có trong ${CERT_DIR}/ — giữ nguyên.`);
    return;
  }
  const notAfterDate = new Date(Date.now() + CERT_VALID_DAYS * 24 * 60 * 60 * 1000);
  const pems = await generate([{ name: "commonName", value: host }], {
    keySize: 2048,
    algorithm: "sha256",
    notAfterDate,
    extensions: [
      { name: "basicConstraints", cA: false },
      { name: "keyUsage", digitalSignature: true, keyEncipherment: true },
      { name: "extKeyUsage", serverAuth: true },
      {
        name: "subjectAltName",
        altNames: [
          { type: 7, ip: host },
          { type: 2, value: "localhost" },
          { type: 7, ip: "127.0.0.1" },
        ],
      },
    ],
  });
  mkdirSync(CERT_DIR, { recursive: true });
  writeFileSync(CERT_FILE, pems.cert);
  writeFileSync(KEY_FILE, pems.private, { mode: 0o600 });
  writeFileSync(HOST_FILE, host);
  console.log(`Đã tạo chứng chỉ tự ký cho ${host} (hạn ${CERT_VALID_DAYS} ngày) trong ${CERT_DIR}/.`);
}

if (!existsSync(ENV_FILE)) {
  console.error("Chưa có .env — chạy `npm run setup:env` trước.");
  process.exit(1);
}

const env = readFileSync(ENV_FILE, "utf8");
const port = currentPort(env);
const candidates = lanCandidates();
const host = process.argv[2] ?? candidates.find((c) => !c.virtual)?.address;
if (!host) {
  console.error("Không tìm thấy IP mạng LAN. Kiểm tra Wi-Fi/dây mạng, hoặc chỉ định: npm run setup:lan -- <IP>");
  process.exit(1);
}

const isLocal = host === "localhost";
if (!isLocal && !isIPv4(host)) {
  console.error(`"${host}" không phải địa chỉ IPv4. Ví dụ: npm run setup:lan -- 192.168.1.10`);
  process.exit(1);
}

// Tạo chứng chỉ TRƯỚC khi đổi .env: lỗi tạo chứng chỉ thì AUTH_URL giữ nguyên.
if (!isLocal) {
  try {
    await ensureCertificate(host);
  } catch (e) {
    console.error(`Không tạo được chứng chỉ HTTPS: ${e instanceof Error ? e.message : e}. AUTH_URL chưa bị thay đổi.`);
    process.exit(1);
  }
}

const url = `${isLocal ? "http" : "https"}://${host}:${port}`;
const updated = /^AUTH_URL=.*$/m.test(env) ? env.replace(/^AUTH_URL=.*$/m, `AUTH_URL=${url}`) : `${env.trimEnd()}\nAUTH_URL=${url}\n`;
writeFileSync(ENV_FILE, updated);
console.log(`Đã đặt AUTH_URL=${url}`);
if (candidates.length > 1) {
  console.log("Các IP tìm thấy:", candidates.map((c) => `${c.address} (${c.name}${c.virtual ? ", ảo" : ""})`).join(", "));
}

if (isLocal) {
  console.log("\nChạy server bằng: npm run dev");
} else {
  console.log(`\nTiếp theo:
  1. Chạy server bằng: npm run dev:lan   (HTTPS, cổng ${port})
  2. Mở cổng ${port} trên Windows Firewall nếu chưa mở (PowerShell "Run as administrator", làm 1 lần):
     New-NetFirewallRule -DisplayName "EngQuiz ${port}" -Direction Inbound -Protocol TCP -LocalPort ${port} -Action Allow -Profile Private
  3. Trên máy khác cùng mạng mở: ${url}
     Lần đầu trình duyệt cảnh báo chứng chỉ tự ký → bấm "Nâng cao" → "Tiếp tục truy cập" (mỗi thiết bị 1 lần).`);
}
