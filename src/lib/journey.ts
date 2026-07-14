import { client } from "../sanity/lib/client";

export type JourneyDoc = {
  _id: string;
  title?: string;
  slug?: { current: string };
  youtubeId?: string;
  youtubeUrl?: string;
  excerpt?: string;
  publishedAt?: string;
  durationLabel?: string;
  isShort?: boolean;
  trashKg?: number | null;
  trashBags?: number | null;
  places?: string[];
  region?: string;
  state?: string;
  season?: string;
  featured?: boolean;
  heroImage?: unknown;
  body?: unknown[];
  locations?: unknown[];
  gallery?: unknown[];
  tips?: unknown[];
  quotes?: unknown[];
  impact?: Record<string, unknown>;
  relatedJourneys?: { _ref: string }[];
};

// All journey docs, keyed by YouTube videoId. Read-only (the public site
// uses the Viewer token). Enriches the Journeys grid + detail pages with
// extracted places / trash numbers / region.
export async function getJourneys(): Promise<Record<string, JourneyDoc>> {
  const docs = await client.fetch<JourneyDoc[]>(
    `*[_type == "journey"]{
      _id, title, slug, youtubeId, youtubeUrl, excerpt, publishedAt,
      durationLabel, isShort, trashKg, trashBags, places, region, state,
      season, featured, heroImage, body, locations, gallery, tips, quotes,
      impact, relatedJourneys
    }`,
  );
  const map: Record<string, JourneyDoc> = {};
  for (const d of docs ?? []) {
    const key = d.youtubeId || d.slug?.current;
    if (key) map[key] = d;
  }
  return map;
}

// Non-short journeys only (the real trips), newest first.
export async function getJourneyList(): Promise<JourneyDoc[]> {
  const docs = await client.fetch<JourneyDoc[]>(
    `*[_type == "journey" && !isShort] | order(publishedAt desc){
      _id, title, slug, youtubeId, youtubeUrl, excerpt, publishedAt,
      durationLabel, trashKg, trashBags, places, region, state, season,
      featured, heroImage
    }`,
  );
  return docs ?? [];
}
