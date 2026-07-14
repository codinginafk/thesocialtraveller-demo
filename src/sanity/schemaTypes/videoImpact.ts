import { defineField, defineType } from "sanity";

export const videoImpact = defineType({
  name: "videoImpact",
  title: "Video Impact (auto-analyzed)",
  type: "document",
  // One document per YouTube video, keyed by _id = `videoImpact.<videoId>`.
  // Written by scripts/analyze.ts (monotonic: never deleted, trashKg only rises).
  fields: [
    defineField({
      name: "videoId",
      title: "YouTube Video ID",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "isShort",
      title: "Is a short/clip (not a trip)?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "places",
      title: "Places / locations mentioned",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Extracted from the title/description (and later, transcripts). Distinct values feed the 'locations visited' stat.",
    }),
    defineField({
      name: "trashKg",
      title: "Trash collected (kg)",
      type: "number",
      validation: (r) => r.min(0),
      description:
        "At least 1 kg per long video. Overridden only when the video states/shows a specific amount.",
    }),
    defineField({
      name: "source",
      title: "Analysis source",
      type: "string",
      readOnly: true,
      description: "title_description | transcript",
    }),
    defineField({
      name: "analyzedAt",
      title: "Analyzed at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 2,
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "videoId", media: "places" },
  },
});
