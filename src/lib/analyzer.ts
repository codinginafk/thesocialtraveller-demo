// LLM-based analyzer. Uses plain `fetch` against the chosen provider's
// REST API — NO new npm dependency, just an API key (env). If no key is
// configured it returns a graceful default (no places, no explicit trash).
//
// Output contract (JSON only):
//   { "places": string[], "trashKg": number | null }
// `trashKg` is null when the video doesn't state a specific amount.

export type Analysis = {
  places: string[];
  trashKg: number | null;
};

type Provider = "openai" | "openrouter" | "anthropic" | "gemini";

const SYSTEM = [
  "You extract TRAVEL-CLEANUP metadata from a YouTube video about TheSocialTraveller — a creator who films scenic trips while picking up plastic/trash.",
  "Return ONLY minified JSON, no prose, no markdown fences:",
  '{"places": string[], "trashKg": number|null}',
  "places = the location(s) where this trip / cleanup took place — the town, region, beach, mountain, trail or village the video is based in or features (e.g. 'Manali', 'Goa', 'Spiti Valley', 'Rishikesh'). Prefer the broader destination over every sightseeing landmark. If several distinct places are clearly named, include the main ones (cap ~5). Only return [] if NO location can be inferred from the title/description.",
  'trashKg = the specific amount of trash collected ONLY if the text explicitly states a number with a unit like kg/kilo/kilogram; otherwise null. Do NOT guess.',
].join(" ");

function buildRequest(
  provider: Provider,
  apiKey: string,
  text: string,
): { url: string; headers: Record<string, string>; body: string } {
  const user = `Title/description:\n${text}\n\nExtract places and trashKg.`;
  if (provider === "openai" || provider === "openrouter") {
    const url =
      provider === "openrouter"
        ? "https://openrouter.ai/api/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
    const model =
      provider === "openrouter"
        ? process.env.LLM_MODEL ||
          "nvidia/nemotron-3-ultra-550b-a55b:free"
        : process.env.LLM_MODEL || "gpt-4o-mini";
    const body: Record<string, unknown> = {
      model,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0,
    };
    // JSON mode is reliable on OpenAI; some OpenRouter :free models
    // reject response_format, so only force it for OpenAI.
    if (provider === "openai") {
      body.response_format = { type: "json_object" };
    }
    return {
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    };
  }
  if (provider === "anthropic") {
    return {
      url: "https://api.anthropic.com/v1/messages",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || "claude-3-5-haiku-latest",
        max_tokens: 300,
        system: SYSTEM,
        messages: [{ role: "user", content: user }],
      }),
    };
  }
  // gemini
  const model = process.env.LLM_MODEL || "gemini-1.5-flash";
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0 },
    }),
  };
}

function parseModelJson(raw: string): Analysis {
  try {
    const m = raw.match(/\{[\s\S]*\}/);
    const obj = m ? JSON.parse(m[0]) : JSON.parse(raw);
    return {
      places: Array.isArray(obj.places)
        ? obj.places.map((p: unknown) => String(p)).filter(Boolean)
        : [],
      trashKg:
        typeof obj.trashKg === "number" && obj.trashKg >= 0
          ? obj.trashKg
          : null,
    };
  } catch {
    return { places: [], trashKg: null };
  }
}

// Once the LLM is hard-rate-limited (persistent 429) we stop hammering
// it for the rest of the run and rely on the deterministic title fallback.
let LLM_DISABLED = false;

async function callProvider(
  provider: Provider,
  apiKey: string,
  text: string,
): Promise<Analysis> {
  if (LLM_DISABLED) return { places: [], trashKg: null };
  const req = buildRequest(provider, apiKey, text);
  const MAX_ATTEMPTS = 6;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    let res: Response;
    try {
      res = await fetch(req.url, {
        method: "POST",
        headers: req.headers,
        body: req.body,
        signal: ctrl.signal,
      });
    } catch {
      // network/timeout (incl. AbortError) → no extraction this attempt
      clearTimeout(timer);
      if (attempt === MAX_ATTEMPTS - 1) return { places: [], trashKg: null };
      await sleep(backoff(attempt, null));
      continue;
    }
    clearTimeout(timer);
    // Retryable: 429 (rate limit) or 5xx. Respect Retry-After if present.
    if (res.status === 429 || res.status >= 500) {
      if (attempt === MAX_ATTEMPTS - 1) {
        LLM_DISABLED = true; // give up on the LLM for this whole run
        return { places: [], trashKg: null };
      }
      const retryAfter = Number(res.headers.get("retry-after"));
      await sleep(backoff(attempt, Number.isFinite(retryAfter) ? retryAfter : null));
      continue;
    }
    if (!res.ok) return { places: [], trashKg: null };
    const data = await res.json();
    return parseResponse(provider, data);
  }
  return { places: [], trashKg: null };
}

function backoff(attempt: number, retryAfter: number | null): number {
  if (retryAfter && retryAfter > 0) return Math.min(retryAfter * 1000, 60000);
  return Math.min(1000 * 2 ** attempt, 30000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function parseResponse(provider: Provider, data: unknown): Analysis {
  let raw = "";
  if (provider === "openai" || provider === "openrouter")
    raw = (data as any)?.choices?.[0]?.message?.content ?? "";
  else if (provider === "anthropic")
    raw = (data as any)?.content?.[0]?.text ?? "";
  else raw = (data as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (process.env.ANALYZER_DEBUG) {
    console.error("[debug] raw:", raw);
  }
  return parseModelJson(raw);
}

// Deterministic fallback: the YouTube title/description usually names the
// trip's destination. We match against a curated gazetteer so "locations
// visited" is never empty even when the LLM is unavailable/rate-limited.
// A place is only emitted if it LITERALLY appears in the text — never invented.
const KNOWN_PLACES = [
  // Himachal / Uttarakhand circuit (creator's core region)
  "Shimla", "Manali", "Spiti", "Kinnaur", "Kaza", "Kasol", "Kullu",
  "Dharamshala", "McLeodganj", "Mcleodganj", "Tirthan", "Dalhousie",
  "Khajjiar", "Solang", "Rohtang", "Kasol", "Rishikesh", "Uttarakhand",
  "Dehradun", "Mussoorie", "Auli", "Nainital", "Haridwar",
  // J&K / Ladakh
  "Ladakh", "Leh", "Srinagar", "Gulmarg", "Kashmir", "Pahalgam", "Sonmarg",
  // North-East
  "Meghalaya", "Shillong", "Cherrapunji", "Arunachal", "Tawang", "Sikkim", "Gangtok",
  // Beaches / west & south
  "Goa", "Kerala", "Munnar", "Alleppey", "Alappuzha", "Kochi", "Andaman",
  "Pondicherry", "Gokarna", "Coorg", "Karnataka", "Mumbai", "Konkan", "Tarkarli",
  // Rajasthan / desert
  "Rajasthan", "Jaipur", "Udaipur", "Jaisalmer", "Pushkar", "Jodhpur",
  // Other popular circuits
  "Varanasi", "Agra", "Delhi", "Himachal", "Uttarakhand",
];

export function extractPlacesFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const p of KNOWN_PLACES) {
    if (lower.includes(p.toLowerCase())) found.add(p);
  }
  return [...found];
}

export async function analyzeVideo(
  title: string,
  description: string,
): Promise<Analysis> {
  const provider = (process.env.LLM_PROVIDER as Provider) || "openai";
  const apiKey = process.env.LLM_API_KEY;
  const text = [title, description].filter(Boolean).join("\n\n");
  const fallback: Analysis = {
    places: extractPlacesFromText(text),
    trashKg: null,
  };
  if (!apiKey) return fallback;
  try {
    const llm = await callProvider(provider, apiKey, text);
    // Prefer LLM places; fall back to title-matched places when the LLM
    // returns nothing useful (e.g. rate-limited / empty).
    const places = llm.places.length ? llm.places : fallback.places;
    return { places, trashKg: llm.trashKg };
  } catch {
    return fallback;
  }
}
