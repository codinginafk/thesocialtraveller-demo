import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);

export const IMPACT_STATS_QUERY = defineQuery(`*[_type == "impactStats"][0]`);

export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage"][0]`);

// ---- Journeys -------------------------------------------------------------
// Auto-seeded by the analyzer from YouTube; enriched by the editor.
export const JOURNEYS_QUERY = defineQuery(
  `*[_type == "journey" && !isShort] | order(publishedAt desc)`,
);

export const JOURNEY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "journey" && slug.current == $slug][0]`,
);

export const JOURNEY_SLUGS_QUERY = defineQuery(
  `*[_type == "journey" && !isShort].slug.current`,
);

export const FEATURED_JOURNEY_QUERY = defineQuery(
  `*[_type == "journey" && !isShort] | order(publishedAt desc)[0]{
    _id, title, excerpt, slug, youtubeId, youtubeUrl, heroImage, durationLabel
  }`,
);

export const LATEST_JOURNEYS_QUERY = defineQuery(
  `*[_type == "journey" && !isShort] | order(publishedAt desc)[0..11]`,
);

// ---- Field Notes -----------------------------------------------------------
export const FIELD_NOTES_QUERY = defineQuery(
  `*[_type == "fieldNote"] | order(pinned desc, publishedAt desc)`,
);

export const FIELD_NOTE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "fieldNote" && slug.current == $slug][0]{
    _id, title, slug, excerpt, body, coverImage, tags, publishedAt,
    "journeySlug": journey->slug.current
  }`,
);

export const FIELD_NOTE_SLUGS_QUERY = defineQuery(
  `*[_type == "fieldNote"].slug.current`,
);

// Headline impact numbers, derived from journeys (monotonic by construction).
export const JOURNEY_AGGREGATE = defineQuery(`{
  "trips": count(*[_type == "journey" && !isShort]),
  "trashKg": math::sum(*[_type == "journey" && !isShort].trashKg),
  "locations": count(array::unique(*[_type == "journey" && !isShort].places[])),
  "regions": count(array::unique(*[_type == "journey" && !isShort].region))
}`);
