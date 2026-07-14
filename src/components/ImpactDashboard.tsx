import type { JourneyDoc } from "@/lib/journey";

type Agg = { trips: number; trashKg: number; locations: number; regions: number };

function yearOf(j: JourneyDoc): string {
  const d = j.publishedAt ? new Date(j.publishedAt) : null;
  return d ? String(d.getFullYear()) : "—";
}

// Editorial "impact ledger" — large typography, thin rules (no boxes).
// Plus a per-year progression timeline, computed from the journey docs.
export default function ImpactDashboard({
  journeys,
  agg,
}: {
  journeys: JourneyDoc[];
  agg: Agg;
}) {
  const byYear = new Map<string, { trips: number; kg: number }>();
  for (const j of journeys) {
    if (j.isShort) continue;
    const y = yearOf(j);
    const cur = byYear.get(y) ?? { trips: 0, kg: 0 };
    cur.trips += 1;
    cur.kg += j.trashKg ?? 0;
    byYear.set(y, cur);
  }
  const years = Array.from(byYear.entries()).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );

  const ledger = [
    { value: agg.trips, label: "Journeys Completed" },
    { value: `${agg.trashKg} kg`, label: "Waste Removed" },
    { value: agg.locations, label: "Locations Documented" },
    { value: agg.regions, label: "Regions Explored" },
  ];

  return (
    <div>
      <div className="divide-y divide-sand border-y border-sand">
        {ledger.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between py-6"
          >
            <span className="font-serif text-5xl text-bark md:text-6xl">
              {row.value}
            </span>
            <span className="text-sm uppercase tracking-wide text-ink-soft">
              {row.label}
            </span>
          </div>
        ))}
      </div>

      {years.length > 0 && (
        <div className="mt-14">
          <h2 className="font-serif text-2xl text-bark">Progression</h2>
          <div className="mt-6 space-y-6">
            {years.map(([year, data]) => (
              <div key={year} className="border-l-2 border-leaf pl-5">
                <div className="font-serif text-3xl text-forest">{year}</div>
                <div className="mt-1 text-ink-soft">
                  {data.trips} journeys · {data.kg} kg removed
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
