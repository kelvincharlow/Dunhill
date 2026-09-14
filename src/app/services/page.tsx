import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import { ServiceExplorer } from "@/components/service-explorer";
import styles from "./services.module.css";

export const metadata: Metadata = { title: "Services | Dunhill Building Contractors", description: "Building construction, civil engineering, industrial works, refurbishment, timber joinery and structural fabrication from Dunhill, Kenya." };

export default function Services() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader onServices />
    <main id="main" tabIndex={-1}>
      <div className="wrap">
        <section className={styles.hero} aria-labelledby="services-title">
          <p className="eyebrow">DUNHILL / OUR SERVICES</p>
          <div className={styles.heading}><h1 id="services-title">What are<br /><em>you planning?</em></h1><div><p>A new build, an upgrade, or the finishing details. Find the expertise your project needs.</p><Link className="text-link" href="/contact">Talk through your plans <span aria-hidden="true"><ArrowIcon /></span></Link></div></div>
        </section>
        <ServiceExplorer />
        <p className={styles.note}>Capabilities and project examples are drawn from the 2026 company profile. Scope and resource availability are agreed for each project.</p>
      </div>
      <section className={styles.resources} aria-labelledby="resources-title"><div className={`wrap ${styles.resourceInner}`}><div><p className="eyebrow">BEHIND THE WORK</p><h2 id="resources-title">The resources<br /><em>to bring it together.</em></h2></div><nav aria-label="Explore our resources"><Link href="/plant-workshops"><span><strong>Plant & machinery</strong><small>Equipment, timber joinery and metal fabrication.</small></span><span aria-hidden="true"><ArrowIcon /></span></Link><Link href="/about"><span><strong>Our people</strong><small>The team and principles behind Dunhill.</small></span><span aria-hidden="true"><ArrowIcon /></span></Link><Link href="/compliance"><span><strong>Company credentials</strong><small>Registration and company documentation.</small></span><span aria-hidden="true"><ArrowIcon /></span></Link></nav></div></section>
      <section className={`wrap ${styles.contact}`} id="contact" aria-labelledby="contact-title"><div><p className="eyebrow">LET’S FIND THE RIGHT START</p><h2 id="contact-title">Not sure where<br /><em>your project fits?</em></h2><p>Tell us what you have in mind. We’ll help you identify the relevant expertise.</p></div><Link className="button" href="/contact#enquiry">Tell us about your project <span aria-hidden="true"><ArrowIcon /></span></Link></section>
    </main>
    <InnerFooter />
  </>;
}
