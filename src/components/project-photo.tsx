import Image from "next/image";
import type { Project } from "@/lib/projects";

export function ProjectPhoto({ project, sizes, preload = false }: { project: Project; sizes: string; preload?: boolean }) {
  if (!project.image) return null;
  return <Image src={project.cover?.src || `/images/profile/${project.image}`} alt={project.cover?.alt || `${project.title}, ${project.location}`} style={project.cover ? { objectPosition: project.cover.position } : undefined} fill sizes={sizes} preload={preload} />;
}
