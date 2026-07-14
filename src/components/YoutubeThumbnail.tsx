"use client";

import { useState, useRef, useCallback } from "react";

const SIZES = ["maxresdefault", "hqdefault", "sddefault"];

export default function YoutubeThumbnail({
  youtubeId,
  alt,
  className,
}: {
  youtubeId: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState(
    `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
  );
  const [failed, setFailed] = useState(false);
  const sizeIndex = useRef(0);

  const advance = useCallback(() => {
    const next = sizeIndex.current + 1;
    if (next < SIZES.length) {
      sizeIndex.current = next;
      setSrc(`https://i.ytimg.com/vi/${youtubeId}/${SIZES[next]}.jpg`);
    } else {
      setFailed(true);
    }
  }, [youtubeId]);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (e.currentTarget.naturalWidth <= 120) {
        advance();
      }
    },
    [advance]
  );

  const handleError = useCallback(() => {
    advance();
  }, [advance]);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-sand ${className ?? ""}`}>
        <span className="text-sm text-ink-soft">No thumbnail</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
