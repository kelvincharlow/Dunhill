import { createImageUrlBuilder } from "@sanity/image-url";
import { categories } from "./project-categories";
import { services } from "./services";
import type { Project, ProjectPhoto } from "./projects";

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue => value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const strings = (value: unknown) => Array.isArray(value) ? value.map(text).filter(Boolean) : [];
const fraction = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;

export function sanityPhoto(value: unknown, projectId: string, dataset: string): ProjectPhoto | undefined {
  const photo = record(value);
  const ref = text(record(photo.asset)._ref);
  const dimensions = /^image-[a-zA-Z0-9]+-(\d+)x(\d+)-(jpg|jpeg|png|webp)$/.exec(ref);
  const alt = text(photo.alt);
  if (!dimensions || !alt) return;
  const width = Number(dimensions[1]), height = Number(dimensions[2]);
  if (!width || !height) return;
  const crop = record(photo.crop), hotspot = record(photo.hotspot);
  const left = fraction(crop.left, 0), right = fraction(crop.right, 0);
  const top = fraction(crop.top, 0), bottom = fraction(crop.bottom, 0);
  if (left + right >= 1 || top + bottom >= 1) return;
  const source = { asset: { _ref: ref }, crop: { left, right, top, bottom } };
  const src = createImageUrlBuilder({ projectId, dataset }).image(source).width(2200).fit("max").auto("format").url();
  // The CDN applies the editor's crop; CSS keeps the hotspot visible in each layout.
  const x = fraction((fraction(hotspot.x, .5) - left) / (1 - left - right), .5);
  const y = fraction((fraction(hotspot.y, .5) - top) / (1 - top - bottom), .5);
  return { src, alt, width: Math.max(1, Math.round(width * (1 - left - right))), height: Math.max(1, Math.round(height * (1 - top - bottom))), position: `${x * 100}% ${y * 100}%`, caption: text(photo.caption), credit: text(photo.credit) };
}

export function sanityProject(value: unknown, projectId: string, dataset: string): Project | undefined {
  const doc = record(value);
  const slug = text(record(doc.slug).current);
  const title = text(doc.title), location = text(doc.location), description = text(doc.description), category = text(doc.category);
  const cover = sanityPhoto(doc.coverImage, projectId, dataset);
  const related = strings(doc.services).filter(id => services.some(service => service.id === id));
  if (text(doc._id).startsWith("drafts.") || text(doc._id).startsWith("versions.") || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || !location || !description || !cover || !related.length || !categories.some(item => item !== "All projects" && item === category)) return;
  const gallery = (Array.isArray(doc.gallery) ? doc.gallery : []).map(item => sanityPhoto(item, projectId, dataset)).filter((item): item is ProjectPhoto => Boolean(item));
  const completionYear = typeof doc.completionYear === "number" && Number.isInteger(doc.completionYear) && doc.completionYear >= 1900 && doc.completionYear <= new Date().getFullYear() ? doc.completionYear : undefined;
  return { slug, title, location, description, category, image: cover.src, cover, gallery, services: related, service: related[0], featured: doc.featured === true, scope: strings(doc.scope), status: ({ planned: "Planned", "in-progress": "In progress", completed: "Completed" } as Record<string, string>)[text(doc.status)], completionYear, client: text(doc.client), architect: text(doc.architect), engineer: text(doc.engineer), year: "", source: "" };
}

export function featuredProjects(projects: Project[]) {
  const photographed = projects.filter(project => project.image);
  const featured = photographed.filter(project => project.featured);
  return (featured.length ? featured : photographed).slice(0, 2);
}
