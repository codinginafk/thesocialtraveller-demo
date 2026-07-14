import { defineField, defineType } from "sanity";

export const impactStats = defineType({
  name: "impactStats",
  title: "Impact Stats",
  type: "document",
  fields: [
    defineField({
      name: "tripsCompleted",
      title: "Trips Completed",
      type: "number",
    }),
    defineField({
      name: "trashCollectedKg",
      title: "Estimated Trash Collected (kg)",
      type: "number",
    }),
    defineField({
      name: "trashIsEstimate",
      title: "Trash figure is an estimate?",
      type: "boolean",
      initialValue: true,
      description:
        "Toggle on whenever the number is not a precisely measured total.",
    }),
    defineField({
      name: "locationsVisited",
      title: "Locations Visited",
      type: "number",
    }),
    defineField({
      name: "dustbinGoal",
      title: "Dustbin Pledge Goal (count)",
      type: "number",
    }),
    defineField({
      name: "dustbinsFunded",
      title: "Dustbins Funded So Far",
      type: "number",
    }),
    defineField({
      name: "asOf",
      title: "Figures as of (date)",
      type: "date",
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer / note",
      type: "text",
      rows: 2,
      description:
        "Shown publicly whenever numbers are illustrative / in-progress.",
    }),
  ],
  preview: { prepare: () => ({ title: "Impact Stats" }) },
});
