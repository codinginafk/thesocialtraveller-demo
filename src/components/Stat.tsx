export default function Stat({
  value,
  label,
  hint,
}: {
  value: string | number;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-sand bg-stone p-6 text-center shadow-soft">
      <div className="font-serif text-4xl text-forest">{value}</div>
      <div className="mt-2 text-sm text-ink-soft">{label}</div>
      {hint && <div className="mt-1 text-xs text-clay">{hint}</div>}
    </div>
  );
}
