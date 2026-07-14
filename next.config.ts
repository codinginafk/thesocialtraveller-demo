import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/studio", destination: "/studio/structure", permanent: false },
      { source: "/videos", destination: "/journeys", permanent: true },
      { source: "/videos/:id", destination: "/journeys/:id", permanent: true },
      { source: "/announcements", destination: "/field-notes", permanent: true },
      { source: "/announcements/:slug", destination: "/field-notes/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
