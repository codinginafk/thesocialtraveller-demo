import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import {
  IMPACT_STATS_QUERY,
  JOURNEY_AGGREGATE,
} from "@/sanity/lib/queries";
import { getJourneyList } from "@/lib/journey";
import ImpactDashboard from "@/components/ImpactDashboard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Impact",
  description: "Trips, trash, trails — what the numbers actually look like. No fluff.",
  openGraph: { title: "Impact — TheSocialTraveller" },
};

export default async function ImpactPage() {
  const [impact, agg, journeys] = await Promise.all([
    client
      .fetch(IMPACT_STATS_QUERY, {}, { next: { revalidate: 3600 } })
      .catch(() => null),
    client
      .fetch<{ trips: number; trashKg: number; locations: number; regions: number }>(
        JOURNEY_AGGREGATE,
        {},
        { next: { revalidate: 3600 } },
      )
      .catch(() => null),
    getJourneyList().catch(() => []),
  ]);

  // Derived from journeys is the source of truth; fall back to hand-authored.
  const trips = agg?.trips ?? impact?.tripsCompleted ?? 0;
  const trashKg = agg?.trashKg ?? impact?.trashCollectedKg ?? 0;
  const locations = agg?.locations ?? impact?.locationsVisited ?? 0;
  const regions = agg?.regions ?? 0;

  const goal = impact?.dustbinGoal ?? 0;
  const funded = impact?.dustbinsFunded ?? 0;
  const pct = goal > 0 ? Math.min(100, (funded / goal) * 100) : 0;
  const derived = Boolean(agg && (agg.trips || agg.trashKg));

  return (
    <div className="container-page py-16">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl text-bark md:text-5xl">
          Every place leaves a story.
        </h1>
        <p className="mt-4 text-ink-soft">
          Real numbers where we have them. Honest where we don&apos;t.
        </p>
      </header>

      <div className="mt-12">
        <ImpactDashboard
          journeys={journeys}
          agg={{ trips, trashKg, locations, regions }}
        />
      </div>

      {derived && (
        <p className="mt-6 text-xs text-leaf">
          Journeys, waste &amp; locations are auto-counted from the YouTube
          films (each journey ≥ 1 kg). Run the analyzer to refresh.
        </p>
      )}

      {impact?.disclaimer && (
        <p className="mt-6 max-w-2xl text-sm text-clay">
          {impact.disclaimer}
        </p>
      )}

      {goal > 0 && (
        <div className="mt-12 max-w-2xl">
          <div className="mb-2 text-sm text-ink-soft">
            Dustbin pledge progress
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-sand">
            <div
              className="h-full rounded-full bg-leaf"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            {funded} / {goal} dustbins funded
          </p>
        </div>
      )}

      <p className="mt-12 max-w-2xl text-sm text-ink-soft">
        A full interactive journey map is coming — every location you see
        here will become a pin you can explore.
      </p>
    </div>
  );
}
