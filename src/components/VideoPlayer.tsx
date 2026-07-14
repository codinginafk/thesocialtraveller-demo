"use client";

import Image from "next/image";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink">
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackThumbnail;
        }}
      />
      <div className="absolute inset-0 bg-bark/20 transition-colors hover:bg-bark/30" />
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        aria-label={`Watch ${title} on YouTube`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clay text-white shadow-lg transition-transform hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-cream drop-shadow">Watch on YouTube</span>
      </a>
    </div>
  );
}
