import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/sanity-projects";
import { ProjectPhoto } from "@/components/project-photo";
import { services } from "@/lib/services";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import { ProjectBrowseLinks } from "@/components/project-browse-links";
import styles from "../projects.module.css";

export const revalidate = 60;
export function generateStaticParams() { return []; }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> { const {slug}=await params; const project=await getProject(slug); return {title:project ? `${project.title} | Dunhill Projects` : "Project not found | Dunhill",description:project?.description}; }
export default async function Project({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const project=await getProject(slug);
  if(!project)notFound();
  const service = services.find(item => item.id === project.service);
  const relatedServices = (project.services || [project.service]).flatMap(id => services.filter(item => item.id === id));
  const browseProjects = (await getProjects()).filter(item => item.image).map(({slug, title, category}) => ({slug, title, category}));
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader onProjects /><main id="main" tabIndex={-1} className="wrap">
    <section className={styles.detailHero} aria-labelledby="project-title">
      <Suspense fallback={<Link className="text-link" href="/projects"><ArrowIcon direction="left" /> All projects</Link>}><ProjectBrowseLinks projects={browseProjects} slug={slug} compact /></Suspense>
      <p className="eyebrow">{project.category}</p><h1 id="project-title">{project.title}</h1><p className={styles.location}>{project.location}</p>
      {project.image && <div className={styles.detailPhoto}><ProjectPhoto project={project} preload sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1472px) calc(100vw - 112px), 1360px" /></div>}
      {(project.cover?.caption || project.cover?.credit) && <p className={styles.photoCaption}>{project.cover.caption}{project.cover.credit && <span>Photo: {project.cover.credit}</span>}</p>}
    </section>
    <section className={styles.detailBody} aria-labelledby="overview-title">
      <div><p className="eyebrow">PROJECT OVERVIEW</p><h2 id="overview-title">The work.</h2><p className={styles.description}>{project.description}</p><div className={styles.relatedServices}>{relatedServices.map(item => <Link key={item.id} className="text-link" href={`/services#${item.id}`}>{item.title} <span aria-hidden="true"><ArrowIcon /></span></Link>)}</div>{Boolean(project.scope?.length) && <div className={styles.scope}><h3>Scope of work</h3><ul>{project.scope?.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}{!project.image && <p className={styles.archiveNote}>A project record from our company profile. Photography is not currently available for this entry.</p>}</div>
      <div><h2 className={styles.factsTitle}>Project at a glance</h2><dl>{[["Location",project.location],["Sector",project.category],["Status",project.status],["Completed",project.completionYear?.toString()],["Profile year",project.year === "To be confirmed" ? "Not listed" : project.year],["Client",project.client],["Architect",project.architect],["Consulting engineer",project.engineer]].filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{project.source && <p className={styles.note}>Source: {project.source}. Years are profile records, not verified completion dates.</p>}</div>
    </section>
    {Boolean(project.gallery?.length) && <section className={styles.gallery} aria-labelledby="gallery-title"><p className="eyebrow">A CLOSER LOOK</p><h2 id="gallery-title">In detail.</h2><div className={styles.galleryGrid}>{project.gallery?.map((photo, index) => <figure key={`${photo.src}-${index}`}><a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full photograph: ${photo.alt}`}><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 800px) calc(100vw - 44px), 46vw" /></a>{(photo.caption || photo.credit) && <figcaption>{photo.caption}{photo.credit && <span>Photo: {photo.credit}</span>}</figcaption>}</figure>)}</div></section>}
    <section className={styles.contact} id="contact"><div><p className="eyebrow">PLANNING SOMETHING SIMILAR?</p><h2>Let’s talk<br /><em>about yours.</em></h2></div><Link className="button" href={`/contact?service=${encodeURIComponent(service?.title || "General enquiry")}#enquiry`}>Discuss your project <span aria-hidden="true"><ArrowIcon /></span></Link></section>
    <Suspense fallback={<Link className="text-link" href="/projects">View all projects <ArrowIcon /></Link>}><ProjectBrowseLinks projects={browseProjects} slug={slug} /></Suspense>
  </main><InnerFooter /></>;
}
