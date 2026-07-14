import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import type { JourneyDoc } from "@/lib/journey";
import MapIndiaWrapper from "@/components/MapIndiaWrapper";
import { PLACES } from "@/lib/places";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Map",
  description: "Every pin is a story. Explore 59 locations across India.",
  openGraph: { title: "Map — TheSocialTraveller" },
};

export default async function MapPage() {
  const allJourneys = await client
    .fetch<JourneyDoc[]>(
      `*[_type == "journey" && !isShort && defined(places) && defined(youtubeId)] | order(publishedAt desc){ _id, youtubeId, title, places, region }`,
      {},
      { next: { revalidate: 3600 } },
    )
    .catch(() => []);

  const placeVideos: Record<string, string> = {};
  const regionVideos: Record<string, string> = {};
  let latestPlace: string | null = null;

  for (const j of allJourneys) {
    if (j.places && j.youtubeId) {
      for (const p of j.places) {
        if (!placeVideos[p]) placeVideos[p] = j.youtubeId;
      }
      if (!latestPlace && j.places[0]) latestPlace = j.places[0];
    }
    if (j.youtubeId && j.region && !regionVideos[j.region]) {
      regionVideos[j.region] = j.youtubeId;
    }
  }

  for (const place of PLACES) {
    if (!placeVideos[place.name] && regionVideos[place.region]) {
      placeVideos[place.name] = regionVideos[place.region];
    }
  }

  return (
    <div className="min-h-screen bg-forest pt-24">
      <div className="container-page py-12">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Explore the Map
          </p>
          <h1 className="mt-2 font-serif text-4xl italic text-cream md:text-5xl">
            Every pin is a story.
          </h1>
          <p className="mt-4 max-w-md text-cream/70">
            Click a place. Watch the journey.
          </p>
        </div>
        <MapIndiaWrapper
          placeVideos={placeVideos}
          latestPlace={latestPlace}
        />
      </div>
    </div>
  );
}
