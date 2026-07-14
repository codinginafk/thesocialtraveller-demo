import { getLatestVideos, IS_SHORT_MAX_SEC } from "./youtube";
import { analyzeVideo } from "./analyzer";
import { getRegion } from "./regions";
import { writeClient, hasWriteAccess } from "../sanity/lib/writeClient";

export type AnalysisSummary = {
  ok: boolean;
  created: number;
  skipped: number;
  note: string;
};

// Core analysis. Idempotent + monotonic (owner rules):
//  - never deletes; existing journeys are skipped (totals can't drop)
//  - trashKg only ever rises
//  - if YouTube returns nothing, we DON'T wipe — stored docs are kept
//
// ANALZE_DRY_RUN=1 skips the write-token check AND all writes,
// just printing what the LLM would extract. Useful to verify the LLM
// integration without a Sanity token.
export async function runAnalysis(): Promise<AnalysisSummary> {
  const DRY = process.env.ANALZE_DRY_RUN === "1";

  if (!hasWriteAccess && !DRY) {
    return {
      ok: false,
      created: 0,
      skipped: 0,
      note: "SANITY_WRITE_TOKEN is not set — cannot write journey docs.",
    };
  }

  const videos = await getLatestVideos(50);

  if (!videos.length) {
    return {
      ok: true,
      created: 0,
      skipped: 0,
      note: "No videos returned (YouTube unreachable / blocked). Kept stored journey docs.",
    };
  }

  let created = 0;
  let refreshed = 0;

  for (const v of videos) {
    const id = v.id;
    const isShort = Boolean(v.isShort);

    let existing: { _id: string; trashKg?: number } | null = null;
    if (!DRY) {
      existing = await writeClient.fetch<{ _id: string; trashKg?: number }>(
        `*[_type == "journey" && youtubeId == $id][0]{_id,trashKg}`,
        { id },
      );
    }

    // Shorts/clips: never a journey — skip the LLM and store no impact.
    const analysis: { places: string[]; trashKg: number | null } = isShort
      ? { places: [], trashKg: null }
      : await analyzeVideo(v.title, v.description ?? "");
    let trashKg = isShort ? null : analysis.trashKg ?? 1; // >=1 kg per trip
    const places = isShort ? [] : analysis.places;
    const region = isShort ? "" : getRegion(places);
    const explicit = analysis.trashKg != null;

    const excerpt = (v.description ?? "").replace(/\s+/g, " ").slice(0, 160);
    const durationLabel = formatDuration(v.durationSec);
    const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;

    if (DRY) {
      refreshed++;
      console.log(
        `[dry] ${id} | short=${isShort} | kg=${trashKg ?? "null"} | region=${region} | places=${places.join(", ")}`,
      );
      continue;
    }

    // Refresh existing docs: recompute isShort + places/region, but keep
    // trashKg monotonic (only ever raise) so totals never drop.
    if (existing) {
      if (isShort) {
        trashKg = null;
      } else {
        trashKg = Math.max(existing.trashKg ?? 0, trashKg ?? 0);
      }
      refreshed++;
    } else {
      created++;
    }

    await writeClient.createOrReplace(
      {
        _id: `journey.${id}`,
        _type: "journey",
        title: v.title,
        slug: { current: id },
        youtubeId: id,
        youtubeUrl,
        excerpt,
        publishedAt: v.publishedAt || new Date().toISOString(),
        durationLabel,
        isShort,
        trashKg,
        trashBags: null,
        places,
        region,
        state: "",
        season: "",
        featured: false,
        source: "title_description",
        analyzedAt: new Date().toISOString(),
        note: explicit
          ? `LLM explicit ${trashKg}kg`
          : isShort
            ? "short/clip — not counted as a journey"
            : "default 1kg (no explicit amount found)",
      },
      { autoGenerateArrayKeys: false },
    );

    if (process.env.LLM_API_KEY) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  if (DRY) {
    return {
      ok: true,
      created: 0,
      skipped: refreshed,
      note: `DRY RUN — analyzed ${refreshed} videos, wrote nothing.`,
    };
  }

  return {
    ok: true,
    created,
    skipped: refreshed,
    note: `Created ${created} new, refreshed ${refreshed} existing; shorts (<${IS_SHORT_MAX_SEC}s) excluded from journeys.`,
  };
}

function formatDuration(sec?: number): string {
  if (!sec) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
