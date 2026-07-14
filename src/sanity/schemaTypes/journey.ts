import { defineField, defineType } from "sanity";

// Reusable object: one place visited within a journey. The interactive map
// (Phase 2) simply queries every journey's `locations[]`, so the map needs
// no separate collection — pins live inside journeys.
export const journeyLocation = defineType({
  name: "journeyLocation",
  title: "Location",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "lat", title: "Latitude", type: "number" }),
    defineField({ name: "lng", title: "Longitude", type: "number" }),
    defineField({ name: "region", title: "Region / State", type: "string" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps URL", type: "url" }),
    defineField({ name: "visitedDate", title: "Visited", type: "date" }),
    defineField({ name: "cleanupKg", title: "Waste collected (kg)", type: "number" }),
    defineField({ name: "trashBags", title: "Trash bags", type: "number" }),
    defineField({ name: "description", title: "Note", type: "text", rows: 2 }),
    defineField({ name: "images", title: "Images", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "highlight", title: "Highlight?", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "region" } },
});

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery Photo",
  type: "object",
  fields: [
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "location", title: "Location label", type: "string" }),
  ],
  preview: { select: { title: "caption", media: "photo" } },
});

export const travelTip = defineType({
  name: "travelTip",
  title: "Travel Tip",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["fuel", "road", "food", "network", "safety"], layout: "radio" },
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: { list: ["low", "medium", "high"], layout: "radio" },
      initialValue: "medium",
    }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});

export const journeyQuote = defineType({
  name: "journeyQuote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({ name: "text", title: "Quote", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "attribution", title: "Attribution", type: "string" }),
  ],
  preview: { select: { title: "text" } },
});

export const impactBlock = defineType({
  name: "impactBlock",
  title: "Impact",
  type: "object",
  fields: [
    defineField({ name: "wasteCollected", title: "Waste collected (kg)", type: "number" }),
    defineField({ name: "hours", title: "Hours outdoors", type: "number" }),
    defineField({ name: "peopleJoined", title: "People joined", type: "number" }),
    defineField({ name: "community", title: "Community visited", type: "string" }),
    defineField({ name: "verified", title: "Verified by creator?", type: "boolean", initialValue: false }),
    defineField({ name: "beforeImage", title: "Before image", type: "image", options: { hotspot: true } }),
    defineField({ name: "afterImage", title: "After image", type: "image", options: { hotspot: true } }),
  ],
});

export const journey = defineType({
  name: "journey",
  title: "Journey",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    // The YouTube video is ONE artifact of the journey. The analyzer auto-fills
    // these so a journey exists the moment a video is published; the editor then
    // enriches the rest by hand.
    defineField({ name: "youtubeId", title: "YouTube Video ID", type: "string" }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "url" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 2 }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroVideo", title: "Hero Video (loop)", type: "file" }),
    defineField({ name: "distanceLabel", title: "Distance (e.g. 1200km)", type: "string" }),
    defineField({ name: "durationLabel", title: "Duration (e.g. 2 days)", type: "string" }),
    defineField({ name: "state", title: "State", type: "string" }),
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      options: { list: ["Winter", "Spring", "Summer", "Monsoon", "Autumn"] },
    }),
    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", initialValue: false }),
    defineField({ name: "isShort", title: "Is a Short / clip (NOT a journey)", type: "boolean", initialValue: false }),
    defineField({ name: "trashKg", title: "Waste collected (kg, auto)", type: "number" }),
    defineField({ name: "trashBags", title: "Trash bags (auto)", type: "number" }),
    defineField({ name: "places", title: "Places mentioned (auto)", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "region", title: "Region (auto)", type: "string" }),
    defineField({ name: "body", title: "Field Notes / Story", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "locations", title: "Locations", type: "array", of: [{ type: "journeyLocation" }] }),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "galleryItem" }] }),
    defineField({ name: "tips", title: "Travel Tips", type: "array", of: [{ type: "travelTip" }] }),
    defineField({ name: "quotes", title: "Quotes", type: "array", of: [{ type: "journeyQuote" }] }),
    defineField({ name: "impact", title: "Impact", type: "impactBlock" }),
    defineField({
      name: "relatedJourneys",
      title: "Related Journeys",
      type: "array",
      of: [{ type: "reference", to: [{ type: "journey" }] }],
    }),
  ],
  orderings: [
    { name: "publishedDesc", title: "Published (newest)", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "region", media: "heroImage" },
  },
});
