import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { services } from "@/lib/services";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import { ProjectBrowseLinks } from "@/components/project-browse-links";
import styles from "../projects.module.css";

export function generateStaticParams() { return projects.map(project => ({ slug:project.slug })); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> { const {slug}=await params; const project=projects.find(item=>item.slug===slug); return {title:project ? `${project.title} | Dunhill Projects` : "Project not found | Dunhill",description:project?.description}; }
export default async function Project({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const project=projects.find(item=>item.slug===slug);
  if(!project)notFound();
  const service = services.find(item => item.id === project.service);
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader onProjects /><main id="main" tabIndex={-1} className="wrap">
    <section className={styles.detailHero} aria-labelledby="project-title">
      <Suspense fallback={<Link className="text-link" href="/projects"><ArrowIcon direction="left" /> All projects</Link>}><ProjectBrowseLinks slug={slug} compact /></Suspense>
      <p className="eyebrow">{project.category}</p><h1 id="project-title">{project.title}</h1><p className={styles.location}>{project.location}</p>
      {project.image && <div className={styles.detailPhoto}><Image src={`/images/profile/${project.image}`} alt={`${project.title}, ${project.location}`} fill preload sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1472px) calc(100vw - 112px), 1360px" /></div>}
    </section>
    <section className={styles.detailBody} aria-labelledby="overview-title">
      <div><p className="eyebrow">PROJECT OVERVIEW</p><h2 id="overview-title">The work.</h2><p className={styles.description}>{project.description}</p><Link className="text-link" href={`/services#${project.service}`}>{service?.title || "Explore the related service"} <span aria-hidden="true"><ArrowIcon /></span></Link>{!project.image && <p className={styles.archiveNote}>A project record from our company profile. Photography is not currently available for this entry.</p>}</div>
      <div><h2 className={styles.factsTitle}>Project at a glance</h2><dl>{[["Location",project.location],["Sector",project.category],["Profile year",project.year === "To be confirmed" ? "Not listed" : project.year],["Client",project.client],["Architect",project.architect],["Consulting engineer",project.engineer]].filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className={styles.note}>Source: {project.source}. Years are profile records, not verified completion dates.</p></div>
    </section>
    <section className={styles.contact} id="contact"><div><p className="eyebrow">PLANNING SOMETHING SIMILAR?</p><h2>Let’s talk<br /><em>about yours.</em></h2></div><Link className="button" href={`/contact?service=${encodeURIComponent(service?.title || "General enquiry")}#enquiry`}>Discuss your project <span aria-hidden="true"><ArrowIcon /></span></Link></section>
    <Suspense fallback={<Link className="text-link" href="/projects">View all projects <ArrowIcon /></Link>}><ProjectBrowseLinks slug={slug} /></Suspense>
  </main><InnerFooter /></>;
}
