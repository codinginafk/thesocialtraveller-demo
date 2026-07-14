"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[72rem] flex-col items-center justify-center px-4 text-center sm:px-8">
      <span className="font-serif text-8xl text-clay">500</span>
      <h1 className="mt-4 font-serif text-3xl text-bark">Something went wrong</h1>
      <p className="mt-2 max-w-md text-ink-soft">
        Even the best trails hit a rough patch. Try again?
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-block rounded-lg bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bark"
      >
        Try again
      </button>
    </div>
  );
}
