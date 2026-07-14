"use client";

import dynamic from "next/dynamic";

const MapIndia = dynamic(() => import("@/components/MapIndia"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-2xl bg-stone">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-clay border-t-transparent" />
        <p className="text-sm text-ink-soft">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapIndiaWrapper({
  placeVideos,
  latestPlace,
}: {
  placeVideos: Record<string, string>;
  latestPlace?: string | null;
}) {
  return <MapIndia placeVideos={placeVideos} latestPlace={latestPlace ?? null} />;
}
