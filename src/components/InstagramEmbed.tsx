"use client";

import { useState, useEffect } from "react";

interface InstagramEmbedProps {
  url: string;
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

let embedJsLoaded = false;

function loadEmbedJs() {
  if (embedJsLoaded) return;
  embedJsLoaded = true;
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.onload = () => window.instgrm?.Embeds.process();
  document.body.appendChild(script);
}

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchEmbed() {
      try {
        const res = await fetch(`/api/instagram/embed?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (!cancelled && data.html) {
          setHtml(data.html);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEmbed();
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (html) {
      loadEmbedJs();
    }
  }, [html]);

  if (loading) {
    return (
      <div className="aspect-square animate-pulse rounded-xl bg-stone" />
    );
  }

  if (!html) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex aspect-square items-center justify-center rounded-xl bg-forest">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-cream/20">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="6" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </a>
    );
  }

  return (
    <div
      className="instagram-embed flex items-center justify-center
        [&_.instagram-media]:!m-0 [&_.instagram-media]:!w-full [&_.instagram-media]:!min-w-0
        [&_.instagram-media_iframe]:!min-w-0 [&_.instagram-media_iframe]:!w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
