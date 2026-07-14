import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  JOURNEY_BY_SLUG_QUERY,
  JOURNEY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { getVideoById, getLatestVideos } from "@/lib/youtube";
import { getJourneys } from "@/lib/journey";
import PortableText from "@/components/PortableText";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 10800;

export async function generateStaticParams() {
  const slugs = await client
    .fetch<string[]>(JOURNEY_SLUGS_QUERY, {}, { next: { revalidate: 10800 } })
    .catch(() => []);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const j = await client
    .fetch(JOURNEY_BY_SLUG_QUERY, { slug }, { next: { revalidate: 10800 } })
    .catch(() => null);
  if (!j) return { title: "Journey — TheSocialTraveller" };
  return {
    title: `${j.title} — TheSocialTraveller`,
    description: j.excerpt,
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

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journey = await client
    .fetch(JOURNEY_BY_SLUG_QUERY, { slug }, { next: { revalidate: 10800 } })
    .catch(() => null);
  if (!journey) notFound();

  const id = journey.youtubeId ?? slug;
  const [live, allJourneys] = await Promise.all([
    getVideoById(id),
    getLatestVideos(50),
  ]);

  const description = live?.description ?? journey.excerpt ?? "";
  const places = journey.places ?? [];
  const trashKg = journey.trashKg ?? null;
  const isShort = journey.isShort ?? false;

  // Trip # = chronological position among long videos (oldest = #1).
  const trips = allJourneys
    .filter((x) => !x.isShort && x.publishedAt)
    .sort((a, b) => +new Date(a.publishedAt!) - +new Date(b.publishedAt!));
  const tripNumber = trips.findIndex((x) => x.id === id) + 1;

  const heroUrl = journey.heroImage
    ? urlForImage(journey.heroImage as never)
        .width(1280)
        .height(720)
        .fit("crop")
        .url()
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  const published = journey.publishedAt
    ? new Date(journey.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <main className="mx-auto max-w-[72rem] px-4 py-12 sm:px-8">
      <Link
        href="/journeys"
        className="text-sm text-water underline-offset-2 hover:underline"
      >
        ← All journeys
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-sand bg-ink/5">
            <Image
              src={heroUrl}
              alt={journey.title ?? "Journey"}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <a
            href={journey.youtubeUrl ?? `https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-clay px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-clay-dark"
          >
            Watch on YouTube
          </a>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {tripNumber > 0 && (
              <span className="rounded-md bg-forest px-2.5 py-1 text-xs font-medium text-white">
                Journey #{tripNumber}
              </span>
            )}
            {!isShort && (
              <span className="rounded-md bg-clay px-2.5 py-1 text-xs font-medium text-white">
                Cleanup
              </span>
            )}
            {(journey.region || journey.season || journey.state) && (
              <span className="rounded-md border border-sand px-2.5 py-1 text-xs text-ink-soft">
                {journey.season || journey.state || journey.region}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-serif text-3xl text-bark sm:text-4xl">
            {journey.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
            {published && <span>{published}</span>}
            {live?.durationSec ? <span>{formatDuration(live.durationSec)}</span> : null}
            {journey.distanceLabel && <span>{journey.distanceLabel}</span>}
            {trashKg != null && <span>{trashKg} kg collected</span>}
            {(journey.locations?.length || places.length) > 0 && (
              <span>
                {(journey.locations?.length || places.length)} stops
              </span>
            )}
          </div>
        </div>
      </div>

      {places.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-leaf">Where</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {places.map((p: string) => (
              <span
                key={p}
                className="rounded-full border border-sand px-3 py-1 text-sm text-ink"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {journey.body && Array.isArray(journey.body) && journey.body.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <h2 className="text-sm font-medium uppercase tracking-wide text-leaf">
            Field Notes
          </h2>
          <div className="mt-3">
            <PortableText value={journey.body} />
          </div>
        </div>
      )}

      {description && !journey.body?.length && (
        <div className="mt-10 max-w-2xl">
          <h2 className="text-sm font-medium uppercase tracking-wide text-leaf">
            About this journey
          </h2>
          <p className="mt-2 whitespace-pre-line text-ink-soft">{description}</p>
        </div>
      )}

      {journey.gallery && journey.gallery.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-leaf">Gallery</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {journey.gallery.map((g: any, i: number) => {
              const img = g?.photo;
              const url = img
                ? urlForImage(img).width(600).height(400).fit("crop").url()
                : null;
              return (
                <figure key={i} className="overflow-hidden rounded-lg border border-sand">
                  {url && (
                    <Image
                      src={url}
                      alt={g?.caption ?? journey.title ?? ""}
                      width={600}
                      height={400}
                      className="aspect-[3/2] w-full object-cover"
                    />
                  )}
                  {g?.caption && (
                    <figcaption className="p-3 text-sm text-ink-soft">{g.caption}</figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      )}

      {journey.tips && journey.tips.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <h2 className="text-sm font-medium uppercase tracking-wide text-leaf">Travel Tips</h2>
          <ul className="mt-3 space-y-3">
            {journey.tips.map((t: any, i: number) => (
              <li key={i} className="rounded-lg border border-sand bg-stone p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-bark">{t?.title}</span>
                  {t?.category && (
                    <span className="text-xs uppercase tracking-wide text-leaf">{t.category}</span>
                  )}
                </div>
                {t?.description && (
                  <p className="mt-1 text-sm text-ink-soft">{t.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {journey.quotes && journey.quotes.length > 0 && (
        <div className="mt-10">
          {journey.quotes.map((q: any, i: number) => (
            <blockquote
              key={i}
              className="border-l-4 border-clay pl-5 font-serif text-2xl italic text-bark"
            >
              {q?.text}
              {q?.attribution && (
                <footer className="mt-2 text-sm not-italic text-ink-soft">
                  — {q.attribution}
                </footer>
              )}
            </blockquote>
          ))}
        </div>
      )}
    </main>
  );
}
