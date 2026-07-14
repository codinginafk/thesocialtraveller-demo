// CLI entrypoint for the impact analyzer. The real logic lives in
// src/lib/analyze-runner.ts so it can also be called by the Vercel Cron
// route (app/api/cron/analyze). Run: npm run analyze
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Next.js auto-loads .env.local for the app + cron route, but a plain
// tsx script does not. Load it here (and .env) so `npm run analyze`
// sees LLM_API_KEY / SANITY_WRITE_TOKEN / etc. locally.
// IMPORTANT: this must run BEFORE analyze-runner is imported, because
// that module reads env (SANITY_WRITE_TOKEN) at load time. So we use a
// dynamic import below instead of a static top-of-file import.
function loadEnvFiles() {
  const root = process.cwd();
  for (const file of [".env.local", ".env"]) {
    const p = resolve(root, file);
    if (!existsSync(p)) continue;
    const txt = readFileSync(p, "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}
loadEnvFiles();

async function main() {
  const { runAnalysis } = await import("../src/lib/analyze-runner");
  const s = await runAnalysis();
  console.log(
    `[analyze] done. ok=${s.ok} created=${s.created} skipped=${s.skipped} — ${s.note}`,
  );
  process.exit(s.ok ? 0 : 1);
}

main().catch((e) => {
  console.error("[analyze] FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
