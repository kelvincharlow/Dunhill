import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import { ProjectGrid } from "@/components/project-grid";
import { getProjects } from "@/lib/sanity-projects";
import { portfolioState } from "@/lib/portfolio";
import styles from "./projects.module.css";

export const metadata: Metadata = { title:"Projects | Dunhill Building Contractors", description:"Explore Dunhill’s residential, commercial, industrial, hospitality and civil infrastructure project portfolio." };
export default async function Projects({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const projects = await getProjects();
  const params = await searchParams;
  const state = portfolioState(typeof params.category === "string" ? params.category : undefined);
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader onProjects /><main id="main" tabIndex={-1}>
    <section className={`wrap ${styles.hero}`} aria-labelledby="projects-title"><p className="eyebrow">DUNHILL / THE PORTFOLIO</p><div className={styles.heading}><h1 id="projects-title">Our work<span>.</span></h1><p>Places to live. Spaces to work.<br />Infrastructure that connects them.</p></div></section>
    <section className={`wrap ${styles.portfolio}`} aria-label="Browse the portfolio"><ProjectGrid category={state.category} projects={projects} /></section>
    <section className={`wrap ${styles.contact}`} id="contact"><div><p className="eyebrow">BUILD ON THIS EXPERIENCE</p><h2>Have something<br /><em>in mind?</em></h2><p>Tell us about the project you want to bring to life.</p></div><Link className="button" href="/contact#enquiry">Let’s talk about your project <span aria-hidden="true"><ArrowIcon /></span></Link></section>
  </main><InnerFooter /></>;
}
