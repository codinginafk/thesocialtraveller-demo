"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─── Props ────────────────────────────────────────────────── */

interface MapIndiaProps {
  latestPlace?: string | null;
  latestYoutubeId?: string | null;
}

/* ─── Region color map ──────────────────────────────────────── */

const REGION_COLORS: Record<string, string> = {
  "Ladakh & Kashmir": "#6E9DC6",
  "Himachal & Spiti": "#4E7C59",
  Uttarakhand: "#3D6B86",
  "Rajasthan & Desert": "#C86B45",
  "Plains & Heritage": "#7C5237",
  "Beaches & South": "#2E4632",
};

/* ─── All places ────────────────────────────────────────────── */

interface Place {
  name: string;
  lat: number;
  lng: number;
  region: string;
}

const PLACES: Place[] = [
  { name: "Leh", lat: 34.16, lng: 77.58, region: "Ladakh & Kashmir" },
  { name: "Srinagar", lat: 34.08, lng: 74.8, region: "Ladakh & Kashmir" },
  { name: "Sonmarg", lat: 34.3, lng: 75.3, region: "Ladakh & Kashmir" },
  { name: "Gulmarg", lat: 34.05, lng: 74.38, region: "Ladakh & Kashmir" },
  { name: "Pahalgam", lat: 34.14, lng: 75.33, region: "Ladakh & Kashmir" },
  { name: "Vaishno Devi", lat: 33.03, lng: 74.94, region: "Ladakh & Kashmir" },
  { name: "Manali", lat: 32.24, lng: 77.18, region: "Himachal & Spiti" },
  { name: "Shimla", lat: 31.1, lng: 77.18, region: "Himachal & Spiti" },
  { name: "Dharamshala", lat: 32.22, lng: 76.32, region: "Himachal & Spiti" },
  { name: "McLeodganj", lat: 32.24, lng: 76.32, region: "Himachal & Spiti" },
  { name: "Dalhousie", lat: 32.54, lng: 75.97, region: "Himachal & Spiti" },
  { name: "Khajjiar", lat: 32.54, lng: 76.04, region: "Himachal & Spiti" },
  { name: "Kasol", lat: 32.01, lng: 77.31, region: "Himachal & Spiti" },
  { name: "Kullu", lat: 31.96, lng: 77.11, region: "Himachal & Spiti" },
  { name: "Solang", lat: 32.31, lng: 77.15, region: "Himachal & Spiti" },
  { name: "Rohtang Pass", lat: 32.37, lng: 77.25, region: "Himachal & Spiti" },
  { name: "Tirthan Valley", lat: 31.59, lng: 77.44, region: "Himachal & Spiti" },
  { name: "Spiti", lat: 32.25, lng: 78.0, region: "Himachal & Spiti" },
  { name: "Mussoorie", lat: 30.45, lng: 78.08, region: "Uttarakhand" },
  { name: "Nainital", lat: 29.4, lng: 79.46, region: "Uttarakhand" },
  { name: "Rishikesh", lat: 30.08, lng: 78.29, region: "Uttarakhand" },
  { name: "Haridwar", lat: 29.95, lng: 78.16, region: "Uttarakhand" },
  { name: "Dehradun", lat: 30.32, lng: 78.03, region: "Uttarakhand" },
  { name: "Kedarnath", lat: 30.73, lng: 79.06, region: "Uttarakhand" },
  { name: "Jaipur", lat: 26.91, lng: 75.78, region: "Rajasthan & Desert" },
  { name: "Jaisalmer", lat: 26.91, lng: 70.91, region: "Rajasthan & Desert" },
  { name: "Jodhpur", lat: 26.23, lng: 73.02, region: "Rajasthan & Desert" },
  { name: "Mount Abu", lat: 24.59, lng: 72.71, region: "Rajasthan & Desert" },
  { name: "Delhi", lat: 28.61, lng: 77.23, region: "Plains & Heritage" },
  { name: "Agra", lat: 27.18, lng: 78.02, region: "Plains & Heritage" },
  { name: "Varanasi", lat: 25.31, lng: 82.97, region: "Plains & Heritage" },
  { name: "Ayodhya", lat: 26.79, lng: 82.19, region: "Plains & Heritage" },
  { name: "Mumbai", lat: 19.07, lng: 72.87, region: "Beaches & South" },
  { name: "Matheran", lat: 18.98, lng: 73.27, region: "Beaches & South" },
  { name: "Lonavala", lat: 18.75, lng: 73.41, region: "Beaches & South" },
  { name: "Malshej Ghat", lat: 19.34, lng: 73.8, region: "Beaches & South" },
  { name: "Tamhini Ghat", lat: 18.6, lng: 73.45, region: "Beaches & South" },
  { name: "Panshet", lat: 18.37, lng: 73.53, region: "Beaches & South" },
  { name: "Bhimashankar", lat: 19.07, lng: 73.55, region: "Beaches & South" },
  { name: "Trimbakeshwar", lat: 19.93, lng: 73.53, region: "Beaches & South" },
  { name: "Shirdi", lat: 19.77, lng: 74.47, region: "Plains & Heritage" },
  { name: "Nashik", lat: 19.99, lng: 73.79, region: "Beaches & South" },
  { name: "Kalsubai", lat: 19.6, lng: 73.7, region: "Beaches & South" },
  { name: "Harishchandragad", lat: 19.39, lng: 73.74, region: "Beaches & South" },
  { name: "Goa", lat: 15.49, lng: 73.82, region: "Beaches & South" },
  { name: "Dudhsagar", lat: 15.31, lng: 74.31, region: "Beaches & South" },
  { name: "Konkan", lat: 16.5, lng: 73.5, region: "Beaches & South" },
  { name: "Mahabaleshwar", lat: 17.93, lng: 73.66, region: "Beaches & South" },
  { name: "Bangalore", lat: 12.97, lng: 77.59, region: "Beaches & South" },
  { name: "Kochi", lat: 9.93, lng: 76.27, region: "Beaches & South" },
  { name: "Munnar", lat: 10.08, lng: 77.06, region: "Beaches & South" },
  { name: "Alleppey", lat: 9.49, lng: 76.33, region: "Beaches & South" },
  { name: "Andaman", lat: 11.62, lng: 92.73, region: "Beaches & South" },
  { name: "Karnataka", lat: 14.5, lng: 75.5, region: "Beaches & South" },
  { name: "Kerala", lat: 10.5, lng: 76.5, region: "Beaches & South" },
  { name: "Kolkata", lat: 22.57, lng: 88.36, region: "Plains & Heritage" },
];

/* ─── Custom marker icon factory ────────────────────────────── */

function makeIcon(color: string, size: number = 12): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      border:2px solid #F5F1E8;
      box-shadow:0 1px 4px rgba(0,0,0,.25);
      transition:transform .15s;
    "></div>`,
  });
}

function makeActiveIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div style="
      width:18px;height:18px;
      border-radius:50%;
      background:${color};
      border:3px solid #F5F1E8;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
      transform:scale(1.1);
    "></div>`,
  });
}

/* ─── Leaflet map (pure client, no SSR) ─────────────────────── */

function LeafletMapInner({ places, latestPlace, latestYoutubeId }: { places: Place[]; latestPlace?: string | null; latestYoutubeId?: string | null }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 79],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      dragging: true,
    });

    // Warm-toned tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19 },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    // Markers
    places.forEach((place) => {
      const color = REGION_COLORS[place.region] || "#859476";
      const isLatest = latestPlace && place.name.toLowerCase() === latestPlace.toLowerCase();
      const icon = isLatest ? makeActiveIcon(color) : makeIcon(color);

      const thumbUrl = latestYoutubeId
        ? `https://i.ytimg.com/vi/${latestYoutubeId}/hqdefault.jpg`
        : null;

      const popupHtml = isLatest && thumbUrl
        ? `<div style="font-family:system-ui;min-width:180px;">
            <img src="${thumbUrl}" alt="Latest video" style="width:100%;border-radius:6px;margin-bottom:6px;" />
            <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#B25A37;margin:0 0 2px;">${place.region}</p>
            <p style="font-size:14px;font-weight:600;color:#222;margin:0;">${place.name}</p>
            <p style="font-size:11px;color:#6b6354;margin:4px 0 0;">← Latest journey</p>
          </div>`
        : `<div style="font-family:system-ui;min-width:140px;">
            <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#B25A37;margin:0 0 2px;">${place.region}</p>
            <p style="font-size:15px;font-weight:600;color:#222;margin:0;">${place.name}</p>
          </div>`;

      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml, { closeButton: false, offset: [0, -6] });

      marker.on("mouseover", function (this: L.Marker) {
        this.setIcon(makeActiveIcon(color));
        this.openPopup();
      });

      marker.on("mouseout", function (this: L.Marker) {
        this.setIcon(isLatest ? makeActiveIcon(color) : icon);
        this.closePopup();
      });

      marker.on("click", function () {
        if (isLatest && latestYoutubeId) {
          window.open(`https://www.youtube.com/watch?v=${latestYoutubeId}`, "_blank");
        }
      });
    });

    // Fly to latest place if available
    if (latestPlace) {
      const match = places.find(
        (p) => p.name.toLowerCase() === latestPlace.toLowerCase(),
      );
      if (match) {
        setTimeout(() => {
          map.flyTo([match.lat, match.lng], 6, { duration: 1.5 });
        }, 500);
      }
    }

    mapInstance.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [places, latestPlace, latestYoutubeId]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}

/* ─── Loading fallback ──────────────────────────────────────── */

function MapLoader() {
  return (
    <div className="flex h-[500px] w-full items-center justify-center rounded-2xl bg-stone">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-clay border-t-transparent" />
        <p className="text-sm text-ink-soft">Loading map...</p>
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────── */

export default function MapIndia({ latestPlace, latestYoutubeId }: MapIndiaProps = {}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative w-full overflow-hidden rounded-2xl border border-sand">
        {/* Map container */}
        <div className="h-[500px] w-full">
          {loaded ? (
            <LeafletMapInner places={PLACES} latestPlace={latestPlace} latestYoutubeId={latestYoutubeId} />
          ) : (
            <MapLoader />
          )}
        </div>

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-sand/50 bg-cream/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {Object.entries(REGION_COLORS).map(([label, color]) => (
              <span key={label} className="flex items-center gap-1.5 text-ink-soft">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-4 right-4 z-[1000] rounded-xl border border-sand/50 bg-cream/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <p className="text-xs text-ink-soft">
            <span className="font-semibold text-ink">{PLACES.length}</span> locations ·{" "}
            <span className="font-semibold text-ink">45</span> journeys
          </p>
        </div>
      </div>
    </div>
  );
}
