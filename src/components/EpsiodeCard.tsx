"use client";

import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { JourneyDoc } from "@/lib/journey";

function thumbUrl(youtubeId: string, size: "maxresdefault" | "hqdefault" | "sddefault" = "maxresdefault") {
  return `https://i.ytimg.com/vi/${youtubeId}/${size}.jpg`;
}

export default function EpisodeCard({
  journey,
  index,
}: {
  journey: JourneyDoc;
  index: number;
}) {
  const slug = journey.slug?.current ?? journey.youtubeId ?? "";
  const heroUrl = journey.heroImage
    ? urlForImage(journey.heroImage as never).width(400).height(250).fit("crop").url()
    : null;
  const ytId = journey.youtubeId ?? null;

  return (
    <Link
      href={`/journeys/${slug}`}
      className="group relative w-[300px] flex-none snap-start md:w-[380px]"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        {heroUrl ? (
          <img
            src={heroUrl}
            alt={journey.title ?? "Episode"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : ytId ? (
          <img
            src={thumbUrl(ytId, "maxresdefault")}
            alt={journey.title ?? "Episode"}
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
        ) : null}
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-bark/0 transition-colors duration-300 group-hover:bg-bark/20" />
        {/* Duration badge */}
        {journey.durationLabel && (
          <span className="absolute bottom-3 right-3 rounded-md bg-bark/80 px-2.5 py-1 text-xs font-medium text-cream backdrop-blur-sm">
            {journey.durationLabel}
          </span>
        )}
        {/* Episode number badge */}
        <span className="absolute left-3 top-3 rounded-md bg-cream/90 px-2.5 py-1 font-serif text-xs font-semibold text-bark backdrop-blur-sm">
          EP {45 - index}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="font-serif text-xl leading-snug text-bark transition-colors group-hover:text-forest">
          {journey.title}
        </h3>
        {journey.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">
            {journey.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
