"use client";

import { useState, useEffect, useRef } from "react";

const SIZES = ["maxresdefault", "hqdefault", "sddefault"] as const;
const RETRY_DELAY = 1500;
const MAX_RETRIES = 3;

function thumbUrl(youtubeId: string, size: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/${size}.jpg`;
}

export default function YoutubeThumbnail({
  youtubeId,
  alt,
  className,
}: {
  youtubeId: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string>(thumbUrl(youtubeId, "maxresdefault"));
  const [failed, setFailed] = useState(false);
  const retriesRef = useRef(0);
  const sizeIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const tryNext = () => {
    const nextIndex = sizeIndexRef.current + 1;
    if (nextIndex < SIZES.length) {
      sizeIndexRef.current = nextIndex;
      retriesRef.current = 0;
      setSrc(thumbUrl(youtubeId, SIZES[nextIndex]));
    } else {
      setFailed(true);
    }
  };

  const handleError = () => {
    retriesRef.current++;
    if (retriesRef.current < MAX_RETRIES) {
      timerRef.current = setTimeout(() => {
        setSrc(thumbUrl(youtubeId, SIZES[sizeIndexRef.current]));
      }, RETRY_DELAY);
    } else {
      tryNext();
    }
  };

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
      onError={handleError}
    />
  );
}
