import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { JourneyDoc } from "@/lib/journey";

export default function JourneyCard({
  journey,
}: {
  journey: JourneyDoc;
}) {
  const slug = journey.slug?.current ?? journey.youtubeId ?? "";
  if (!slug) return null;

  const imgUrl = journey.heroImage
    ? urlForImage(journey.heroImage as never)
        .width(800)
        .height(500)
        .fit("crop")
        .url()
    : journey.youtubeId
      ? `https://i.ytimg.com/vi/${journey.youtubeId}/maxresdefault.jpg`
      : null;

  const stops =
    journey.locations?.length ||
    journey.places?.length ||
    0;
  const trashKg = journey.trashKg ?? null;
  const tag = journey.season || journey.state || journey.region || "";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-stone shadow-soft transition-shadow hover:shadow-lg">
      <Link href={`/journeys/${slug}`} className="relative block aspect-video w-full overflow-hidden bg-cream">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={journey.title ?? "Journey"}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
