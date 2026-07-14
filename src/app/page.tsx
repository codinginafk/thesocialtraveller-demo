import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import {
  SITE_SETTINGS_QUERY,
  IMPACT_STATS_QUERY,
  JOURNEY_AGGREGATE,
  FEATURED_JOURNEY_QUERY,
  LATEST_JOURNEYS_QUERY,
} from "@/sanity/lib/queries";
import { getLatestVideos } from "@/lib/youtube";
import Reveal from "@/components/Reveal";
import Carousel from "@/components/Carousel";
import MapIndiaWrapper from "@/components/MapIndiaWrapper";
import FeaturedStoryClient from "@/components/FeaturedStoryClient";
import EpisodeCard from "@/components/EpisodeCard";
import InstagramEmbed from "@/components/InstagramEmbed";
import { urlForImage } from "@/sanity/lib/image";
import type { JourneyDoc } from "@/lib/journey";
import { PLACES } from "@/lib/places";

export const revalidate = 3600;

const DEFAULT_MISSION = "Why take the paths they ignore?";

/* ─── Hero ─────────────────────────────────────────────────────────────── */

async function Hero() {
  const [settings, videos] = await Promise.all([
    client
      .fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 3600 } })
      .catch(() => null),
    getLatestVideos(1),
  ]);
  const mission = settings?.missionStatement || DEFAULT_MISSION;
  const latest = videos[0];
  const cta = latest
    ? `https://www.youtube.com/watch?v=${latest.id}`
    : "/journeys";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Permanent hero image */}
      <Image
        src="/images/hero.jpg"
        alt="Mountain road disappearing into mist"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-bark/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Two-part heading with underline on second line */}
        <div className="text-center">
          <h1 className="font-serif text-5xl italic leading-none text-cream md:text-7xl lg:text-8xl">
            <span className="block">Why take the path</span>
            <span className="relative mt-3 inline-block text-clay">
              they ignore?
              <span className="absolute -bottom-1 left-0 h-px w-full bg-clay/60" />
            </span>
          </h1>
        </div>

        {/* Play button */}
        <a
          href={cta}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-16 flex flex-col items-center gap-3"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/40 bg-cream/10 backdrop-blur-sm transition-all group-hover:bg-cream/20 group-hover:scale-110">
            <svg
              width="18"
              height="20"
              viewBox="0 0 20 22"
              fill="none"
              className="ml-1 text-cream"
            >
              <path
                d="M1 1L19 11L1 21V1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Watch Documentary
          </span>
        </a>
      </div>

      {/* Scroll indicator - positioned at bottom */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="text-cream/40">
            <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="2" fill="currentColor">
              <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─── Impact Ledger ────────────────────────────────────────────────────── */

async function ImpactLedger() {
  const [impact, agg] = await Promise.all([
    client
      .fetch(IMPACT_STATS_QUERY, {}, { next: { revalidate: 3600 } })
      .catch(() => null),
    client
      .fetch<{ trips: number; trashKg: number; locations: number; regions: number }>(
        JOURNEY_AGGREGATE,
        {},
        { next: { revalidate: 3600 } },
      )
      .catch(() => null),
  ]);
  const trips = agg?.trips ?? impact?.tripsCompleted ?? 0;
  const trashKg = agg?.trashKg ?? impact?.trashCollectedKg ?? 0;
  const locations = agg?.locations ?? impact?.locationsVisited ?? 0;

  const stats = [
    {
      value: trips,
      label: "Journeys",
      desc: "Off the map. Into the real.",
    },
    {
      value: `${trashKg}kg`,
      label: "Waste Removed",
      desc: "Picked up on Malshej, Tamhini, Matheran. Handed to the panchayat.",
    },
    {
      value: locations,
      label: "Locations Documented",
      desc: "Places that look like nothing on paper. Everything on foot.",
    },
  ];

  return (
    <section className="bg-cream">
      <div className="container-page py-16">
        <Reveal>
          <div className="grid grid-cols-1 gap-0 border-y border-sand md:grid-cols-3 md:divide-x md:divide-sand">
            {stats.map((s) => (
              <div key={s.label} className="px-0 py-10 text-center first:pl-0 last:pr-0 md:px-10 first:md:pl-0 last:md:pr-0">
                <span className="block font-serif text-5xl italic text-bark md:text-6xl">
                  {s.value}
                </span>
                <span className="mt-3 block text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {s.label}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Featured Story ───────────────────────────────────────────────────── */

async function FeaturedStory() {
  const j = await client
    .fetch<JourneyDoc>(FEATURED_JOURNEY_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);
  if (!j) return null;

  const img = j.heroImage
    ? urlForImage(j.heroImage as never).width(1100).height(900).fit("crop").url()
    : j.youtubeId
      ? `https://i.ytimg.com/vi/${j.youtubeId}/maxresdefault.jpg`
      : null;

  const cleanTitle = j.title
    ? j.title.split("|")[0].split("–")[0].split("—")[0].trim()
    : "Feature";

  return (
    <section className="bg-cream">
      <div className="container-page py-20">
        <FeaturedStoryClient
          title={cleanTitle}
          excerpt={j.excerpt ?? null}
          imgSrc={img}
          youtubeId={j.youtubeId ?? ""}
          youtubeUrl={j.youtubeUrl ?? `https://www.youtube.com/watch?v=${j.youtubeId}`}
        />
      </div>
    </section>
  );
}

/* ─── Behind the Lens (latest 3 Instagram posts) ──────────────────── */

const INSTAGRAM_POSTS = [
  "https://www.instagram.com/thesocialtraveller_2021/p/DVy4J_riFMK/",
  "https://www.instagram.com/thesocialtraveller_2021/reel/DFr9icdi5FP/",
  "https://www.instagram.com/thesocialtraveller_2021/p/DFiBOmRJKiF/",
];

async function BehindTheLens() {
  const settings = await client
    .fetch<Record<string, unknown>>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => ({} as Record<string, unknown>));

  const instaUrl = (settings?.instagramUrl as string) || "https://instagram.com/thesocialtraveller_2021";

  return (
    <section className="bg-cream">
      <div className="container-page py-20">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-clay">
                On the trail
              </p>
              <h2 className="mt-2 font-serif text-3xl italic text-bark md:text-4xl">
                Latest from Instagram
              </h2>
            </div>
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 text-sm text-clay transition-colors hover:text-clay-dark md:flex"
            >
              Follow on Instagram
              <span>→</span>
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {INSTAGRAM_POSTS.map((url) => (
              <InstagramEmbed key={url} url={url} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-sand px-5 py-2.5 text-sm text-ink transition-colors hover:bg-stone"
            >
              Follow on Instagram
              <span>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Map Section ──────────────────────────────────────────────────────── */

async function MapSection() {
  const allJourneys = await client
    .fetch<JourneyDoc[]>(
      `*[_type == "journey" && !isShort && defined(places) && defined(youtubeId)] | order(publishedAt desc){ _id, youtubeId, title, places, region }`,
      {},
      { next: { revalidate: 3600 } },
    )
    .catch(() => []);
  const placeVideos: Record<string, string> = {};
  const regionVideos: Record<string, string> = {};
  let latestPlace: string | null = null;
  for (const j of allJourneys) {
    if (j.places && j.youtubeId) {
      for (const p of j.places) {
        if (!placeVideos[p]) {
          placeVideos[p] = j.youtubeId;
        }
      }
      if (!latestPlace && j.places[0]) {
        latestPlace = j.places[0];
      }
    }
    if (j.youtubeId && j.region && !regionVideos[j.region]) {
      regionVideos[j.region] = j.youtubeId;
    }
  }
  for (const place of PLACES) {
    if (!placeVideos[place.name] && regionVideos[place.region]) {
      placeVideos[place.name] = regionVideos[place.region];
    }
  }

  return (
    <section id="map" className="bg-forest">
      <div className="container-page py-20">
        <Reveal>
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-clay">
              Explore the Map
            </p>
            <h2 className="mt-2 font-serif text-4xl italic text-cream md:text-5xl">
              Every pin is a story.
            </h2>
            <p className="mt-4 max-w-md text-cream/70">
              Click a place. Watch the journey.
            </p>
          </div>
          <MapIndiaWrapper
            placeVideos={placeVideos}
            latestPlace={latestPlace}
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Latest Episodes (horizontal scroll carousel) ─────────────────────── */

async function LatestEpisodes() {
  const journeys = await client
    .fetch<JourneyDoc[]>(LATEST_JOURNEYS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);
  if (!journeys || !journeys.length) return null;

  return (
    <section className="bg-white">
      <div className="container-page py-20">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-clay">
                Newest
              </p>
              <h2 className="mt-2 font-serif text-3xl italic text-bark md:text-4xl">
                Latest journeys
              </h2>
            </div>
            <Link
              href="/journeys"
              className="hidden items-center gap-1 text-sm text-clay transition-colors hover:text-clay-dark md:flex"
            >
              View All
              <span>→</span>
            </Link>
          </div>
          <Carousel>
            {journeys.map((j, i) => (
              <EpisodeCard key={j._id} journey={j} index={i} />
            ))}
          </Carousel>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/journeys"
              className="inline-flex items-center gap-2 rounded-lg border border-sand px-5 py-2.5 text-sm text-ink transition-colors hover:bg-stone"
            >
              View All Episodes
              <span>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Page Assembly ────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-forest" />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-stone" />}>
        <ImpactLedger />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse bg-stone" />}>
        <FeaturedStory />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-cream" />}>
        <BehindTheLens />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse bg-forest" />}>
        <MapSection />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-white" />}>
        <LatestEpisodes />
      </Suspense>
    </>
  );
}
