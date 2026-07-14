import type { Metadata } from "next";
import AboutParallax from "@/components/AboutParallax";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "One person. One camera. One promise to the mountains.",
  openGraph: { title: "About — TheSocialTraveller" },
};

export default function AboutPage() {
  return <AboutParallax />;
}
