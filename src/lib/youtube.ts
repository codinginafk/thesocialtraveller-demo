const CHANNEL_HANDLE = "TheSocialTraveller-2021";
// Creator's channel — discovered from @TheSocialTraveller-2021. Stable across
// handle changes; used only by the keyless RSS stopgap below.
const CHANNEL_ID = "UC_P_sA6Jf3iSsFueMwIP3vg";

export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnails?: { url: string };
  description?: string;
  durationSec?: number;
  // True for YouTube Shorts. Shorts are NOT counted as trips.
  isShort?: boolean;
};

type PlaylistItem = {
  snippet?: {
    resourceId?: { videoId?: string };
    title?: string;
    publishedAt?: string;
    thumbnails?: { url: string };
  };
};

type VideoMeta = {
  id?: string;
  contentDetails?: { duration?: string };
  snippet?: { description?: string; title?: string; publishedAt?: string };
};

const REVALIDATE_SECONDS = 60 * 60 * 3; // 3h, matches AGENTS caching guidance

// Videos shorter than this are "clips/shorts" and are NOT counted as trips.
// Owner rule: shorts = under 2 minutes.
export const IS_SHORT_MAX_SEC = 120;

// In-memory cache so we never hit YouTube more than once per revalidate window,
// even across multiple page renders / dev reloads.
let _cache: { ts: number; data: YouTubeVideo[] } | null = null;

function cached(limit: number): YouTubeVideo[] | null {
  if (_cache && Date.now() - _cache.ts < REVALIDATE_SECONDS * 1000) {
    return _cache.data.slice(0, limit);
  }
  return null;
}

function store(data: YouTubeVideo[]) {
  _cache = { ts: Date.now(), data };
}

function isoToSeconds(iso?: string): number {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (
    Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)
  );
}

async function getViaApi(key: string, limit: number): Promise<YouTubeVideo[]> {
  const fetchLimit = Math.max(limit, 24);
  const handles = [`@${CHANNEL_HANDLE}`, CHANNEL_HANDLE];
  for (const handle of handles) {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(handle)}&key=${key}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    const channelJson = await channelRes.json();
    if (channelJson?.error) continue; // try the other handle form
    const uploadsId =
      channelJson?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) continue;

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${fetchLimit}&key=${key}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    const playlistJson = await playlistRes.json();
    const items = (playlistJson?.items ?? []) as PlaylistItem[];

    const videos: YouTubeVideo[] = items
      .map((it) => ({
        id: it?.snippet?.resourceId?.videoId ?? "",
        title: it?.snippet?.title ?? "",
        publishedAt: it?.snippet?.publishedAt ?? "",
        thumbnails: it?.snippet?.thumbnails,
      }))
      .filter((v) => Boolean(v.id));

    // One batched call for durations + descriptions (used by the impact bot later).
    if (videos.length) {
      const ids = videos.map((v) => v.id).join(",");
      const metaRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${ids}&key=${key}`,
        { next: { revalidate: REVALIDATE_SECONDS } },
      );
      const metaJson = await metaRes.json();
      const meta: Record<string, { sec: number; desc: string }> = {};
      for (const v of (metaJson?.items ?? []) as VideoMeta[]) {
        const sec = isoToSeconds(v?.contentDetails?.duration);
        meta[v.id as string] = {
          sec,
          desc: v?.snippet?.description ?? "",
        };
      }
      for (const vid of videos) {
        const m = meta[vid.id];
        vid.durationSec = m?.sec;
        vid.description = m?.desc;
        vid.isShort = m ? m.sec > 0 && m.sec < IS_SHORT_MAX_SEC : false;
      }
    }
    return videos;
  }
  return [];
}

// Keyless fallback (best-effort). Uses the public RSS feed for the creator's
// channel. Only reached when the Data API v3 path returns nothing. No HTML
// scraping — the channel ID is stable. RSS has no duration, so Shorts are
// detected heuristically via a #shorts tag (real detection needs the API).
async function getViaRss(): Promise<YouTubeVideo[]> {
  try {
    const feed = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    const xml = await feed.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    return entries.slice(0, 24).map((entry) => {
      const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
      const published =
        entry.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
      const desc = (
        entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ??
        ""
      )
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      const isShort = /#shorts/i.test(`${title} ${desc}`);
      return {
        id,
        title,
        publishedAt: published,
        description: desc,
        isShort,
      };
    });
  } catch {
    return [];
  }
}

export async function getLatestVideos(
  limit = 12,
): Promise<YouTubeVideo[]> {
  const hit = cached(limit);
  if (hit) return hit;

  const key = process.env.YOUTUBE_API_KEY;
  let videos: YouTubeVideo[] = [];
  if (key) {
    try {
      const v = await getViaApi(key, limit);
      if (v.length) videos = v;
    } catch {
      // fall through to RSS
    }
  }
  if (!videos.length) videos = await getViaRss();

  store(videos);
  return videos.slice(0, limit);
}

export function countTrips(videos: YouTubeVideo[]): number {
  return videos.filter((v) => !v.isShort).length;
}

// Fetch a single video's full metadata by id (used by the per-trip detail
// page). Returns null if not found / API unavailable.
export async function getVideoById(id: string): Promise<YouTubeVideo | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || !id) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${id}&key=${key}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    const json = await res.json();
    const items = (json?.items ?? []) as VideoMeta[];
    const v = items[0];
    if (!v?.id) return null;
    const sec = isoToSeconds(v?.contentDetails?.duration);
    return {
      id: v.id as string,
      title: v?.snippet?.title ?? "",
      publishedAt: v?.snippet?.publishedAt ?? "",
      description: v?.snippet?.description ?? "",
      durationSec: sec,
      isShort: sec > 0 && sec < IS_SHORT_MAX_SEC,
    };
  } catch {
    return null;
  }
}
