"use client";

import { useMemo, useState } from "react";
import JourneyCard from "./JourneyCard";
import type { JourneyDoc } from "@/lib/journey";

function yearOf(j: JourneyDoc): string {
  const d = j.publishedAt ? new Date(j.publishedAt) : null;
  return d ? String(d.getFullYear()) : "Unknown";
}

export default function JourneysGallery({
  journeys,
}: {
  journeys: JourneyDoc[];
}) {
  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const j of journeys) if (j.region) set.add(j.region);
    return Array.from(set).sort();
  }, [journeys]);

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const j of journeys) set.add(yearOf(j));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [journeys]);

  const [region, setRegion] = useState<string>("all");
  const [year, setYear] = useState<string>("all");

  const filtered = journeys.filter((j) => {
    if (region !== "all" && j.region !== region) return false;
    if (year !== "all" && yearOf(j) !== year) return false;
    return true;
  });

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active
        ? "border-forest bg-forest text-white"
        : "border-sand text-ink-soft hover:border-forest hover:text-forest"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button className={chip(region === "all")} onClick={() => setRegion("all")}>
          All regions
        </button>
        {regions.map((r) => (
          <button key={r} className={chip(region === r)} onClick={() => setRegion(r)}>
            {r}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className={chip(year === "all")} onClick={() => setYear("all")}>
          All years
        </button>
        {years.map((y) => (
          <button key={y} className={chip(year === y)} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-ink-soft">No journeys match this filter yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j) => (
            <JourneyCard key={j._id} journey={j} />
          ))}
        </div>
      )}
    </div>
  );
}
