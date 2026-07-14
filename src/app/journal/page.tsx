import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { FIELD_NOTES_QUERY } from "@/sanity/lib/queries";
import FieldNoteCard from "@/components/FieldNoteCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Thoughts from the trail — nature, cleanup, and the quiet act of leaving a place better than you found it.",
  openGraph: { title: "Journal — TheSocialTraveller" },
};

const REFLECTIONS = [
  {
    title: "The Trail Remembers",
    body: "Every mountain trail holds a memory. Not just of who walked it, but what they left behind. A plastic wrapper at 12,000 feet will sit there longer than the view that drew someone up. The trail remembers carelessness. And it remembers care.",
  },
  {
    title: "Cleaning as Prayer",
    body: "Picking up someone else\u2019s trash when no one\u2019s watching. No applause. No audience. Just you, the mountain, and a bottle that has no business being there. In that moment, you\u2019re not performing. You\u2019re giving back. Every bag carried down is a small prayer answered.",
  },
  {
    title: "What the Mountains Teach",
    body: "Mountains don\u2019t hurry. They don\u2019t compete. They just exist. Spend enough time among them and you start to get it \u2014 living well means living light. Take only what you need. Leave only footprints. And even those, gently.",
  },
  {
    title: "The Ripple",
    body: "One person picks up a bag. A viewer watches and does the same. Their friend joins. A local notices. A village meeting happens. Dustbins appear. The ripple is invisible at first. But it\u2019s real. That\u2019s why we film. Not for the algorithm. For the ripple.",
  },
  {
    title: "Of Rivers and Responsibility",
    body: "A river doesn\u2019t ask who polluted it. It just carries everything downstream. If you love these places \u2014 the rivers, the peaks, the forests \u2014 then love is not a feeling. It\u2019s bending down. Picking up. Carrying it out.",
  },
];

export default async function FieldNotesPage() {
  const notes = await client
    .fetch(FIELD_NOTES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  return (
    <div>
      {/* Hero — nature as devotion */}
      <section className="relative overflow-hidden bg-bark py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/images/footer-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/80 via-bark to-bark/90" />
        <div className="relative z-10 container-page max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-clay">
            TheSocialTraveller
          </span>
          <h1 className="mt-4 font-serif text-4xl italic leading-tight text-cream md:text-5xl">
            Cleaning is a form of devotion
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/60 md:text-base">
            Carry someone else&apos;s trash down a mountain and you&apos;re not doing chores. You&apos;re giving back to the ground that held your footsteps, the air that filled your lungs, the view that stopped your heart. Nature doesn&apos;t ask for much — just that we leave it better than we found it.
          </p>
        </div>
      </section>

      {/* Reflections */}
      <section className="container-page py-16">
        <h2 className="font-serif text-2xl text-bark md:text-3xl">
          From the Trail
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REFLECTIONS.map((r) => (
            <article
              key={r.title}
              className="rounded-xl border border-sand bg-stone p-6"
            >
              <h3 className="font-serif text-lg text-bark">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {r.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Sanity-powered field notes */}
      <section className="container-page pb-16">
        <h2 className="font-serif text-2xl text-bark md:text-3xl">
          Field Notes
        </h2>
        <p className="mt-2 text-ink-soft">
          Stories from the road.
        </p>

        {notes && notes.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((n: never) => (
              <FieldNoteCard key={(n as { _id: string })._id} note={n as never} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink-soft">
            Nothing yet. Check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
