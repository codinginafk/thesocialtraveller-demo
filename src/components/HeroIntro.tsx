"use client";

import { useState, useEffect } from "react";

export default function HeroIntro({
  mission,
  ctaHref,
}: {
  mission: string;
  ctaHref: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative z-10 px-6 text-center">
      <h1 className="font-serif text-5xl italic leading-tight text-cream md:text-7xl lg:text-8xl">
        {mission}
      </h1>

      <div className="mt-12 flex flex-col items-center gap-4">
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-3"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/40 bg-cream/10 backdrop-blur-sm transition-all group-hover:bg-cream/20 group-hover:scale-110">
            <svg
              width="18"
              height="20"
              viewBox="0 0 20 22"
              fill="none"
              className="ml-1 text-cream"
            >
              <path
                d="M1 1L19 11L1 21V1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Watch Documentary
          </span>
        </a>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="text-cream/40">
            <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="2" fill="currentColor">
              <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
            Scroll
          </span>
        </div>
      </div>
    </div>
  );
}
