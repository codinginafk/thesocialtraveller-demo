"use client";

import { useState, useEffect } from "react";

interface MediaModalProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

function MediaModal({ youtubeId, title, onClose }: MediaModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bark/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-sm text-cream/60 hover:text-cream"
        >
          Close [Esc]
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

interface FeaturedStoryClientProps {
  title: string;
  excerpt: string | null;
  imgSrc: string | null;
  youtubeId: string;
  youtubeUrl: string;
}

export default function FeaturedStoryClient({
  title,
  excerpt,
  imgSrc,
  youtubeId,
  youtubeUrl,
}: FeaturedStoryClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="grid gap-0 overflow-hidden rounded-2xl lg:grid-cols-[2fr_3fr]">
        {/* Dark panel */}
        <div className="flex flex-col justify-center bg-forest px-8 py-12 lg:px-12 lg:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Featured Story
          </p>
          <h2 className="mt-6 max-w-sm font-serif text-3xl italic leading-snug text-cream md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {excerpt && (
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/70">
              {excerpt}
            </p>
          )}
          <div className="mt-8">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-clay px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-clay-dark"
            >
              Watch Film
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>

        {/* Image panel — click to zoom/watch */}
        <div
          className="group relative min-h-[300px] cursor-pointer lg:min-h-[400px]"
          onClick={() => setShowModal(true)}
        >
          {imgSrc && (
            <>
              <img
                src={imgSrc}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-bark/0 transition-colors duration-300 group-hover:bg-bark/30" />
            </>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/60 bg-bark/40 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-clay">
              <svg width="18" height="20" viewBox="0 0 20 22" fill="none" className="ml-1 text-cream">
                <path d="M1 1L19 11L1 21V1Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </span>
          </div>
          {/* Hover hint */}
          <div className="absolute bottom-4 left-4 rounded-full bg-bark/60 px-3 py-1 text-[10px] text-cream/70 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
            Click to watch
          </div>
        </div>
      </div>

      {showModal && (
        <MediaModal
          youtubeId={youtubeId}
          title={title}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
