"use client";

import { ArrowIcon } from "@/components/arrow-icon";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { portfolioProjects, portfolioState } from "@/lib/portfolio";
import styles from "@/app/projects/projects.module.css";

export function ProjectBrowseLinks({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const params = useSearchParams();
  const state = portfolioState(params.get("category"));
  if (compact) return <Link className="text-link" href={state.href}><ArrowIcon direction="left" /> {state.suffix ? "Back to results" : "All projects"}</Link>;
  const group = state.visible.some(project => project.slug === slug) ? state.visible : portfolioProjects;
  const index = group.findIndex(project => project.slug === slug);
  const previous = group[index - 1];
  const next = group[index + 1];
  return <nav className={styles.browse} aria-label="Browse projects">
    {previous && <Link href={`/projects/${previous.slug}${state.suffix}`}><small><ArrowIcon direction="left" /> PREVIOUS PROJECT</small><strong>{previous.title}</strong></Link>}
    <Link href={state.href}><small>THE PORTFOLIO</small><strong>{state.suffix ? "Back to results" : "View all projects"} <ArrowIcon /></strong></Link>
    {next && <Link href={`/projects/${next.slug}${state.suffix}`}><small>NEXT PROJECT <ArrowIcon direction="right" /></small><strong>{next.title}</strong></Link>}
  </nav>;
}
