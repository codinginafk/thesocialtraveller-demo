import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "missionStatement",
      title: "Mission Statement (one line)",
      type: "text",
      rows: 2,
      description: "The single-line hook shown on the home hero.",
    }),
    defineField({
      name: "subline",
      title: "Hero Sub-line",
      type: "string",
      description: "The line shown under the mission statement on the home hero.",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
