// Maps a video's extracted place names to a broader travel REGION, so the
// Trips grid can offer a region filter. Place strings are the ones the
// analyzer/gazetteer emits (real names from the video title/description).

type RegionDef = { name: string; places: string[] };

const REGION_DEFS: RegionDef[] = [
  {
    name: "Himachal & Spiti",
    places: [
      "Shimla", "Manali", "Spiti", "Kinnaur", "Kaza", "Kasol", "Kullu",
      "Tirthan", "Dalhousie", "Khajjiar", "Solang", "Rohtang", "Himachal",
      "Dharamshala", "McLeodganj", "Mcleodganj",
    ],
  },
  {
    name: "Uttarakhand",
    places: [
      "Rishikesh", "Uttarakhand", "Dehradun", "Mussoorie", "Auli",
      "Nainital", "Haridwar",
    ],
  },
  {
    name: "Ladakh & Kashmir",
    places: ["Ladakh", "Leh", "Srinagar", "Gulgarm", "Kashmir", "Pahalgam", "Sonmarg"],
  },
  {
    name: "North-East",
    places: [
      "Meghalaya", "Shillong", "Cherrapunji", "Arunachal", "Tawang",
      "Sikkim", "Gangtok",
    ],
  },
  {
    name: "Beaches & South",
    places: [
      "Goa", "Kerala", "Munnar", "Alleppey", "Alappuzha", "Kochi",
      "Andaman", "Pondicherry", "Gokarna", "Coorg", "Karnataka",
      "Konkan", "Tarkarli", "Mumbai",
    ],
  },
  {
    name: "Rajasthan & Desert",
    places: ["Rajasthan", "Jaipur", "Udaipur", "Jaisalmer", "Pushkar", "Jodhpur"],
  },
  {
    name: "Plains & Heritage",
    places: ["Varanasi", "Agra", "Delhi"],
  },
];

// Build a lowercase place -> region lookup once.
const PLACE_TO_REGION: Record<string, string> = {};
for (const r of REGION_DEFS) {
  for (const p of r.places) PLACE_TO_REGION[p.toLowerCase()] = r.name;
}

export const REGION_NAMES: string[] = REGION_DEFS.map((r) => r.name);

export function getRegion(places: string[]): string {
  for (const p of places) {
    const region = PLACE_TO_REGION[p.toLowerCase()];
    if (region) return region;
  }
  return places.length ? "Other destinations" : "Unsorted";
}
