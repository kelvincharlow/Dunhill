import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import styles from "../projects.module.css";
export function generateStaticParams() { return projects.map(p=>({slug:p.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> { const {slug}=await params;const p=projects.find(p=>p.slug===slug);return {title:p ? `${p.title} | Dunhill Projects` : "Project not found | Dunhill",description:p?.description}; }
export default async function Project({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;const project=projects.find(p=>p.slug===slug);if(!project)notFound();
  const next=projects[(projects.indexOf(project)+1)%projects.length];
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader onProjects /><main id="main" className="wrap"><section className={styles.detailHero}><Link className="text-link" href="/projects">← All projects</Link><p className="eyebrow">{project.category}</p><h1>{project.title}</h1><p>{project.location} · {project.year}</p>{project.image ? <div className={styles.detailPhoto}><Image src={`/images/profile/${project.image}`} alt={project.title} fill preload sizes="90vw" /></div> : <div className={styles.archiveNotice}><span className="eyebrow">From the project archive</span><p>Project photography is being prepared. Explore the documented project details below.</p></div>}</section><section className={`section ${styles.detailBody}`}><div><p className="eyebrow">Project overview</p><h2>A part of<br /><em>our building story.</em></h2><p>{project.description}</p><Link className="text-link" href={`/services#${project.service}`}>Explore the related service <span aria-hidden="true">↗</span></Link></div><div><dl>{[["Location",project.location],["Category",project.category],["Profile year",project.year],["Client",project.client],["Architect",project.architect],["Consulting engineer",project.engineer]].filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className={styles.note}>Source: {project.source}. Years are profile records, not verified completion dates.</p></div></section><section className={styles.contact} id="contact"><p className="eyebrow">Build on this experience</p><div><h2>Planning<br /><em>something similar?</em></h2><a className="button" href={`mailto:info@dunhillbcon.com?subject=${encodeURIComponent(`Project enquiry: ${project.title}`)}`}>Discuss your project <span aria-hidden="true">↗</span></a></div><Link className="text-link" href={`/projects/${next.slug}`}>Next project: {next.title} <span aria-hidden="true">↗</span></Link></section></main><InnerFooter /></>;
}
