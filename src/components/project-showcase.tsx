import { ArrowIcon } from "@/components/arrow-icon";
import { ProjectPhoto } from "./project-photo";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import styles from "@/app/home.module.css";

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return <div className={styles.projectGrid}>
    {projects.map(project => <Link className={styles.projectCard} href={`/projects/${project.slug}`} key={project.slug}>
      <div className={styles.projectPhoto}>
        <ProjectPhoto project={project} sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1472px) 46vw, 664px" />
        <span>{project.category}</span>
      </div>
      <div className={styles.projectCaption}><div><h3>{project.title}</h3><p>{project.location}</p></div><span aria-hidden="true"><ArrowIcon /></span></div>
    </Link>)}
  </div>;
}
