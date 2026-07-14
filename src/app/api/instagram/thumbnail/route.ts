import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400; // cache for 24h

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      },
      next: { revalidate: 86400 },
    });

    const html = await res.text();

    // Extract og:image from meta tags
    const ogMatch = html.match(
      /<meta\s+(?:[^>]*?)property="og:image"\s+(?:[^>]*?)content="([^"]+)"/i
    );
    const thumbUrl = ogMatch?.[1];

    if (!thumbUrl) {
      // Try alternate format
      const altMatch = html.match(
        /<meta\s+(?:[^>]*?)content="([^"]+)"\s+(?:[^>]*?)property="og:image"/i
      );
      const altThumb = altMatch?.[1];
      if (altThumb) {
        return NextResponse.json({ thumbnail: altThumb });
      }
      return NextResponse.json({ thumbnail: null });
    }

    return NextResponse.json({ thumbnail: thumbUrl });
  } catch {
    return NextResponse.json({ thumbnail: null });
  }
}
