import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TheSocialTraveller — Come for the adventure, notice the impact",
    template: "%s · TheSocialTraveller",
  },
  description:
    "Travel films from TheSocialTraveller — scenic journeys documented while picking up trash along the way, with a mission to fund and maintain dustbins in mountain and beach areas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings: {
    youtubeUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
  } = {};

  try {
    settings = await client.fetch(
      SITE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 3600 } },
    );
  } catch {
    settings = {};
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} antialiased`}
    >
      <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://i.ytimg.com" />
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter
          youtubeUrl={settings?.youtubeUrl}
          instagramUrl={settings?.instagramUrl}
          facebookUrl={settings?.facebookUrl}
        />
      </body>
    </html>
  );
}
