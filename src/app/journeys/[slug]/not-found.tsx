import Link from "next/link";

export default function JourneyNotFound() {
  return (
    <div className="mx-auto max-w-[72rem] px-4 py-24 text-center sm:px-8">
      <h1 className="font-serif text-4xl text-bark">Journey not found</h1>
      <p className="mt-4 text-ink-soft">
        This journey may have been moved or never published.
      </p>
      <Link
        href="/journeys"
        className="mt-8 inline-block rounded-lg bg-forest px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-bark"
      >
        Browse all journeys
      </Link>
    </div>
  );
}
