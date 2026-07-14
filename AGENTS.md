# AGENTS.md — TheSocialTraveller Website

## Project
A personality-driven portfolio/landing site for TheSocialTraveller — a travel
creator (YouTube + Instagram) whose content is built around a specific angle:
documenting scenic travel while actively picking up trash (mainly plastic)
along the way, with a stated mission to eventually fund and maintain
dustbins in mountain/beach areas using channel revenue.

This is NOT a generic travel-vlogger template site. The environmental-action
angle is the differentiator and must show up in the structure, not just the
copy (e.g. an "impact" section, not just "About Me").

**Owner:** friend of Praveen (site built/maintained by Praveen)
**Status:** pre-build — confirm brand direction with creator before final design lock

## Brand identity
- Voice: adventurous, grounded, matter-of-fact about the cleanup work — never
  preachy or guilt-tripping the viewer
- Visual direction: earthy/nature palette (greens, browns, sky/water blues) —
  explicitly avoid the bright-saturated generic "travel influencer" look
- Emotional register: "come for the adventure, notice the impact" — the
  environmental message should feel woven in, not bolted on
- Tone in copy: short, confident sentences; show don't tell (stats, photos,
  before/after) over statements of intent

## Tech stack (assumed — confirm/adjust before scaffolding)
- Next.js (App Router) + Tailwind CSS
- Static/ISR generation — this is a content site, not an app; avoid
  unnecessary client-side state or heavy JS frameworks
- Deploy target: Vercel (Hobby plan at launch — see Hosting & cost reality)
- Images: next/image with explicit sizes; this site lives and dies by image
  weight given travel photography — never ship unoptimized full-res images
- No local-file CMS for hand-authored content — structured content (impact
  stats, About text, announcement posts) lives in Sanity (see CMS below).
  Feed data (YouTube/Instagram) is fetched/cached from APIs, not hand-typed.

## Site structure (v1 scope)
1. Home — hero (video/photo), one-line mission statement, latest video embed
2. Impact — trips completed, estimated trash collected, locations visited,
   dustbin-pledge progress (even if early numbers are small — show honesty,
   not inflated stats)
3. Videos/Gallery — live-pulled YouTube uploads + Instagram posts (see
   External content integration), filterable by location or trip
4. Announcements — native, site-authored posts styled like a social post
   card (not pulled from YouTube/Instagram — written directly, e.g. via
   Sanity)
5. About — the creator's story and why the cleanup mission started
6. Contact/Social — links to YouTube, Instagram, Facebook

Do not add pages/sections beyond this v1 scope without discussion — resist
scope creep into blog/e-commerce/community features until v1 ships.

## Model (opencode)
Single model in use: Hy3 (295B MoE, 256K context, strong on reasoning,
agentic workflows, and frontend design). No second model available for
cross-checking — see "Single-model guardrails" below for how that gap is
compensated.

## Single-model guardrails
With only one model in the loop, these rules replace what a second-model
review would normally catch:

- **Scope lock** — no new pages/features beyond what's explicitly scoped in
  the current task, even if a "natural" extension suggests itself. Flag
  ideas instead of building them unprompted.
- **Small diffs** — a task touching more than ~3-4 files should stop and
  describe the plan before executing, not just proceed.
- **Self-review step** — after any structural change, run a follow-up pass
  where Hy3 critiques its own prior output fresh, as if reviewing someone
  else's PR. This is the substitute for a second-model opinion.
- **Stop-and-ask triggers** — deletion of content files, schema changes to
  video/impact/announcement data structures, new dependencies, deployment
  config changes, or anything touching API credentials: always surface
  before acting, never bundle into a routine task.
- **No invented content** — no fabricated stats, testimonials, or filler
  copy presented as real. Anything not supplied by the creator is marked
  as a placeholder.
- **Design consistency lock** — once the palette/type/spacing spec is set
  (Phase 3), it lives here verbatim and every session must match it exactly,
  not "in spirit."

## External content integration
Two sources, two different risk profiles — do not treat them the same.

**YouTube (low friction):**
- YouTube Data API v3, API key only, pull latest uploads via the channel's
  uploads playlist
- Server-side fetch only (API route/server component) — key never reaches
  the client
- Cache/revalidate on a schedule (e.g. every few hours), never fetch live
  on every page load

**Instagram (real dependency, not just an API call):**
- Requires creator's Instagram converted to a Business/Creator account,
  linked to a Facebook Page, plus a Meta Developer App that must pass
  App Review for the needed permissions — this has an external timeline
  (days to weeks, not guaranteed to pass first submission)
- Until App Review clears, Instagram content is manually curated (via the
  CMS, see below) — do not block the site launch on Meta's review process
- Tokens are long-lived but expire (~60 days) — refresh logic must log
  failures loudly, never fail silently
- Same rule as YouTube: server-side only, cached, graceful fallback to
  last-known-good data if a fetch fails

## Hosting & cost reality (Vercel Hobby)
Everything in this project is scoped to run on free tiers at launch:
YouTube Data API, Instagram Graph API, Sanity free plan, and Vercel Hobby
all cost $0 at this project's scale. Two Vercel Hobby constraints shape
the implementation, though:

- **No sub-daily cron on Hobby** — do NOT rely on Vercel Cron for
  refreshing the YouTube/Instagram cache (Hobby only allows once-per-day
  schedules). Instead, use Next.js time-based revalidation
  (`revalidate: N` on the relevant fetch/page) — this refreshes the cache
  on the next real visit after the interval, with no scheduled job and no
  Pro plan required.
- **Hobby is non-commercial personal use only** — fine for this site as a
  showcase/portfolio with no ads or direct sales. If the site itself later
  adds ads, paid features, or e-commerce (separate from YouTube's own
  monetization), that crosses into needing Vercel Pro ($20/mo). Not a
  concern at launch — just flag it if scope moves that direction.

Realistic future cost trigger: Pro becomes worth it only if bandwidth
(100GB/mo) or function invocations (100K/mo) are actually approached, or
if the site becomes commercial. Neither applies at launch scope.

## CMS
Sanity Studio (via next-sanity). Chosen over Notion/TinaCMS because
the manually-edited content here (impact stats, About text, native
announcement posts) is structured data, not documents — Sanity handles
that cleanly without custom sync glue, and gives the creator a proper
hosted GUI with no git/code exposure.

**Scope of what lives in Sanity:**
- Impact stats (trips, trash collected estimate, locations, dustbin pledge
  progress)
- About page text
- Native announcement posts (site-authored posts styled like a social
  card — not pulled from YouTube/Instagram, authored directly)
- Featured/pinned overrides for the video/Instagram feed, if needed

Video and Instagram feed data itself is NOT hand-edited in Sanity — it's
fetched/cached from the APIs above. Sanity only holds the content a human
needs to type in directly.

## Hard constraints
- Mobile-first — most of this audience will land from Instagram/YouTube on
  a phone
- No stock-photo-influencer aesthetic — use the creator's own footage/photos
  only, even placeholders should be swappable, not generic stock
- Basic accessibility: semantic HTML, alt text on all images, sufficient
  color contrast against the earthy palette
- Fast load — Lighthouse performance score is a real acceptance criterion,
  not a nice-to-have, given image-heavy content
- No dark patterns, no fake urgency/scarcity, no invented stats — the impact
  numbers must be real or clearly marked as illustrative/in-progress

## Working conventions
- Keep a running DECISIONS.md log of major direction choices and which
  model/session made them, so decisions aren't silently re-litigated across
  model switches
- Content data (video list, impact stats) stays in typed JSON/TS files OR
  Sanity schemas, not hardcoded inline in components
- Prefer small, reviewable commits/diffs over large multi-file generations,
  especially when using Hy3 for structural changes

## Phase 3 — Design system lock (VERBATIM)

Once set, every session and every component MUST match this exactly, not
"in spirit." Tokens are implemented in `src/app/globals.css` via Tailwind v4
`@theme` and in `src/app/layout.tsx` via `next/font`.

### Palette — earthy / nature (no bright-saturated influencer look)
| Token | Hex | Use |
|---|---|---|
| `cream` | `#F6F2E9` | page background |
| `stone` | `#ECE5D6` | subtle surface / cards |
| `sand` | `#D8CBB4` | borders / dividers |
| `ink` | `#211C14` | body text |
| `ink-soft` | `#5C5343` | muted text |
| `forest` | `#2E4632` | primary deep green (CTAs, key UI) |
| `leaf` | `#4E7C59` | secondary green (success, accents) |
| `moss` | `#859476` | muted green — decorative only, never text |
| `bark` | `#412E20` | headings / footer brown |
| `clay` | `#B25A3C` | terracotta accent / primary CTA fill |
| `clay-dark` | `#97492F` | CTA hover |
| `sky` | `#6E9DC6` | muted sky blue — decorative only, never text |
| `water` | `#3D6B86` | deeper water blue — links |
| `white` | `#FFFFFF` | text on dark/colored fills |

Contrast rules: `ink`/`bark`/`forest` on `cream`, and `white` on `clay`/
`forest`, all pass AA. `moss` and `sky` are decorative only (never used for
text). Links use `water` and are underlined on focus.

### Typography
- Display / headings: **Fraunces** (serif, characterful editorial) — weight 600,
  line-height 1.12, letter-spacing -0.01em, color `bark`.
- Body / UI: **Inter** (clean, legible) — line-height 1.65, color `ink`.
- Loaded via `next/font/google` as `--font-fraunces` / `--font-inter`.
- Scale: mobile-first, base 16px. Use Tailwind's default size scale; display
  sizes (h1–h3) step up fluidly on larger viewports. No sub-16px body text.

### Radius / elevation / layout
- Radius: `sm` .375rem · `md` .5rem · `lg` .75rem · `xl` 1rem · `2xl` 1.5rem.
  Cards use `xl`; buttons use `md`/`lg`.
- Elevation: single soft shadow `0 1px 2px rgb(33 28 20/.06), 0 10px 30px
  rgb(33 28 20/.08)`. Avoid heavy shadows.
- Layout: max content width `72rem` (1152px), centered, mobile gutter 1rem →
  2rem on >=640px. Mobile-first; single light theme (no dark mode).

### Hard rules
- Semantic HTML + alt text on every image (against `cream`).
- Swappable placeholder images only — no generic stock-influencer photos.
- Lighthouse performance is an acceptance criterion; keep payload small.
