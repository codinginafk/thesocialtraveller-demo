// Seed honest PLACEHOLDER content into Sanity so the site isn't empty.
// siteSettings uses the real, verified social URLs (footer links).
// aboutPage + announcement are clearly marked placeholders for the creator
// to replace via /studio. Run: node --import tsx scripts/seed-content.ts
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const p = resolve(process.cwd(), file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      )
        val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}
loadEnvFiles();

async function main() {
  const { writeClient } = await import("../src/sanity/lib/writeClient");

  await writeClient.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "TheSocialTraveller",
    missionStatement: "Why take the paths they ignore?",
    subline: "",
    youtubeUrl: "https://www.youtube.com/@TheSocialTraveller-2021",
    instagramUrl: "https://www.instagram.com/TheSocialTraveller-2021",
    facebookUrl: "https://www.facebook.com/thesocialtraveller",
  });
  console.log("[seed] siteSettings");

  await writeClient.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    title: "Meet the Traveller Behind the Trail",
    heroQuote:
      "Why do we let someone else define our future? How will someone without self-belief write his own destiny?",
    introduction:
      "I'm the person who'd rather take the path my own heart points to than the one everyone says to follow.",
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "That question is what sends me down these roads — from the Himalayan quiet of Shimla & Manali to the monsoon waterfalls of Malshej, the toy-train hush of Matheran, and the weekend getaways around Pune.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "b2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s2",
            text: "I film the places that stop me mid-breath: a zipline over the Chandra River, the 10,000-ft hush of the Atal Tunnel, or pink flamingos drifting through Malshej in the rains. But these trips aren't only about the view.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "b3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s3",
            text: 'Somewhere between the waterfalls, I started picking up what others left behind. Not to scold — I won\'t blame the person who dropped it. Just to act. Like I always say on the trail: "It\'s not my trash, but it\'s our planet for sure." I collect what I can, hand it to the nearest village, and keep walking.',
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "b4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s4",
            text: "That's the whole idea here: come for the adventure, notice the impact. Every video, every guide, and every trip is about seeing a place clearly and leaving it a little lighter than we found it.",
            marks: [],
          },
        ],
      },
    ],
    missionQuote: "It's not my trash, but it's our planet for sure.",
    footerCallout:
      "If you're planning to visit the mountains, I have just one small ask: take your trash back with you. Put it where it belongs. The trails are nicer that way — and so are we.",
  });
  console.log("[seed] aboutPage");

  await writeClient.createOrReplace({
    _id: "fieldNote.welcome",
    _type: "fieldNote",
    title: "Welcome to TheSocialTraveller (placeholder note)",
    slug: { _type: "slug", current: "welcome-to-thesocialtraveller" },
    publishedAt: new Date().toISOString(),
    pinned: true,
    excerpt: "A placeholder Field Note while the site is being set up.",
    tags: ["intro"],
    body: [
      {
        _type: "block",
        _key: "a1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "t1",
            text: "This is a placeholder note. Real Field Notes will be authored in the Sanity Studio by the creator.",
            marks: [],
          },
        ],
      },
    ],
  });
  console.log("[seed] fieldNote (placeholder)");

  console.log("[seed] DONE");
}

main().catch((e) => {
  console.error("[seed] FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
