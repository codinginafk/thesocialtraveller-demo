"use client";

import { useState, useEffect } from "react";

interface InstagramPostProps {
  url: string;
  alt: string;
  isVideo: boolean;
}

export default function InstagramPost({ url, alt, isVideo }: InstagramPostProps) {
  const [thumb, setThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchThumb() {
      try {
        const res = await fetch(
          `/api/instagram/thumbnail?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        if (!cancelled && data.thumbnail) {
          setThumb(data.thumbnail);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchThumb();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <div className="group relative aspect-square overflow-hidden rounded-xl bg-forest">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center animate-pulse bg-stone">
            <span className="text-cream/30">...</span>
          </div>
        ) : thumb ? (
          <img
            src={thumb}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-forest">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-cream/20"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bark/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {isVideo && (
          <div className="absolute right-3 top-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md">
              <svg width="12" height="14" viewBox="0 0 20 22" fill="none">
                <path d="M1 1L19 11L1 21V1Z" fill="#222" />
              </svg>
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs font-medium text-cream">{alt}</p>
        </div>
      </div>
    </a>
  );
}
