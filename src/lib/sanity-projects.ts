import "server-only";
import { cache } from "react";
import { projects as localProjects, type Project } from "./projects";
import { sanityProject } from "./project-content";

export const projectsQuery = `*[_type == "project" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(coalesce(displayOrder, 100) asc, title asc, _id asc) {
  _id, title, slug, category, location, description, coverImage, gallery,
  services, scope, status, completionYear, client, architect, engineer, featured
}`;

export const getProjects = cache(async (): Promise<Project[]> => {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET;
  if (!projectId || !dataset) return [];
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) throw new Error("Invalid Sanity project ID or dataset configuration");
  const url = new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set("query", projectsQuery);
  url.searchParams.set("perspective", "published");
  try {
    const response = await fetch(url, { next: { revalidate: 60, tags: ["projects"] }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Sanity returned HTTP ${response.status}`);
    const { result } = await response.json();
    if (!Array.isArray(result)) throw new Error("Unexpected Sanity response");
    if (!result.length) return [];
    const seen = new Set<string>();
    return result.map(item => sanityProject(item, projectId, dataset)).filter((project): project is Project => {
      if (!project || seen.has(project.slug)) return false;
      seen.add(project.slug);
      return true;
    });
  } catch (error) {
    console.error("Sanity projects unavailable; no portfolio projects returned.", error);
    return [];
  }
});

export async function getProject(slug: string) {
  const projects = await getProjects();
  // Preserve existing company-profile URLs during migration without adding them to the CMS grid.
  return projects.find(project => project.slug === slug) ?? localProjects.find(project => project.slug === slug);
}
