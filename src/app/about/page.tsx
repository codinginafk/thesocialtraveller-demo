import { client } from "@/sanity/lib/client";
import { ABOUT_QUERY } from "@/sanity/lib/queries";
import AboutParallax from "@/components/AboutParallax";

export const revalidate = 3600;

export default async function AboutPage() {
  const about = await client
    .fetch(ABOUT_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const story = {
    heroQuote: about?.heroQuote || "",
    introduction: about?.introduction || "",
    body: about?.body || null,
    missionQuote: about?.missionQuote || "",
    footerCallout: about?.footerCallout || "",
    title: about?.title || "About",
  };

  return <AboutParallax story={story} />;
}
