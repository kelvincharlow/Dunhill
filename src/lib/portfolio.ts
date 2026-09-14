import { categories } from "./project-categories";

type PortfolioEntry = { slug: string; title: string; category: string };

export function portfolioState<T extends PortfolioEntry>(category?: string | null, projects: T[] = []) {
  const selected = categories.find(item => item === category) || "All projects";
  const visible = projects.filter(project => selected === "All projects" || project.category === selected);
  const params = new URLSearchParams();
  if (selected !== "All projects") params.set("category", selected);
  const suffix = params.size ? `?${params}` : "";
  return { category: selected, visible, suffix, href: `/projects${suffix}` };
}
