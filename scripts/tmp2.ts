import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const p = resolve(process.cwd(), f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const k = m[1];
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}
loadEnv();
async function main() {
  const { getLatestVideos } = await import("../src/lib/youtube");
  const vids = await getLatestVideos(50);
  console.log("TOTAL", vids.length);
  let shorts = 0, longs = 0;
  for (const v of vids) {
    if (v.isShort) shorts++; else longs++;
    console.log(`${v.isShort ? "SHORT" : "LONG "} | ${v.id} | ${v.publishedAt || "?"} | ${v.title}`);
  }
  console.log(`SHORTS=${shorts} LONGS=${longs}`);
}
main().catch((e) => { console.error("ERR", e); process.exit(1); });
