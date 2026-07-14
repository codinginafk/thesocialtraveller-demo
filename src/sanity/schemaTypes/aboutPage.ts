import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      description: "The main story: travel style, adventure descriptions.",
    }),
    defineField({
      name: "heroQuote",
      title: "Philosophy Quote",
      type: "text",
      rows: 3,
      description: "The opening philosophical quote (e.g. Malshej monologue).",
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 2,
      description: "First-person lead paragraph.",
    }),
    defineField({
      name: "missionQuote",
      title: "The Cleanup Mission Hook",
      type: "string",
      description: "The cleanup one-liner (e.g. \"It's not my trash, but it's our planet for sure.\")",
    }),
    defineField({
      name: "footerCallout",
      title: "The Final Request",
      type: "text",
      rows: 3,
      description: "The closing ask to visitors.",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
