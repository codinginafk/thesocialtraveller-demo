"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import PortableText from "@/components/PortableText";

type StoryBlock = { _type: string; style?: string; children?: { text: string }[] };

/* ─── Story chapters (with Sanity data fallback) ─────────────── */

interface StoryData {
  heroQuote: string;
  introduction: string;
  body: StoryBlock[] | null;
  missionQuote: string;
  footerCallout: string;
  title: string;
}

const FALLBACK_CHAPTERS = [
  {
    id: "beginning",
    img: "/images/about-1.jpg",
    number: "01",
    title: "The Beginning",
    subtitle: "A camera. A road. A question.",
    body: "A guy with a camera. A road that had no destination. Somewhere between the Himalayan bends and the Western Ghats, the idea took shape — not as a channel, but as a question: what if travel meant leaving a place better than you found it?",
  },
  {
    id: "mountains",
    img: "/images/about-2.jpg",
    number: "02",
    title: "The Mountains Called",
    subtitle: "Raw footage. Real places.",
    body: "The first videos were just raw — shaky shots of mountain roads, local chai stalls, trails that ended in fog. No script. No crew. Just one person documenting the beauty that most people scroll past.",
  },
  {
    id: "realization",
    img: "/images/about-3.jpg",
    number: "03",
    title: "The Realization",
    subtitle: "Beauty came with a cost.",
    body: "It started small. Picking up a bottle here, a packet there. But the more trails you walk, the more you see — the problem isn't just trash, it's the mindset. Someone carried that bottle up, enjoyed the view, and left it behind.",
  },
  {
    id: "mission",
    img: "/images/about-4.jpg",
    number: "04",
    title: "The Mission",
    subtitle: "One trail at a time.",
    body: "Every video became a record — of beauty and of what threatens it. The mission: use the channel's revenue to place and maintain dustbins in high-traffic mountain and beach areas. Not a charity. A responsibility.",
  },
  {
    id: "horizon",
    img: "/images/about-5.jpg",
    number: "05",
    title: "The Horizon",
    subtitle: "Still just one person and a camera.",
    body: "45 journeys. 45 kilograms of waste removed. 56 locations mapped. The goal isn't fame — it's showing that adventure and responsibility aren't opposites. You can chase the horizon and still take care of the ground beneath your feet.",
  },
];

/* ─── FadeIn wrapper ────────────────────────────────────────── */

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Story Section ─────────────────────────────────────────── */

function StorySection({
  chapter,
}: {
  chapter: (typeof FALLBACK_CHAPTERS)[0];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background image */}
      <motion.div
        style={{ scale: imgScale, opacity: imgOpacity }}
        className="absolute inset-0"
      >
        <Image
          src={chapter.img}
          alt={chapter.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority={chapter.number === "01"}
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-bark/50" />
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-bark/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bark/60 to-transparent" />

      {/* Content — left-aligned panel */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
        <div className="max-w-xl">
          {/* Grad number */}
          <FadeIn delay={0.1}>
            <span className="font-serif text-[11px] uppercase tracking-[0.5em] text-clay">
              Chapter {chapter.number}
            </span>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={0.2}>
            <h2 className="mt-4 font-serif text-4xl italic leading-tight text-cream md:text-6xl lg:text-7xl">
              {chapter.title}
            </h2>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.3}>
            <p className="mt-2 font-serif text-lg italic text-cream/60 md:text-xl">
              {chapter.subtitle}
            </p>
          </FadeIn>

          {/* Divider */}
          <FadeIn delay={0.35}>
            <div className="my-6 h-px w-12 bg-clay/60" />
          </FadeIn>

          {/* Body */}
          <FadeIn delay={0.45}>
            <div className="rounded-xl bg-bark/40 px-6 py-5 backdrop-blur-sm md:px-8 md:py-6">
              <p className="text-sm leading-relaxed text-cream/90 md:text-base lg:text-lg">
                {chapter.body}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Main export ───────────────────────────────────────────── */

export default function AboutParallax({ story }: { story: StoryData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Use Sanity data to build chapters, fall back to hardcoded if empty
  const hasContent = story.heroQuote || story.introduction || story.missionQuote;
  const chapters = FALLBACK_CHAPTERS; // always show the story

  return (
    <div ref={containerRef}>
      {/* Hero intro */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="/images/about-1.jpg"
          alt="Mountain road landscape"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/50 via-bark/40 to-bark/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-6 text-center"
        >
          <p className="text-xs uppercase tracking-[0.5em] text-clay">
            {story.title || "The Story"}
          </p>
          <h1 className="mt-6 font-serif text-5xl italic leading-tight text-cream md:text-7xl lg:text-8xl">
            How TheSocialTraveller
            <br />
            <span className="text-clay">came to be</span>
          </h1>
          <div className="mx-auto mt-8 h-px w-16 bg-clay/60" />
          {story.heroQuote && (
            <FadeIn delay={0.4}>
              <blockquote className="mx-auto mt-10 max-w-2xl rounded-xl bg-bark/40 px-8 py-5 backdrop-blur-sm">
                <p className="font-serif text-xl italic leading-snug text-cream/90 md:text-2xl">
                  &ldquo;{story.heroQuote}&rdquo;
                </p>
              </blockquote>
            </FadeIn>
          )}
        </motion.div>

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

      {/* Introduction section */}
      {(story.introduction || hasContent) && (
        <section className="relative flex min-h-[50vh] items-center bg-stone">
          <div className="container-page py-16 md:py-24">
            <FadeIn>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-clay">The Story So Far</p>
                <div className="mx-auto mt-4 h-px w-12 bg-clay/40" />
                <p className="mt-8 text-lg leading-relaxed text-ink md:text-xl">
                  {story.introduction || "Every journey starts with a single step — or in this case, a single bottle picked up on a mountain trail."}
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Story chapters */}
      {chapters.map((chapter, i) => (
        <StorySection key={chapter.id} chapter={chapter} />
      ))}

      {/* Sanity body content */}
      {story.body && (
        <section className="relative bg-cream py-20">
          <div className="container-page max-w-3xl">
            <FadeIn>
              <div className="prose-custom">
                <PortableText value={story.body} />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Mission quote */}
      {story.missionQuote && (
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-forest">
          <div className="absolute inset-0 bg-gradient-to-t from-bark/40 to-transparent" />
          <FadeIn>
            <div className="relative z-10 max-w-3xl px-6 text-center">
              <span className="block font-serif text-6xl text-clay/30">&ldquo;</span>
              <p className="mt-4 font-serif text-3xl italic leading-snug text-cream/90 md:text-4xl">
                {story.missionQuote}
              </p>
              <div className="mx-auto mt-8 h-px w-12 bg-clay/40" />
            </div>
          </FadeIn>
        </section>
      )}

      {/* Closing — guardian quote */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-bark">
        <Image
          src="/images/about-5.jpg"
          alt="Sunset landscape"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bark via-bark/80 to-bark" />
        <FadeIn>
          <div className="relative z-10 max-w-3xl px-6 text-center">
            <span className="block font-serif text-6xl text-clay/30">&ldquo;</span>
            <p className="font-serif text-3xl italic leading-snug text-cream/80 md:text-4xl">
              The mountains don&apos;t need visitors.
              <br />
              They need guardians.
            </p>
            <p className="mt-6 text-sm text-cream/40">
              — TheSocialTraveller
            </p>
            {story.footerCallout && (
              <p className="mx-auto mt-8 max-w-xl text-sm text-cream/60 md:text-base">
                {story.footerCallout}
              </p>
            )}
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
