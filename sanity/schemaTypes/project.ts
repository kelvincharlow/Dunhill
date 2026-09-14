import { defineArrayMember, defineField, defineType } from "sanity";
import { categories } from "../../src/lib/project-categories";
import { services } from "../../src/lib/services";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "essentials", title: "Essentials", default: true },
    { name: "photography", title: "Photography" },
    { name: "details", title: "Project details" },
    { name: "display", title: "Website display" },
  ],
  fields: [
    defineField({ name: "title", title: "Project name", type: "string", group: "essentials", validation: rule => rule.required().max(100).custom(value => value && !value.trim() ? "Enter a project name." : true) }),
    defineField({ name: "slug", title: "Page address", type: "slug", group: "essentials", description: "Generate from the project name. Keep this unchanged after publishing so existing links continue to work.", options: { source: "title", maxLength: 96 }, validation: rule => rule.required().custom(value => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) ? true : "Use lowercase letters, numbers and hyphens only.") }),
    defineField({ name: "category", title: "Category", type: "string", group: "essentials", options: { list: categories.filter(category => category !== "All projects").map(category => ({ title: category, value: category })) }, validation: rule => rule.required() }),
    defineField({ name: "location", title: "Location", type: "string", group: "essentials", description: "For example: Westlands, Nairobi.", validation: rule => rule.required().max(160).custom(value => value && !value.trim() ? "Enter a location." : true) }),
    defineField({ name: "description", title: "Project overview", type: "text", rows: 5, group: "essentials", description: "A short introduction for the project detail page. The grid shows only the photo and project name.", validation: rule => rule.required().min(20).max(2000).custom(value => value && value.trim().length < 20 ? "Write at least 20 characters about the project." : true) }),
    defineField({ name: "coverImage", title: "Cover photograph", type: "projectImage", group: "photography", description: "Used on the project card and detail page. Set the crop and focal point for different screen sizes.", validation: rule => rule.required() }),
    defineField({ name: "gallery", title: "Project gallery", type: "array", group: "photography", description: "Drag photographs to change their order. Avoid repeating the cover photograph.", of: [defineArrayMember({ type: "projectImage" })], validation: rule => rule.max(30) }),
    defineField({ name: "services", title: "Related services", type: "array", group: "details", description: "The first service will be used for the project's enquiry link.", of: [defineArrayMember({ type: "string" })], options: { list: services.map(service => ({ title: service.title, value: service.id })) }, validation: rule => rule.required().min(1).unique() }),
    defineField({ name: "scope", title: "Scope of work", type: "array", group: "details", description: "Short points describing the work Dunhill delivered.", of: [defineArrayMember({ type: "string", validation: rule => rule.required().max(180) })], validation: rule => rule.max(12) }),
    defineField({ name: "status", title: "Project status", type: "string", group: "details", options: { list: [{ title: "Planned", value: "planned" }, { title: "In progress", value: "in-progress" }, { title: "Completed", value: "completed" }] } }),
    defineField({ name: "completionYear", title: "Confirmed completion year", type: "number", group: "details", description: "Optional. Leave blank if only a company-profile year is known.", validation: rule => rule.integer().min(1900).custom(value => value === undefined || value <= new Date().getFullYear() ? true : "Completion year cannot be in the future.") }),
    ...["client", "architect", "engineer"].map(name => defineField({ name, title: name[0].toUpperCase() + name.slice(1), type: "string", group: "details", description: "Optional; enter only confirmed information approved for publication.", validation: rule => rule.max(160) })),
    defineField({ name: "featured", title: "Feature on homepage", type: "boolean", group: "display", initialValue: false }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", group: "display", initialValue: 100, description: "Lower numbers appear first. Projects with the same number will sort by name.", validation: rule => rule.required().integer().min(0) }),
  ],
  orderings: [
    { title: "Website order", name: "websiteOrder", by: [{ field: "displayOrder", direction: "asc" }, { field: "title", direction: "asc" }] },
    { title: "Project name", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Recently edited", name: "recent", by: [{ field: "_updatedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", category: "category", location: "location", media: "coverImage" },
    prepare({ title, category, location, media }) { return { title, subtitle: [category, location].filter(Boolean).join(" · "), media }; },
  },
});
