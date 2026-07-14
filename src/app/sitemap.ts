import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { JOURNEYS_QUERY } from "@/sanity/lib/queries";
import type { JourneyDoc } from "@/lib/journey";

const SITE_URL = "https://thesocialtraveller-demo.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const journeys = await client
    .fetch<JourneyDoc[]>(JOURNEYS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  const journeyEntries: MetadataRoute.Sitemap = journeys.map((j) => ({
    url: `${SITE_URL}/journeys/${j.slug?.current ?? j.youtubeId}`,
    lastModified: j.publishedAt ?? new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/journeys`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/impact`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/journal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...journeyEntries,
  ];
}
