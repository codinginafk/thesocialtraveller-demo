import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  FIELD_NOTE_BY_SLUG_QUERY,
  FIELD_NOTE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import PortableText from "@/components/PortableText";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 10800;

export async function generateStaticParams() {
  const slugs = await client
    .fetch<string[]>(FIELD_NOTE_SLUGS_QUERY, {}, { next: { revalidate: 10800 } })
    .catch(() => []);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = await client
    .fetch(FIELD_NOTE_BY_SLUG_QUERY, { slug }, { next: { revalidate: 10800 } })
    .catch(() => null);
  if (!n) return { title: "Journal — TheSocialTraveller" };
  return { title: `${n.title} — TheSocialTraveller`, description: n.excerpt };
}

export default async function FieldNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await client
    .fetch(FIELD_NOTE_BY_SLUG_QUERY, { slug }, { next: { revalidate: 10800 } })
    .catch(() => null);
  if (!note) notFound();

  const imgUrl = note.coverImage
    ? urlForImage(note.coverImage as never)
        .width(1280)
        .height(720)
        .fit("crop")
        .url()
    : null;
  const date = note.publishedAt
    ? new Date(note.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
      <Link
        href="/journal"
        className="text-sm text-water underline-offset-2 hover:underline"
      >
        ← All Journal
      </Link>

      <h1 className="mt-6 font-serif text-4xl text-bark md:text-5xl">
        {note.title}
      </h1>
      {date && <p className="mt-3 text-sm text-ink-soft">{date}</p>}
      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((t: string) => (
            <span
              key={t}
              className="rounded-full border border-sand px-3 py-1 text-xs text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {imgUrl && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl border border-sand">
          <Image
            src={imgUrl}
            alt={note.title}
            fill
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {note.body && (
        <div className="mt-8">
          <PortableText value={note.body} />
        </div>
      )}

      {note.journeySlug && (
        <div className="mt-10 rounded-xl border border-sand bg-stone p-6">
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            From the journey
          </p>
          <Link
            href={`/journeys/${note.journeySlug}`}
            className="mt-1 inline-block font-serif text-xl text-forest hover:underline"
          >
            Read the full journey →
          </Link>
        </div>
      )}
    </article>
  );
}
