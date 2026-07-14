"use client";

import { useState } from "react";

const SIZES = ["maxresdefault", "hqdefault", "sddefault"] as const;

export default function YoutubeThumbnail({
  youtubeId,
  alt,
  className,
}: {
  youtubeId: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string>(
    `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
  );
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    const sizes = ["maxresdefault", "hqdefault", "sddefault"];
    const current = sizes.findIndex((s) => src.endsWith(`/${s}.jpg`));
    const next = current + 1;
    if (next < sizes.length) {
      setSrc(`https://i.ytimg.com/vi/${youtubeId}/${sizes[next]}.jpg`);
    } else {
      setFailed(true);
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
