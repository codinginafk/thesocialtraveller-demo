"use client";

import { useRef, type ReactNode } from "react";

export default function Carousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="group/scroll relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => ref.current?.scrollBy({ left: -340, behavior: "smooth" })}
        className="absolute -left-4 top-1/3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-cream text-ink shadow-sm transition-colors hover:bg-stone md:flex"
      >
        ‹
      </button>
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-none md:px-0"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => ref.current?.scrollBy({ left: 340, behavior: "smooth" })}
        className="absolute -right-4 top-1/3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-cream text-ink shadow-sm transition-colors hover:bg-stone md:flex"
      >
        ›
      </button>
    </div>
  );
}
