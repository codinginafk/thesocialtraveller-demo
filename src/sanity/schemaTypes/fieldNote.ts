import { defineField, defineType } from "sanity";

// "Field Notes" replaces the old Announcements. Editorial, SEO-friendly
// short posts (tips, stories, reflections). Optionally tied to a Journey.
export const fieldNote = defineType({
  name: "fieldNote",
  title: "Field Note",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 2 }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "journey",
      title: "Related Journey",
      type: "reference",
      to: [{ type: "journey" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "pinned",
      title: "Pin to top",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      name: "publishedDesc",
      title: "Published (newest)",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "tags", media: "coverImage" },
  },
});
