import { ArrowIcon } from "@/components/arrow-icon";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/projects";
import { portfolioProjects, portfolioState } from "@/lib/portfolio";
import styles from "@/app/projects/projects.module.css";

export function ProjectGrid({ category = "All projects" }: { category?: string }) {
  const state = portfolioState(category);
  return <>
    <nav className={styles.filters} aria-label="Filter projects by category">{categories.map(item => <Link href={portfolioState(item).href} key={item} scroll={false} aria-current={state.category === item ? "true" : undefined}>{item}<span>{item === "All projects" ? portfolioProjects.length : portfolioProjects.filter(project => project.category === item).length}</span></Link>)}</nav>
    <div className={styles.resultsHeading}><p className={styles.count} role="status">{state.visible.length} {state.visible.length === 1 ? "project" : "projects"} · {state.category}</p>{state.category !== "All projects" && <Link href="/projects" scroll={false}>Clear filter <span aria-hidden="true">×</span></Link>}</div>
    <div id="project-results">
      {state.visible.length > 0 ? <div className={styles.grid}>{state.visible.map(project => <Link className={styles.card} href={`/projects/${project.slug}${state.suffix}`} key={project.slug}>
        <div className={styles.cardImage}><Image src={`/images/profile/${project.image}`} alt={project.title} fill sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1472px) 46vw, 665px" /><span className={styles.arrow} aria-hidden="true"><ArrowIcon /></span></div>
        <div className={styles.cardCaption}><h2>{project.title}</h2></div>
      </Link>)}</div> : <div className={styles.empty}><h2>More projects to come.</h2><p>There are no projects displayed in this category yet. Explore our current portfolio.</p><Link className="button" href="/projects" scroll={false}>View all projects <span aria-hidden="true"><ArrowIcon /></span></Link></div>}
    </div>
  </>;
}
