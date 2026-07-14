"use client";

import { useState, useEffect } from "react";

const THUMB_SIZES = ["maxresdefault", "hqdefault", "sddefault"];

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
  const [currentSrc, setCurrentSrc] = useState(imgSrc);
  const [fallbackLevel, setFallbackLevel] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentSrc(imgSrc);
    setFallbackLevel(0);
  }, [imgSrc]);

  const handleImgError = () => {
    if (!youtubeId) return;
    const next = fallbackLevel + 1;
    if (next < THUMB_SIZES.length) {
      setFallbackLevel(next);
      setCurrentSrc(`https://i.ytimg.com/vi/${youtubeId}/${THUMB_SIZES[next]}.jpg`);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className="group relative min-h-[400px] cursor-pointer overflow-hidden rounded-2xl md:min-h-[500px]"
        onClick={() => setShowModal(true)}
      >
        {/* Background image */}
        {currentSrc && (
          <>
            <img
              src={currentSrc}
              alt={title}
              onError={handleImgError}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bark/80 via-bark/40 to-transparent" />
          </>
        )}

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Featured Story
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl italic leading-snug text-cream md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {excerpt && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/80 md:text-base">
              {excerpt}
            </p>
          )}
          <div className="mt-6 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-lg bg-clay px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-clay-dark">
              Watch Film
              <span className="text-lg">→</span>
            </span>
            <span className="text-sm text-cream/60 group-hover:text-cream/80 transition-colors">
              Click anywhere to play
            </span>
          </div>
        </div>

        {/* Play button - centered */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/60 bg-bark/50 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-clay">
            <svg width="18" height="20" viewBox="0 0 20 22" fill="none" className="ml-1 text-cream">
              <path d="M1 1L19 11L1 21V1Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </span>
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
