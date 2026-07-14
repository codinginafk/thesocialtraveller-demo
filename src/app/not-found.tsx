import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[72rem] flex-col items-center justify-center px-4 text-center sm:px-8">
      <span className="font-serif text-8xl text-clay">404</span>
      <h1 className="mt-4 font-serif text-3xl text-bark">Trail not found</h1>
      <p className="mt-2 max-w-md text-ink-soft">
        This page has wandered off somewhere. Maybe it&apos;s behind that waterfall.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bark"
      >
        Back to base camp
      </Link>
    </div>
  );
}
