import { defineConfig } from "vitest/config";
import path from "node:path";

/** Chỉ dùng để chạy scripts/voice/export-texts.run.ts (npx vitest run --config scripts/voice/vitest.config.ts). */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "../../src") } },
  test: { include: ["scripts/voice/*.run.ts"] },
});
