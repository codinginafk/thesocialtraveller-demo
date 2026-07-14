import { client } from "@/sanity/lib/client";
import { FIELD_NOTES_QUERY } from "@/sanity/lib/queries";
import FieldNoteCard from "@/components/FieldNoteCard";

export const revalidate = 3600;

export default async function FieldNotesPage() {
  const notes = await client
    .fetch(FIELD_NOTES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  return (
    <div className="container-page py-16">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl text-bark md:text-5xl">Field Notes</h1>
        <p className="mt-4 text-ink-soft">
          Short stories, tips, and reflections from the trail.
        </p>
      </header>

      {notes && notes.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n: never) => (
            <FieldNoteCard key={(n as { _id: string })._id} note={n as never} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-ink-soft">No field notes yet — check back soon.</p>
      )}
    </div>
  );
}
