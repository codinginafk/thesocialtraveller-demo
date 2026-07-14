import { runAnalysis } from "@/lib/analyze-runner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Vercel Cron hits this (vercel.json). If CRON_SECRET is set, Vercel
// signs the request with `Authorization: Bearer <CRON_SECRET>` — verify it.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  try {
    const summary = await runAnalysis();
    return Response.json(summary);
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
