import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

export default function FieldNoteCard({
  note,
}: {
  note: {
    _id: string;
    title: string;
    slug?: { current: string };
    excerpt?: string;
    coverImage?: unknown;
    tags?: string[];
    publishedAt?: string;
  };
}) {
  const { title, slug, excerpt, coverImage, tags, publishedAt } = note;
  const imgUrl = coverImage
    ? urlForImage(coverImage as never)
        .width(800)
        .height(500)
        .fit("crop")
        .url()
    : null;
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/journal/${slug?.current ?? note._id}`}
      className="group block overflow-hidden rounded-xl border border-sand bg-stone shadow-soft transition-shadow hover:shadow-lg"
    >
      {imgUrl && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
          <Image
            src={imgUrl}
            alt={title}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        {tags && tags.length > 0 && (
          <span className="text-xs uppercase tracking-wide text-leaf">
            {tags.join(" · ")}
          </span>
        )}
        <h3 className="mt-1 font-serif text-xl text-bark transition-colors group-hover:text-forest">
          {title}
        </h3>
        {excerpt && <p className="mt-2 text-sm text-ink-soft">{excerpt}</p>}
        {date && <p className="mt-3 text-xs text-ink-soft">{date}</p>}
      </div>
    </Link>
  );
}
