import { categories, projects, type Project } from "./projects";

// Only projects with photography appear in the visual portfolio.
// Keep other source records available for existing service and detail links.
export const portfolioProjects = projects.filter((project): project is Project & { image: string } => Boolean(project.image));

export function portfolioState(category?: string | null) {
  const selected = categories.find(item => item === category) || "All projects";
  const visible = portfolioProjects.filter(project => selected === "All projects" || project.category === selected);
  const params = new URLSearchParams();
  if (selected !== "All projects") params.set("category", selected);
  const suffix = params.size ? `?${params}` : "";
  return { category: selected, visible, suffix, href: `/projects${suffix}` };
}
