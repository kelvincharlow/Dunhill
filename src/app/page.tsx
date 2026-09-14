import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import { ProjectShowcase } from "@/components/project-showcase";
import heroStyles from "./hero.module.css";
import styles from "./home.module.css";

const services = [
  { title: "Building construction", copy: "Homes, apartments, workplaces and hotels.", href: "/services#building", icon: "M5 21V3h14v18M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 21v-3h4v3M3 21h18" },
  { title: "Civil engineering", copy: "Roads, drainage and the infrastructure beneath.", href: "/services#civil", icon: "M8 3 3 21M16 3l5 18M12 3v3m0 3v3m0 3v3m0 3v1" },
  { title: "Industrial construction", copy: "Warehouses, production plants and storage facilities.", href: "/services#industrial", icon: "M3 21V10l6 3V8l6 3V3h4l2 18H3ZM7 17h2m3 0h2m3 0h1" },
  { title: "Renovation & refurbishment", copy: "Alterations, additions and a fresh start for existing buildings.", href: "/services#renovation", icon: "m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7M17 3v4" },
  { title: "Timber joinery", copy: "Doors, frames, cabinetry and finishing details.", href: "/services#joinery", icon: "M5 21V3h14v18M3 21h18M8 6h8v15M13 13h1" },
  { title: "Metal & steel fabrication", copy: "Structural steelwork, metal doors, grills and frames.", href: "/services#fabrication", icon: "M3 4h18v3H3zM3 17h18v3H3zM9 7v10m6-10v10M4 11h3m10 2h3" },
];

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main" tabIndex={-1}>
      <section className={heroStyles.hero} id="home" aria-labelledby="hero-title">
        <figure className={heroStyles.visual}>
          <Image src="/images/profile/crescent-pearl-b.jpeg" alt="Crescent Pearl in Westlands, Nairobi" fill preload sizes="100vw" />
          <figcaption className={heroStyles.caption}>
            <Link href="/projects/crescent-pearl" aria-label="View Crescent Pearl project">
              <span className={heroStyles.projectInfo}><small>FEATURED PROJECT</small><strong>Crescent Pearl</strong><span>Westlands, Nairobi</span></span>
              <span className={heroStyles.projectArrow} aria-hidden="true"><ArrowIcon /></span>
            </Link>
          </figcaption>
        </figure>
        <div className={heroStyles.heading}>
          <p className="eyebrow">Building Kenya since 1983</p>
          <h1 id="hero-title">Building excellence.</h1>
          <p className={heroStyles.tagline}>Creating landmarks.</p>
        </div>
        <div className={`wrap ${heroStyles.introduction}`}>
          <p>Construction, civil engineering and specialist craftsmanship. Built on four decades of experience.</p>
          <div className={heroStyles.actions}>
            <Link className="button" href="/projects">Explore our work <span aria-hidden="true"><ArrowIcon /></span></Link>
            <Link className="quiet-link" href="/contact">Contact us <span aria-hidden="true"><ArrowIcon /></span></Link>
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.trust}`} aria-label="Company highlights">
        <div><strong>1983</strong><span>Building Kenya since</span></div>
        <div><strong>NCA 1<span>*</span></strong><span>Building contractor category</span></div>
        <div><strong>In-house</strong><span>Timber & metal workshops</span></div>
        <Link href="/compliance" className={styles.trustLink}>*Category stated in our company profile.<br />View credentials & request current licences <span aria-hidden="true"><ArrowIcon /></span></Link>
      </section>

      <section className={styles.projects} id="projects" aria-labelledby="projects-title">
        <div className="wrap">
          <div className="section-label"><span>01 / SELECTED WORK</span><span>THE DUNHILL PORTFOLIO</span></div>
          <div className={styles.sectionHeading}><h2 id="projects-title">See what<br /><em>we build.</em></h2><Link className="text-link" href="/projects">View all projects <span aria-hidden="true"><ArrowIcon /></span></Link></div>
          <ProjectShowcase />
        </div>
      </section>

      <section className={`wrap ${styles.section}`} id="capabilities" aria-labelledby="services-title">
        <div className="section-label"><span>02 / WHAT WE DO</span><span>FROM STRUCTURE TO FINISH</span></div>
        <div className={styles.sectionHeading}><h2 id="services-title">The expertise<br /><em>your project needs.</em></h2><Link className="text-link" href="/services">Explore our services <span aria-hidden="true"><ArrowIcon /></span></Link></div>
        <div className={styles.services}>{services.map(service => <Link href={service.href} key={service.href} className={styles.serviceCard}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={service.icon} /></svg>
          <h3>{service.title}</h3><p>{service.copy}</p><span className={styles.cardArrow} aria-hidden="true"><ArrowIcon /></span>
        </Link>)}</div>
      </section>

      <section className={styles.company} id="company" aria-labelledby="company-title">
        <div className={styles.companyPhoto}><Image src="/images/profile/industrial-01.jpeg" alt="Structural steel erection with lifting equipment on a Dunhill construction site" fill sizes="(max-width: 800px) 100vw, 50vw" /><span>ON SITE. HANDS ON.</span></div>
        <div className={styles.companyCopy}>
          <p className="eyebrow">03 / THE PEOPLE & RESOURCES BEHIND THE WORK</p>
          <h2 id="company-title">Built on experience.<br /><em>Backed by capability.</em></h2>
          <p>Operating since 1983 and incorporated in 1997, we bring together construction teams, our own plant, and timber and metal workshops to take projects from structure to finishing.</p>
          <ul className={styles.values}><li>Trust</li><li>Integrity</li><li>Collaboration</li></ul>
          <div className={styles.companyLinks}><Link className="text-link" href="/about">Our story & team <span aria-hidden="true"><ArrowIcon /></span></Link><Link className="text-link" href="/plant-workshops">Our plant & machinery <span aria-hidden="true"><ArrowIcon /></span></Link></div>
        </div>
      </section>

      <section className={`wrap ${styles.clients}`} aria-labelledby="clients-title">
        <p className="eyebrow">SELECTED CLIENTS FROM OUR PROJECT HISTORY</p>
        <h2 id="clients-title">Good work. <em>Lasting relationships.</em></h2>
        <ul className={styles.clientNames}><li>JAMBO <span>HOLDINGS</span></li><li>Amber<span>PROPERTIES</span></li><li>ACTA<span>HOLDINGS</span></li><li>KAPA<span>OIL REFINERIES</span></li><li>Willow<span>PROPERTIES</span></li></ul>
      </section>

      <section className={`wrap ${styles.contact}`} id="contact" aria-labelledby="contact-title">
        <div><p className="eyebrow">LET’S BUILD WHAT’S NEXT</p><h2 id="contact-title">Your project.<br /><em>Our next conversation.</em></h2><p>Tell us what you’re planning. We’ll help you take the next step.</p></div>
        <div className={styles.contactActions}><Link className="button" href="/contact">Contact us <span aria-hidden="true"><ArrowIcon /></span></Link><a className="quiet-link" href="mailto:info@dunhillbcon.com">Email our team <span aria-hidden="true"><ArrowIcon /></span></a></div>
      </section>
    </main>
    <InnerFooter />
  </>;
}
