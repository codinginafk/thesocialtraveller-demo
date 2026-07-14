# DECISIONS.md — TheSocialTraveller Website

Running log of major direction choices and which session/model made them.
Intent: decisions aren't silently re-litigated across model switches.

## 2026-07-13 — Initial AGENTS.md authored (session: Hy3)

- **Wrote canonical `AGENTS.md`** from the user-supplied spec.
- **Conflict resolved — model routing:** The user supplied two drafts. The
  earlier one described 5 available models with task-based routing
  (Hy3 / North Mini Code / DeepSeek V4 Flash / MiMo-V2.5 / Nemotron 3 Ultra).
  The later paste was explicitly labeled "updates" and describes a single
  model (Hy3) with "Single-model guardrails." → **Adopted the update:**
  single-model (Hy3) is authoritative. The 5-model routing section was
  dropped. If the user later wants multi-model routing restored, flag here.
- **Conflict resolved — CMS:** Earlier draft said "No CMS initially —
  content lives in structured local data files." The update adds Sanity
  Studio (via next-sanity) as the CMS for hand-authored content. →
  **Adopted the update:** Sanity is authoritative. Local JSON files are no
  longer the primary home for hand-authored content (feed data is still
  API-fetched/cached).
- **Conflict resolved — site structure:** Update adds an "Announcements"
  section and makes Videos/Gallery "live-pulled." → Adopted the update's
  structure (Home, Impact, Videos/Gallery, Announcements, About,
  Contact/Social).
- **Flagged for creator confirmation (not yet decided):** brand direction
  final lock, real impact numbers, YouTube channel ID, Instagram Business
  account status, Sanity project setup.

## 2026-07-13 — Scaffold + Sanity setup (session: Hy3)

- **Scaffolded Next.js 16 (App Router) + Tailwind v4 + TypeScript** in the
  project root. Folder name has capitals so `create-next-app` refused it;
  scaffolded in a temp dir (`--skip-install`, `--name thesocialtraveller`),
  moved source in, then `npm install` locally.
- **Sanity wired in (next-sanity)** against the user-supplied project
  `33wj9ahn`, dataset `production`, basePath `/studio`.
  - `sanity.config.ts` (root), `sanity.cli.ts`, `src/sanity/env.ts`,
    `src/sanity/lib/{client,image,queries}.ts`, `src/sanity/structure.ts`,
    `src/sanity/schemaTypes/{siteSettings,impactStats,aboutPage,announcement}.ts`.
  - Studio embedded at `src/app/studio/[[...tool]]/` via `NextStudio`.
- **Build fixes required (logged because they are non-obvious):**
  - `defineConfig` must be imported from `sanity`, **not** `next-sanity`.
  - Sanity's `swr` dependency breaks under Turbopack's `react-server` export
    condition (no default export). Fixed by loading `NextStudio` **client-only**
    (`next/dynamic`, `ssr: false`) from a `'use client'` wrapper, so Sanity's
    client libs never run in the RSC graph. `force-static` kept on the route
    for a static shell + metadata.
  - `swr` pinned to `2.2.5` via `overrides` (sanity 6.4.0 pulls ^2.4.2).
  - `SortOrdering` in the announcement schema needs an explicit `name`.
- **Content honesty:** `scripts/seed.ndjson` seeds `siteSettings` (real
  YouTube URL + drafted mission — draft copy, confirm with creator) and
  `impactStats` (all zeros + `disclaimer` "illustrative / in-progress"). No
  invented impact stats. `aboutPage` and `announcement` left empty for the
  creator to author in Studio.
- **Real channel numbers obtained (third-party analytics, approximate):**
  ~86.3K subscribers, ~0.78% engagement, based in Goa, India. Top videos:
  Kerala Tour (~24.6K views), Manali (~19.6K), Goa Guide (~19.5K), Jaipur
  (~18.8K), Mahabaleshwar (~17K), Mussoorie (~15.7K), Nainital (~14.3K),
  Varanasi (~13.9K). These are channel metrics, NOT impact/cleanup stats.

## 2026-07-13 — v1 pages built + live dev preview (session: Hy3)

- **Built all v1 pages** (App Router, server components reading Sanity via
  `client.fetch` with `next:{revalidate}`): Home (hero + mission + impact
  teaser + latest announcements), Impact (stats grid + dustbin progress bar),
  Videos (YouTube gallery + Instagram "coming soon" note), Announcements
  (list + `[slug]` detail), About, Contact. Shared `SiteHeader` (client, mobile
  menu) + `SiteFooter` in `layout.tsx`.
- **Build gotcha — Next 16 segment configs must be literals:** `export const
  revalidate = 60 * 60 * 3` (expression) throws "Invalid segment configuration
  export" in Next 16. Fixed by using literal numbers (`10800`, `3600`).
  Page-level `revalidate` kept for ISR; `fetch`-level `revalidate` also set.
- **Studio route fix:** optional catch-all `app/studio/[[...tool]]` 404s in dev
  (works in `next build`). Switched to required catch-all `app/studio/[...tool]`
  + a redirect `/studio` → `/studio/structure` in `next.config.ts`. Now 200.
- **YouTube — Data API v3 integration built:** `src/lib/youtube.ts` now fetches
  the channel's `uploads` playlist via `channels?forHandle=…` →
  `playlistItems`, server-side only, cached 3h via `revalidate`. The API key
  reads from the **server-only** `YOUTUBE_API_KEY` env (never sent to client).
  Keyless RSS remains as a fallback. Video section stays empty until the key is
  provided (this env blocked the RSS path). Per AGENTS: server-side fetch, key
  never reaches client, cached on a schedule. **Pending: supply `YOUTUBE_API_KEY`.**
- **Seed import blocked:** `sanity dataset import` requires `sanity login`
  (interactive, browser). Could not run from this session. Pages currently
  render with fallbacks (draft mission text on Home; empty Impact/About/
  Announcements). Creator can: (a) `npx sanity login` then
  `npx sanity dataset import scripts/seed.ndjson --dataset production`, or
  (b) log into `/studio` via browser and author content directly.
- **Preview server:** `npm run dev` running at http://localhost:3000
  (Home/Impact/Videos/Announcements/About/Contact all 200; `/studio` → 307 →
  `/studio/structure` 200).

## 2026-07-14 — Performance, Videos bifurcation, contact info (session: Hy3)

- **Performance pass (owner complained videos re-fetch + late placeholders):**
  - `src/lib/youtube.ts` now has an **in-memory module cache** (one fetch per
    3h across all page renders/dev reloads) on top of Next's `revalidate`.
  - `VideoCard` thumbnails switched to **`next/image`** (`fill` + `sizes`)
    → reserves aspect box, no late pop-in / layout shift.
  - `layout.tsx` adds **`preconnect`/`dns-prefetch`** to `i.ytimg.com`.
  - Home + Videos pages now **stream via `<Suspense>`** — page shell renders
    instantly, video grid/embed streams in. Each section has a skeleton fallback.
- **Videos page bifurcation (owner-directed):** split into **"Trips"** (long
  videos, counted as trips) and **"Shorts & Clips"** (not counted as trips).
  - Shorts detection: **real `duration < 60s` via Data API v3** when the key
    works; **`#shorts` heuristic** on the RSS fallback path (no duration there).
  - `countTrips()` helper added; `YouTubeVideo` gained `durationSec` /
    `isShort` / `description` (description captured for the analyzer below).
- **Contact / socials (owner-directed):** researched creator's public info.
  - Email **`info@way4travels.com`** (on YouTube channel + About) added to
    `/contact`.
  - Handles confirmed from channel description: YouTube `@TheSocialTraveller-2021`,
    Instagram `TheSocialTraveller-2021`, Facebook `thesocialtraveller`.
    `/contact` + footer fallbacks updated.
- **Direction change (owner overrode AGENTS):** impact numbers are to be
  **auto-derived from YouTube videos**, not only hand-authored in Sanity:
  every (long) video = 1 trip; ≥1 kg trash/video unless the video shows/
  mentions a specific amount; places mentioned = trip locations. This is a
  deviation from AGENTS ("impact stats live in Sanity, hand-authored") and
  needs a Sanity schema for per-video analysis + a runner. **Implementation
  deferred — surfaced to owner for the transcript-source / analyzer / storage
  decisions (new dependency + schema change + credential handling).**

## 2026-07-14 — Impact bot implemented (session: Hy3)

- **Per-video `videoImpact` Sanity schema** added (`src/sanity/schemaTypes/videoImpact.ts`,
  indexed in `schemaTypes/index.ts`, listed in `structure.ts`). One doc per
  YouTube video keyed `_id = "videoImpact.<videoId>"`. Fields: videoId,
  isShort, title, places[], trashKg (≥1, min 0), source, analyzedAt, note.
- **Aggregate GROQ** `VIDEO_IMPACT_AGGREGATE` computes
  `trips = count(non-short)`, `trashKg = sum(trashKg of non-short)`,
  `locations = count(unique places)`. Impact page + Home stats now read this
  (derived) and fall back to hand-authored `impactStats` when empty.
- **`src/lib/analyzer.ts`** — LLM-based extraction of `{places, trashKg}`
  from title+description. Plain `fetch` to openai|anthropic|gemini REST
  (NO new npm dep; just `LLM_API_KEY` + `LLM_PROVIDER` env). Returns
  graceful default (no places, trashKg=null) when no key.
- **`src/sanity/lib/writeClient.ts`** — separate Sanity **write** client using
  `SANITY_WRITE_TOKEN` (server-only). Public `client` stays read-only.
- **`scripts/analyze.ts`** (`npm run analyze`, run via `tsx`) — fetches
  videos, upserts one `videoImpact` doc each. **Monotonic rules (owner):**
  never deletes; existing videos are skipped (idempotent); trashKg only
  rises. If YouTube returns nothing (blocked/offline) it exits WITHOUT
  wiping — previously stored docs are kept (old data honored).
- **Owner rules encoded:** every long video = 1 trip; **shorts = under
  2 min (`IS_SHORT_MAX_SEC = 120`) are NOT counted as trips**; trash
  defaults to 1 kg/video unless the video states a specific amount (transcript
  analysis deferred to later). Default 1 kg/trip confirmed.
- **Credentials still needed to actually run the analyzer:**
  `SANITY_WRITE_TOKEN` (Sanity write token) + `LLM_API_KEY`
  (+`LLM_PROVIDER`). Until supplied, the site runs in **degraded
  mode**: Impact shows 0s/disclaimer (falls back to `impactStats`), and
  `/impact` aggregate returns empty. The no-token guard in the runner
  was smoke-tested (fires correctly).
- **Remaining pre-launch:** `next/image` for the 3 Sanity images
  (about portrait, announcement cover, announcement detail) — `eslint` still
  warns (warning, not error). YouTube thumbnails already on `next/image`.

- **Also done (same session):** (a) `next/image` migration for the 3 Sanity
  images — About portrait, announcement `[slug]` cover, and
  `AnnouncementCard` cover. `eslint` now reports **0 warnings** (was 3).
  (b) **Daily Vercel Cron**: `vercel.json` `crons` →
  `app/api/cron/analyze/route.ts` (GET, `force-dynamic`, `nodejs`),
  which calls the shared `src/lib/analyze-runner.ts`. Protected by
  `CRON_SECRET` (Vercel signs with `Authorization: Bearer <secret>`).
  Smoke-tested: `GET /api/cron/analyze` → 200 + JSON, graceful
  when `SANITY_WRITE_TOKEN` absent. The CLI `npm run analyze` and
  the cron now share one code path.

## 2026-07-14 — Impact bot LIVE (session: Hy3)

- **Analyzer fully working end-to-end.** Supplied an **OpenRouter** key +
  model `nvidia/nemotron-3-ultra-550b-a55b:free`. Added an `openrouter`
  provider (OpenAI-compatible endpoint) in `src/lib/analyzer.ts`.
- **Bug fixed:** the standalone `npm run analyze` (plain `tsx`) did NOT load
  `.env.local` (only Next.js does), so every LLM call was a silent 401 →
  empty results. Added a `.env.local`/`.env` loader; because `analyze-runner`
  reads `SANITY_WRITE_TOKEN` at module-load, the runner is now **dynamically
  imported** after the env loads.
- **Bug fixed:** `VIDEO_IMPACT_AGGREGATE` used GROQ `sum(...)` which does
  not exist — must be `math::sum(...)`. (The Impact page query was broken.)
- **Write verified:** with an **Editor** Sanity token (`SANITY_WRITE_TOKEN`,
  the "Access Manager" token the user first gave was read-only and correctly
  failed with "permission create required"), `npm run analyze` created **15**
  `videoImpact` docs. Aggregate = `trips:15, trashKg:15, locations:3`.
- **Live site reads real data:** the Sanity dataset is **private**, so the
  public CDN client returned empty. `src/sanity/lib/client.ts` now uses a
  token when present (`SANITY_READ_TOKEN`, else falls back to
  `SANITY_WRITE_TOKEN`) and disables the CDN in that case. `/impact` now
  renders **15 trips / 15 kg / 3 locations** (verified via dev server).
- **Strapi:** NOT used. This project uses **Sanity** (per AGENTS.md). No
  Strapi credentials or code are involved — the user's Strapi details are
  irrelevant to TheSocialTraveller and were not actioned.

- **Production build passes** (`npm run build`, `exit=0`, no type/lint
  errors). Routes: `/`,`/about`,`/announcements`,`/contact`,`/impact`,
  `/videos` static (revalidate 1h); `/api/cron/analyze` + `/studio`
  dynamic. NOTE: static pages query Sanity at **build time**, so the
  Vercel build needs the Sanity/LLM env vars set or pages bake in 0s.
- **Seeded Sanity content** (honest placeholders) via a write-token
  script (`scripts/seed-content.ts`, run with `node --import tsx`):
  - `siteSettings`: real verified social URLs (YouTube @TheSocialTraveller-2021,
    Instagram TheSocialTraveller-2021, Facebook thesocialtraveller) → footer
    links now work.
  - `aboutPage`: placeholder body (creator to replace in `/studio`).
  - `announcement` ("welcome" placeholder, pinned) so /announcements
    isn't empty.
  Verified live: /about + /announcements render, footer links present.

## Open questions / TODO
- [x] Define earthy palette / type / spacing spec (Phase3 design lock) — done,
   verbatim in AGENTS.md.
- [ ] Confirm brand direction with creator (AGENTS.md: "pre-build").
- [x] YouTube Data API v3 integration **coded** (server-side, key in
   `YOUTUBE_API_KEY`, cached 3h). **Still BLOCKED:** Google Cloud key
   restriction blocks `youtube.api.v3...List`; site uses RSS fallback. Fix
   key restrictions (API restriction → YouTube Data API v3) for full history
   + real `duration` (currently #shorts is URL-heuristic only).
- [ ] Confirm Instagram Business/Creator account + Meta App Review status.
- [ ] Import `scripts/seed.ndjson` into Sanity (needs `sanity login`, or use
   `/studio` browser login) to populate About/Announcements (impact now comes
   from the auto-analyzer, not seed).
- [ ] Set Vercel env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   `NEXT_PUBLIC_SANITY_DATASET`, `LLM_PROVIDER`=openrouter, `LLM_API_KEY`
   (OpenRouter), `LLM_MODEL`, `SANITY_WRITE_TOKEN`, `CRON_SECRET`.
- [x] Sanity dataset set to **Public** (production). NOTE: in this
   project, "Public" visibility ALONE does NOT enable anonymous API reads
   — both anon API **and** anon CDN return `0`, while tokened reads
   return `15`. (Either propagation/stale flag, a project-level gate, or
   Sanity's 2024+ model ties anon API to something not yet enabled.)
- **CORS clarification:** CORS origins is a LIST — you can ADD
   `http://localhost:3000` alongside the existing `localhost:3333`
   WITHOUT deleting it. BUT CORS only governs BROWSER→API calls; our
   Sanity reads are server-side (Next.js), so CORS is irrelevant to the
   `0` result (proven: a server-side curl with no CORS also returned 0).
- **Decision: keep tokened read.** Because anon access won't enable here,
   `src/sanity/lib/client.ts` uses a token (explicit `SANITY_READ_TOKEN`,
   else falls back to `SANITY_WRITE_TOKEN`). `/impact` shows real
   **15 / 15 kg / 3**. This is secure (server-only token) and fast enough
   (cached); Lighthouse is about payload/images, not this tiny query.
- If the user still wants true token-free CDN: toggle visibility
   Public→Private→Public to force a sync, add `localhost:3000` to CORS,
   wait, then re-test anon CDN. If it still returns 0, it's a Sanity-side
   limitation and we keep the tokened read.
- **RE-TESTED** after CORS(`localhost:3000`) + Public both set: anon
   API **and** CDN STILL return `0` (server-side curl, so CORS is
   irrelevant). Confirms anonymous API access is OFF at the API level
   regardless of CORS. → keep tokened read (returns 15).
- User created a new **"content-write" Editor token** (equiv to the existing
   `SANITY_WRITE_TOKEN`). If they want to swap/rotate to it, they must
   paste its `sk...` value; I'll update `.env.local` and they can delete
   the older token in Sanity for hygiene. (No code change needed otherwise.)
- [ ] (Optional, later) Transcripts: current analyzer uses title+description
   only, so "locations" is low. Add transcript fetch for richer place extraction.
- [ ] Rotate the leaked "Access Manager" token (it was limited/read-only, but
    was pasted in chat).

## 2026-07-14 — Impact bot hardening: rate-limit + short fix + full history (session: Hy3)

- **YouTube API unblocked:** user supplied a new key restricted to YouTube Data
  API v3 (`AIzaSyDvIKq8Q4uO6JMyzpg8gjLi_5cUEG2r2-k`). `getLatestVideos(50)`
  now returns **48 videos** with real `duration` → correct `isShort` via
  `<120s` (3 shorts, 45 longs). RSS heuristic (`#shorts`) was wrong (Shorts
  URLs are `/shorts/<id>`); API is now primary. Resolves the old
  "Google Cloud key restriction blocks youtube.api.v3...List" TODO.
- **`/videos` bug fixed:** `src/app/videos/page.tsx` hard-coded
  `getLatestVideos(24)` → only 24 cards. Raised to `50` → all 48 now render.
- **Shorts mis-counted as trips (bug):** `analyze-runner.ts` set `trashKg=0`
  for shorts and `0 != null` is true, so they were counted as trips; `math::sum`
  also summed them. Fixed: shorts now store `trashKg: null`, `places: []`,
  skip the LLM, and the refresh path force-nulls shorts. Aggregate already uses
  `!isShort` so the site now shows **45 trips** (was incorrectly 48).
- **OpenRouter free model is rate-limited (429):** the supplied
  `nvidia/nemotron-3-ultra-550b-a55b:free` returns 429 — and the **KEY** is
  globally throttled right now (all other free models also 429/NotFound). So
  the LLM extraction failed for every video → `trashKg` fell back to default
  1 kg (→45 kg) and `places` were empty.
  - **Fix 1 — retry/backoff:** `callProvider` now retries up to 6× with
    exponential backoff and honors `Retry-After`. Added a 30s `AbortController`
    timeout so a hung call can't stall the whole run.
  - **Fix 2 — short-circuit on persistent 429:** once the LLM is
    hard-rate-limited, a module flag disables the network for the rest of the
    run (no ~25-min waste retrying).
  - **Fix 3 — deterministic place fallback:** added `extractPlacesFromText()`
    — a curated gazetteer matched against title/description. A place is emitted
    ONLY if it literally appears in the text (never invented), so "locations
    visited" is populated even with no LLM. When OpenRouter recovers, the LLM's
    places take precedence.
- **Current live impact (verified via dev server + tokened Sanity read):**
  **45 trips, ~45 kg (default 1/video — LLM couldn't refine), 43 unique
  locations** (title-derived). Honest/illustrative; will sharpen automatically on
  the next daily cron run once the LLM is un-throttled.
- **Recommendation to owner:** OpenRouter free tier is unreliable for the daily
  48-call batch. Consider (a) a paid OpenRouter model, (b) a different
  provider (`LLM_PROVIDER=gemini` w/ `GEMINI_API_KEY`, or `openai`), or (c)
  accept the default 1kg/video + title places (already works). No code change
  needed to switch — just env vars.

## Open questions / TODO (updated)
- [x] YouTube Data API v3 integration **live** — new key, 48 videos, real
  duration/short detection. (RSS `#shorts` heuristic noted as unreliable; API
  is primary.)
- [x] `/videos` shows all 48 (was capped at 24).
- [x] Aggregate live: **45 trips / 45 kg / 43 locations** (LLM throttled →
  defaults + title-derived places). Will auto-refine on next cron when LLM free.
- [ ] **Security/access (owner ask):** read client uses the WRITE token as a
  fallback. Recommended: create a **Viewer (read-only) Sanity token** →
  `SANITY_READ_TOKEN`, and point `src/sanity/lib/client.ts` at it (remove the
  write-token fallback). User created a "content-write" Editor token but hasn't
  supplied its value to swap; the old write token should be rotated.
- [ ] **Long-form distinction (owner complaint):** Trips tab currently renders
  all 45 long videos in one flat grid with only title + view count — weak
  differentiation. Needs a design decision (group by destination/region,
  richer cards w/ extracted places/duration, or per-trip detail pages).
- [ ] **Transcripts of first 3 long-form videos (owner ask):** to write lively
  About/home copy. Needs a method (API captions now unblocked,
  `youtube-transcript-api` dep, scrape, or paste) + a definition of "first
  three" (by date? current API list's first three long = PByK6EOfdjw,
  RcvhVul2y_4, Mh7dl2IIs3I).
- [ ] **Vercel deploy (owner ask):** not a git repo yet. Need `git init`,
  user to push, generate `CRON_SECRET`, and set env vars pre-build (Sanity
  project/dataset, `SANITY_WRITE_TOKEN`, `LLM_*`, `YOUTUBE_API_KEY`,
  `CRON_SECRET`). Static pages bake Sanity at build time, so env must be set.
- [ ] Rotate the leaked "Access Manager" token (pasted in chat; read-only).
- [ ] Confirm Instagram Business/Creator + Meta App Review status (site shows
  "coming soon").

## 2026-07-14 — Read-only token + Trips UX upgrade (session: Hy3)

- **Security (owner ask):** user supplied a **Viewer (read-only) Sanity token**.
  - `SANITY_READ_TOKEN` set in `.env.local`.
  - `src/sanity/lib/client.ts` now uses the read-only token **only** (removed the
    Editor write-token fallback). The public site's reads (`/impact`, `/videos`,
    `/about`, detail pages) can no longer mutate content if the read token leaks.
  - Verified: reads still return **45 trips / 43 locations** via the read token.
- **Trips UX upgrade (owner-approved "do all of it"):** year + region filter,
  richer cards, per-trip detail pages.
  - `src/lib/videoImpact.ts` (new) — `getVideoImpacts()` reads all `videoImpact`
    docs (places/trashKg) keyed by videoId, via the read client. Used to enrich
    the grid + detail pages.
  - `src/lib/regions.ts` (new) — pure place→region mapping (Himachal & Spiti,
    Uttarakhand, Ladakh & Kashmir, North-East, Beaches & South, Rajasthan &
    Desert, Plains & Heritage) for the region filter chips.
  - `src/lib/youtube.ts` — added `getVideoById(id)` (single-video meta) for the
    detail page.
  - `src/components/VideoCard.tsx` (rewritten) — shows **Trip #** (chronological,
    oldest=#1), **duration**, **places** tags, **Cleanup** tag. Trips link
    **internally** to `/videos/[id]`; clips link to YouTube.
  - `src/components/VideosGallery.tsx` (rewritten) — **region filter** added
    alongside the existing year filter; trip numbers assigned chronologically.
  - `src/app/videos/page.tsx` — passes `impacts` to the gallery.
  - `src/app/videos/[id]/page.tsx` (new) — per-trip detail: hero thumbnail,
    "Watch on YouTube" CTA, region/date/duration/trash/trip#/cleanup meta,
    places tags, full description. `generateMetadata` for title/description.
  - `src/app/videos/[id]/not-found.tsx` (new) — 404 UI for bad ids.
  - `tsc --noEmit` clean; `npm run build` clean (exit 0). `/videos` renders
    **45 internal trip links + 5 clip links**; detail page returns 200.
- **Transcripts pasted (owner chose "you paste transcripts"):** 6 videos —
   `PByK6EOfdjw` (Shimla Manali, Hindi travel-guide), Panshet Dam (cleanup
   mention), Saakaar Eco Village (sustainable living), Tamhini Ghat (team
   cleanup), **Malshej Ghat (ENGLISH — philosophy monologue + explicit cleanup
   mission "It's not my trash, but it's our planet for sure.")**, Matheran
   (cleanup awareness / dustbin install). Malshej is the source of both the
   opening philosophy quote and the mission hook.
- **About + Home copy written from transcripts (session: Hy3, approved by
   owner):** first-person, in his voice, **no invented facts** (all grounded in
   the Malshej English monologue + trip locations named in titles/transcripts).
   - `aboutPage` schema extended (TS) with `heroQuote`/`introduction`/
     `missionQuote`/`footerCallout`; `about/page.tsx` re-renders them.
   - `siteSettings` schema gained `subline`; Home hero now shows
     "Come for the adventure, notice the impact." + subline
     "One life, one planet — I just go where the trail takes me."
   - Seed script (`scripts/seed-content.ts`) updated with the approved copy.
   - Verified live: `/about` renders full approved copy (HTTP 200), `/`
     renders tagline + subline. `npm run build` clean.
   - Note: schema kept in TS `defineType` style (NOT the raw-JS object Gemini
     pasted in chat). Home subline kept in `siteSettings`, not a new homePage doc.

## Open questions / TODO (updated)
- [x] Read client uses **read-only** Viewer token (no write fallback).
- [x] Trips UX: year + region filter, richer cards, per-trip detail pages — built.
- [x] **Transcripts + copy:** 6 transcripts pasted; About + Home copy written
   from them (approved), built into Sanity schema + seeded.
- [ ] **Vercel deploy:** not a git repo yet. Need `git init`, user push,
   generate `CRON_SECRET`, set env vars pre-build (Sanity project/dataset,
   `SANITY_READ_TOKEN`, `SANITY_WRITE_TOKEN`, `LLM_*`, `YOUTUBE_API_KEY`,
   `CRON_SECRET`). Static pages bake Sanity at build time → env must be set.
- [ ] OpenRouter free model rate-limited (429) — impact `trashKg` is default
   1kg/video until LLM recovers; places come from the title gazetteer. Consider
   a paid/non-rate-limited `LLM_PROVIDER` for sharper numbers.
- [ ] Rotate the leaked "Access Manager" token (pasted in chat; read-only).

## 2026-07-14 — IA overhaul: Journeys + Field Notes + cinematic design (session: Hy3)

- **Major IA change (owner-approved):** rebranded Videos→**Journeys**,
   Announcements→**Field Notes**, and rebuilt `/impact` as a derived dashboard.
  - Replaced the `videoImpact` doc model with a **`journey`** doc (one per
    YouTube video): `youtubeId`, `title`, `excerpt`, `publishedAt`,
    `durationLabel`, `isShort`, `trashKg` (≥1), `places[]`, `region`, `state`,
    `season`, `featured`, `source`, `analyzedAt`, `note` + nested
    `journeyLocation` / `galleryItem` / `travelTip` / `journeyQuote` /
    `impactBlock` blocks for editor enrichment. New **`fieldNote`** doc (native
    site-authored posts, optional `journey` reference) replaces `announcement`.
  - Schemas: `src/sanity/schemaTypes/journey.ts`, `fieldNote.ts`; registered in
    `index.ts`; `structure.ts` restyled to Journeys / Field Notes.
  - Queries rewritten: `JOURNEYS_QUERY`, `JOURNEY_BY_SLUG_QUERY`,
    `JOURNEY_SLUGS_QUERY`, `FEATURED_JOURNEY_QUERY`, `LATEST_JOURNEYS_QUERY`,
    `FIELD_NOTES_QUERY`, `FIELD_NOTE_BY_SLUG_QUERY`, `FIELD_NOTE_SLUGS_QUERY`,
    `JOURNEY_AGGREGATE` (replaced `ANNOUNCEMENTS_QUERY`,
    `VIDEO_IMPACT_AGGREGATE`). `FEATURED_JOURNEY_QUERY` sorts `featured desc`
    then `publishedAt desc` (no GROQ `||`, which silently errored).
  - Analyzer repointed (`analyze-runner.ts`) to write `journey` docs (hybrid:
    auto-seeds from 48 YouTube videos; editor enriches). `scripts/migrate-to-
    journey.ts` deletes old `videoImpact` docs (run: 8 deleted). `analyze.ts`
    run: **48 `journey` docs created (45 non-short)**. `LATEST_JOURNEYS_QUERY`
    returns 12 so both the films grid and Behind-the-Lens (needs ≥4) work.
  - `src/lib/journey.ts` (`getJourneys`, `getJourneyList`) replaces deleted
    `src/lib/videoImpact.ts`. `src/lib/regions.ts` retained for the gallery
    region filter.
  - Components: `JourneyCard`, `JourneysGallery` (region+year filter),
    `FieldNoteCard`, `ImpactDashboard` (ledger + yearly timeline). Deleted
    `VideoCard`, `VideosGallery`, `AnnouncementCard`.
  - Pages: `/journeys`, `/journeys/[slug]` (+`not-found`), `/field-notes`,
    `/field-notes/[slug]` (+`not-found`). Deleted `/videos`, `/announcements`,
    `/contact`.
  - `/impact` rewritten as editorial dashboard (ledger + progression + dustbin
    goal) reading `JOURNEY_AGGREGATE`, fallback to `impactStats`.
  - `SiteHeader` nav: Home, Journeys, Impact, Field Notes, About (dropped
    Contact/Videos/Announcements).
  - `next.config.ts` redirects (301): `/videos`→`/journeys`,
    `/videos/:id`→`/journeys/:id`, `/announcements`→`/field-notes`,
    `/announcements/:slug`→`/field-notes/:slug`.
  - `scripts/seed-content.ts` updated to a `fieldNote` placeholder. `tsc` +
    `npm run build` clean (53 pages; 45+ journey paths prerendered). Live
    verified: `/`, `/journeys`, `/journeys/PByK6EOfdjw`, `/field-notes`,
    `/impact` all 200.

- **Design-lock override (owner-approved — supersedes AGENTS.md Phase 3):**
   the earthy palette + Fraunces are replaced by a cinematic documentary vision.
  - New palette (**token NAMES unchanged** so components repaint without class
    churn): cream `#F5F1E8`, stone `#EFE9DD`, sand `#D8C3A5`, ink `#222222`,
    ink-soft `#6B6354`, forest `#2E3A2C`, leaf `#C86B45` (accent/CTA),
    moss `#859476`, bark `#222222`, clay `#7C5237`, clay-dark `#5E3D28`,
    sky `#6E9DC6`, water `#2E3A2C`, white `#FFFFFF`. In `globals.css`.
  - Headings: **Cormorant Garamond** (was Fraunces) via `next/font` as
    `--font-cormorant`; `layout.tsx` loads it (weights 400–700), `--font-serif`
    points to it. Body stays Inter.
  - **No gradients** (banned): hero is flat `bg-forest`. The only remaining
    gradient is a functional image-legibility scrim on Behind-the-Lens tiles
    (text contrast over photos), not a decorative brand gradient.
  - Cinematic homepage (Framer Motion installed): full-bleed **poster hero**
    (latest YouTube thumbnail) + centered title + "Watch Documentary" + scroll
    cue; **typographic impact ledger** (no boxes); **Featured Journey**
    (asymmetric image/text); **Behind the Lens** (varied-height tiles, hover
    zoom); **Latest Films** (poster grid); Malshej closing quote + "The
    mountains don't need visitors. They need guardians." All reveals honor
    `prefers-reduced-motion`. `Reveal.tsx` + `HeroIntro.tsx` are the motion
    primitives.
  - **Asset note:** hero uses the latest video's YouTube thumbnail as a
    temporary poster (real `.webm`/hero photo to be dropped in later).
  - **Deferred (Phase 2, owner chose defer):** interactive India map (pins from
    `journey.locations[]`), site search, route/season filters.

## Open questions / TODO (updated)
- [x] IA overhaul: Journeys + Field Notes + derived Impact dashboard — built,
   live, redirects in place. `/videos`, `/announcements`, `/contact` deleted.
- [x] Design-lock override: cinematic palette + Cormorant + no gradients + Framer
   Motion poster hero — built.
- [ ] **Vercel deploy:** not a git repo yet. Need `git init`, user push,
   generate `CRON_SECRET`, set env vars pre-build (Sanity project/dataset,
   `SANITY_READ_TOKEN`, `SANITY_WRITE_TOKEN`, `LLM_*`, `YOUTUBE_API_KEY`,
   `CRON_SECRET`). Static pages bake Sanity at build time → env must be set.
- [ ] OpenRouter free model rate-limited (429) — impact `trashKg` is default
   1kg/video until LLM recovers; places from the title gazetteer. Consider a
   paid/non-rate-limited `LLM_PROVIDER` for sharper numbers.
- [ ] Rotate the leaked "Access Manager" token (pasted in chat; read-only).
- [ ] Confirm Instagram Business/Creator + Meta App Review status (site shows
   "coming soon").
- [ ] (Phase 2) Interactive map, site search, route/season filters.
