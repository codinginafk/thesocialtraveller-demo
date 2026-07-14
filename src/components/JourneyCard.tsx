"use client";

import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { JourneyDoc } from "@/lib/journey";

function thumbUrl(youtubeId: string, size: "maxresdefault" | "hqdefault" | "sddefault" = "maxresdefault") {
  return `https://i.ytimg.com/vi/${youtubeId}/${size}.jpg`;
}

export default function JourneyCard({
  journey,
}: {
  journey: JourneyDoc;
}) {
  const slug = journey.slug?.current ?? journey.youtubeId ?? "";
  if (!slug) return null;

  const heroUrl = journey.heroImage
    ? urlForImage(journey.heroImage as never).width(800).height(500).fit("crop").url()
    : null;
  const ytId = journey.youtubeId ?? null;

  const stops =
    journey.locations?.length ||
    journey.places?.length ||
    0;
  const trashKg = journey.trashKg ?? null;
  const tag = journey.season || journey.state || journey.region || "";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-stone shadow-soft transition-shadow hover:shadow-lg">
      <Link href={`/journeys/${slug}`} className="relative block aspect-video w-full overflow-hidden bg-cream">
        {heroUrl ? (
          <img
            src={heroUrl}
            alt={journey.title ?? "Journey"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : ytId ? (
          <img
            src={thumbUrl(ytId, "maxresdefault")}
            alt={journey.title ?? "Journey"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.includes("maxresdefault")) {
                img.src = thumbUrl(ytId, "hqdefault");
              } else if (img.src.includes("hqdefault")) {
                img.src = thumbUrl(ytId, "sddefault");
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-sand">
            <span className="text-sm text-ink-soft">No thumbnail</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {tag && (
          <span className="text-xs uppercase tracking-wide text-leaf">
            {tag}
          </span>
        )}
        <h3 className="mt-1 font-serif text-xl text-bark transition-colors group-hover:text-forest">
          <Link href={`/journeys/${slug}`}>{journey.title}</Link>
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
          {stops > 0 && <span>{stops} stops</span>}
          {trashKg != null && <span>{trashKg} kg cleaned</span>}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={journey.youtubeUrl ?? `https://www.youtube.com/watch?v=${journey.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-clay px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-clay-dark"
          >
            Watch Film
          </a>
          <Link
            href={`/journeys/${slug}`}
            className="rounded-lg border border-sand px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-cream"
          >
            Read Story
          </Link>
        </div>
      </div>
    </article>
  );
}
