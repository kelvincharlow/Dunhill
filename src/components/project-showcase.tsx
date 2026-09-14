import { ArrowIcon } from "@/components/arrow-icon";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import styles from "@/app/home.module.css";

const featured = projects.filter(project => ["crescent-pearl", "national-park-villas"].includes(project.slug));

export function ProjectShowcase() {
  return <div className={styles.projectGrid}>
    {featured.map(project => <Link className={styles.projectCard} href={`/projects/${project.slug}`} key={project.slug}>
      <div className={styles.projectPhoto}>
        <Image src={`/images/profile/${project.image}`} alt={`${project.title}, ${project.location}`} fill sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1472px) 46vw, 664px" />
        <span>{project.category}</span>
      </div>
      <div className={styles.projectCaption}><div><h3>{project.title}</h3><p>{project.location}</p></div><span aria-hidden="true"><ArrowIcon /></span></div>
    </Link>)}
  </div>;
}
