import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const oembedUrl = `https://graph.facebook.com/v25.0/instagram_oembed?url=${encodeURIComponent(url)}&maxwidth=658&omitscript=true`;
    const res = await fetch(oembedUrl, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "oEmbed fetch failed", html: null });
    }
    const data = await res.json();
    return NextResponse.json({ html: data.html || null });
  } catch {
    return NextResponse.json({ html: null });
  }
}
