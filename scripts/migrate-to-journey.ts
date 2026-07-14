// One-off migration: the analyzer now writes `journey` docs instead of
// `videoImpact`. This deletes the obsolete `videoImpact` docs so they don't
// linger in the dataset. Run: node --import tsx scripts/migrate-to-journey.ts
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const p = resolve(process.cwd(), file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      )
        val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}
loadEnvFiles();

async function main() {
  const { writeClient } = await import("../src/sanity/lib/writeClient");
  const docs = await writeClient.fetch<{ _id: string }[]>(
    `*[_type == "videoImpact"]{_id}`,
  );
  console.log(`[migrate] found ${docs.length} videoImpact docs`);
  for (const d of docs) {
    await writeClient.delete(d._id);
    console.log(`[migrate] deleted ${d._id}`);
  }
  console.log("[migrate] DONE");
}

main().catch((e) => {
  console.error("[migrate] FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
