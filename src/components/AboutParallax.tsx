"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef}>
      {/* Hero — image visible, no curtain effect */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/about-hero.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bark/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-6 text-center"
        >
          <h1 className="font-serif text-4xl italic leading-tight text-cream md:text-6xl lg:text-7xl">
            <span className="block">TheSocialTraveller</span>
          </h1>
          <div className="mx-auto mt-6 h-px w-12 bg-clay/50" />
          <p className="mt-6 font-serif text-lg italic text-cream/80 md:text-xl">
            One person. One camera. One promise to the mountains.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-1.5">
            <svg width="10" height="18" viewBox="0 0 12 20" fill="none" className="text-cream/40">
              <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6" cy="6" r="2" fill="currentColor">
                <animate attributeName="cy" values="6;14;6" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <span className="text-[9px] uppercase tracking-[0.3em] text-cream/40">Scroll</span>
          </div>
        </motion.div>
      </section>

      {/* The Story */}
      <section className="bg-cream py-20">
        <div className="container-page max-w-3xl">
          <FadeIn>
            <p className="font-serif text-xl italic leading-relaxed text-bark md:text-2xl">
              A camera. A road. A question: what if travel meant leaving a place better than you found it?
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="my-8 h-px w-16 bg-clay/40" />
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base leading-relaxed text-ink-soft">
              2012. A guy from India with a camera. Mountain roads, beach sunsets, quiet trails. He filmed because the view deserved to be seen — not for likes. But the more he filmed, the more he saw: plastic at 12,000 feet. Bottles half-buried in sand. Chip packets tucked behind rocks.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              So he bent down and picked it up. No crew. No sponsor. Just him, his camera, a garbage bag. He filmed it — the beauty and the mess — and put it on YouTube. People watched. 89,000 of them. 27 million times. 48 videos. Not for the algorithm. Because somewhere deep down we know: adventure and responsibility belong together.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              Today, 45 kg of waste. 59 locations. Ladakh to Goa. Himachal to Varanasi. Every video is a trip. Every trip, a cleanup. He films — not to flex. To show what one person can do.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Promise — quote on light */}
      <section className="bg-cream py-20">
        <div className="container-page max-w-3xl text-center">
          <FadeIn>
            <span className="block font-serif text-5xl text-clay/20">&ldquo;</span>
            <p className="font-serif text-3xl italic leading-snug text-bark md:text-4xl">
              The mountains don&apos;t need visitors.
              <br />
              They need guardians.
            </p>
            <p className="mt-4 text-sm text-ink-soft">
              &mdash; TheSocialTraveller
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Impact + Connect — green */}
      <section className="relative overflow-hidden bg-forest py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest to-bark/30" />
        <div className="container-page relative z-10 text-center">
          <FadeIn>
            <p className="font-serif text-xl italic leading-relaxed text-cream/70 md:text-2xl">
              If the channel ever makes money — every rupee goes to dustbins on mountain trails. Maintained by locals.{" "}
              <span className="text-clay">Not charity. Responsibility.</span>
            </p>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/50">
              Can&apos;t join a cleanup? Just watch. Your view pays for the next dustbin. Your share spreads the word. Attention is action.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="mt-12 font-serif text-2xl italic leading-relaxed text-cream/90 md:text-3xl">
              Small numbers.
              <br />
              <span className="text-clay">Not so small intentions.</span>
            </p>
          </FadeIn>

          <div className="mt-10 grid grid-cols-2 gap-10 md:grid-cols-4">
            {[
              { value: "89K+", label: "who watched. who listened. who cared." },
              { value: "27M+", label: "collective minutes with these mountains" },
              { value: "45 kg", label: "carried down. so the trail could breathe." },
              { value: "59", label: "places. not pins. memories." },
            ].map((stat) => (
              <FadeIn key={stat.label}>
                <div className="text-center">
                  <p className="font-serif text-4xl text-cream md:text-5xl">{stat.value}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.15em] text-cream/60">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="mx-auto mt-14 max-w-lg border-t border-cream/10 pt-10">
              <p className="font-serif text-xl italic text-cream/70 md:text-2xl">
                Don&apos;t have to be on the trail to be part of this.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/50">
                A watch. A share. A conversation. That&apos;s how it grows.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.youtube.com/@TheSocialTraveller-2021"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-clay px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-clay-dark"
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/thesocialtraveller_2021/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-cream/20 px-6 py-3 text-sm font-medium text-cream/80 transition-colors hover:border-cream/40 hover:text-cream"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61559573067044"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-cream/20 px-6 py-3 text-sm font-medium text-cream/80 transition-colors hover:border-cream/40 hover:text-cream"
                >
                  Facebook
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-clay"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
