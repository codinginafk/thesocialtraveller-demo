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

const SITE_URL = "https://thesocialtraveller-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TheSocialTraveller — Come for the adventure, notice the impact",
    template: "%s · TheSocialTraveller",
  },
  description:
    "Scenic travel, real cleanup. One person, a camera, and a mission to leave India\u2019s mountains and beaches cleaner than he found them.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "TheSocialTraveller — Come for the adventure, notice the impact",
    description:
      "Scenic travel, real cleanup. One person, a camera, and a mission to leave India\u2019s mountains and beaches cleaner than he found them.",
    url: SITE_URL,
    siteName: "TheSocialTraveller",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheSocialTraveller — Come for the adventure, notice the impact",
    description:
      "Scenic travel, real cleanup. One person, a camera, a mission.",
    images: ["/images/hero.jpg"],
  },
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
