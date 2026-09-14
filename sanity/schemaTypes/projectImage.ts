import { defineField, defineType } from "sanity";

export const projectImage = defineType({
  name: "projectImage",
  title: "Project photograph",
  type: "image",
  options: { hotspot: true, accept: "image/jpeg,image/png,image/webp" },
  validation: rule => rule.assetRequired(),
  fields: [
    defineField({ name: "alt", title: "Image description (alt text)", type: "string", description: "Briefly describe the building or work shown for visitors who cannot see the image.", validation: rule => rule.required().max(200).custom(value => value && !value.trim() ? "Describe what the photograph shows." : true) }),
    defineField({ name: "caption", title: "Caption", type: "string", validation: rule => rule.max(200) }),
    defineField({ name: "credit", title: "Photographer / credit", type: "string", validation: rule => rule.max(120) }),
  ],
  preview: { select: { title: "alt", subtitle: "caption", media: "asset" } },
});
