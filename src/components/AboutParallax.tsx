"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── Story chapters ────────────────────────────────────────── */

const CHAPTERS = [
  {
    id: "beginning",
    img: "/images/hero.jpg",
    number: "01",
    title: "The Beginning",
    body: "A guy with a camera. A road that had no destination. Somewhere between the Himalayan bends and the Western Ghats, the idea took shape — not as a channel, but as a question: what if travel meant leaving a place better than you found it?",
  },
  {
    id: "mountains",
    img: "/images/about-2.jpg",
    number: "02",
    title: "The Mountains Called",
    body: "The first videos were just raw — shaky shots of mountain roads, local chai stalls, trails that ended in fog. No script. No crew. Just one person documenting the beauty that most people scroll past. But the beauty came with a catch: plastic bottles, wrappers, bags — left behind by the very people who came to admire the view.",
  },
  {
    id: "realization",
    img: "/images/about-3.jpg",
    number: "03",
    title: "The Realization",
    body: "It started small. Picking up a bottle here, a packet there. But the more trails you walk, the more you see — the problem isn't just trash, it's the mindset. A bottle on a mountain peak didn't fly there. Someone carried it up, enjoyed the view, and left it behind. The forests don't speak, but they show you everything.",
  },
  {
    id: "mission",
    img: "/images/about-4.jpg",
    number: "04",
    title: "The Mission",
    body: "That's when the camera stopped being just a camera. Every video became a record — of beauty and of what threatens it. The mission: use the channel's revenue to place and maintain dustbins in high-traffic mountain and beach areas. Not a charity. A responsibility. One trail at a time.",
  },
  {
    id: "horizon",
    img: "/images/about-5.jpg",
    number: "05",
    title: "The Horizon",
    body: "Today, it's still just one person and a camera. 45 journeys. 45 kilograms of waste removed. 56 locations mapped. The goal isn't fame — it's showing that adventure and responsibility aren't opposites. You can chase the horizon and still take care of the ground beneath your feet.",
  },
];

/* ─── FadeIn wrapper ────────────────────────────────────────── */

function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}) {
  const variants = {
    up: { y: 40 },
    left: { x: 60 },
    right: { x: -60 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Story Section ─────────────────────────────────────────── */

function StorySection({
  chapter,
  index,
}: {
  chapter: (typeof CHAPTERS)[0];
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);
  const isLeft = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background image with parallax scale */}
      <motion.div
        style={{ scale: imgScale, opacity: imgOpacity }}
        className="absolute inset-0 -top-[15%] -bottom-[15%]"
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${chapter.img})` }}
        />
      </motion.div>

      {/* Gradient overlay - blends into next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-bark/60 via-bark/30 to-bark/60" />

      {/* Decorative top gradient glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bark/40 to-transparent" />
      {/* Decorative bottom gradient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bark/40 to-transparent" />

      {/* Content */}
      <div className={`relative z-10 w-full px-6 md:px-16 lg:px-24`}>
        <div className={`max-w-xl ${isLeft ? "ml-0 mr-auto" : "ml-auto mr-0"}`}>
          {/* Chapter number */}
          <FadeIn delay={0.1} direction={isLeft ? "left" : "right"}>
            <span className="font-serif text-[11px] uppercase tracking-[0.5em] text-clay">
              Chapter {chapter.number}
            </span>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={0.25} direction={isLeft ? "left" : "right"}>
            <h2 className="mt-4 font-serif text-4xl italic leading-tight text-cream md:text-6xl lg:text-7xl">
              {chapter.title}
            </h2>
          </FadeIn>

          {/* Divider */}
          <FadeIn delay={0.35} direction={isLeft ? "left" : "right"}>
            <div className="my-6 h-px w-16 bg-clay/60" />
          </FadeIn>

          {/* Body */}
          <FadeIn delay={0.5} direction={isLeft ? "left" : "right"}>
            <p className="text-sm leading-relaxed text-cream/80 md:text-base lg:text-lg">
              {chapter.body}
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Chapter number - large decorative */}
      <div className={`absolute bottom-8 ${isLeft ? "right-8" : "left-8"} z-10 hidden md:block`}>
        <span className="font-serif text-[12rem] font-bold leading-none text-cream/[0.04] select-none">
          {chapter.number}
        </span>
      </div>
    </section>
  );
}

/* ─── Main export ───────────────────────────────────────────── */

export default function AboutParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalChapters = CHAPTERS.length;

  return (
    <div ref={containerRef}>
      {/* Hero intro */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bark">
        {/* Hero image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/about-1.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/50 via-bark/30 to-bark/60" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-6 text-center"
        >
          <p className="text-xs uppercase tracking-[0.5em] text-clay">
            The Story
          </p>
          <h1 className="mt-6 font-serif text-5xl italic leading-tight text-cream md:text-7xl lg:text-8xl">
            How TheSocialTraveller
            <br />
            <span className="text-clay">came to be</span>
          </h1>
          <div className="mx-auto mt-8 h-px w-16 bg-clay/60" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="text-cream/40">
              <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6" cy="6" r="2" fill="currentColor">
                <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">Scroll</span>
          </div>
        </motion.div>
      </section>

      {/* Story chapters - stacked images with seamless transitions */}
      {CHAPTERS.map((chapter, i) => (
        <StorySection key={chapter.id} chapter={chapter} index={i} />
      ))}

      {/* Closing quote */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-bark">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/images/about-5.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bark via-bark/80 to-bark" />
        <FadeIn>
          <div className="relative z-10 max-w-3xl px-6 text-center">
            <span className="block font-serif text-6xl text-clay/40">&ldquo;</span>
            <p className="mt-4 font-serif text-3xl italic leading-snug text-cream/90 md:text-4xl">
              The mountains don&apos;t need visitors.
              <br />
              They need guardians.
            </p>
            <p className="mt-6 text-sm text-cream/50">
              — TheSocialTraveller
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-clay"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
