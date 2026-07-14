import { client } from "@/sanity/lib/client";
import { JOURNEYS_QUERY } from "@/sanity/lib/queries";
import JourneysGallery from "@/components/JourneysGallery";
import type { JourneyDoc } from "@/lib/journey";

export const revalidate = 3600;

export default async function JourneysPage() {
  const journeys = await client
    .fetch<JourneyDoc[]>(JOURNEYS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => [] as JourneyDoc[]);

  return (
    <div className="container-page py-16">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl text-bark md:text-5xl">Journeys</h1>
        <p className="mt-4 text-ink-soft">
          Every trip, documented — the film, the route, the cleanup, and the
          story behind it.
        </p>
      </header>
      <div className="mt-10">
        <JourneysGallery journeys={journeys} />
      </div>
    </div>
  );
}
