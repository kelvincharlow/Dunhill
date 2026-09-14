import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | Dunhill Building Contractors",
  description: "Discover Dunhill’s story, from operations beginning in 1983 to incorporation in 1997, and the people and principles behind our work.",
};

const leaders = [
  ["Devshi A. Patel", "Chairman"], ["Kunverji A. Kerai", "Managing Director"],
  ["Paresh D. Patel", "Finance Director"], ["Hitesh D. Kerai", "Civil & Construction Engineer"],
  ["Ghansyam K. Varsani", "General Manager"],
];
const values = [
  ["Trust", "Clear communication and relationships you can build on."],
  ["Integrity", "Care for safe, environmentally responsible buildings and honest working relationships."],
  ["Collaboration", "Listening to your needs and involving you throughout the work."],
];

export default function About() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader onAbout />
    <main id="main" tabIndex={-1}>
      <section className={`wrap ${styles.hero}`} aria-labelledby="about-title">
        <div className={styles.heroIntro}>
          <p className="eyebrow">DUNHILL / THE COMPANY</p>
          <h1 id="about-title">More than<br /><em>what we build.</em></h1>
          <p className={styles.heroSummary}>Kenyan roots. Skilled hands.<br />A story that began in 1983.</p>
          <nav className={styles.heroLinks} aria-label="Explore the company">
            <a href="#history">Our story <ArrowIcon direction="down" /></a>
            <a href="#values">Our principles <ArrowIcon direction="down" /></a>
            <a href="#team">Our people <ArrowIcon direction="down" /></a>
          </nav>
        </div>
        <figure className={styles.heroPhoto}>
          <div><Image src="/images/profile/industrial-01.jpeg" alt="Steel columns and lifting equipment on a Dunhill construction site" fill preload sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1472px) 43vw, 630px" /></div>
          <figcaption><span>ON SITE, HANDS ON.</span><span>DUNHILL BUILDING CONTRACTORS</span></figcaption>
        </figure>
      </section>

      <section className={`wrap ${styles.story}`} id="history" aria-labelledby="history-title">
        <div className={styles.storyIntro}><p className="eyebrow">THIS IS DUNHILL</p><h2 id="history-title">Buildings are our work.<br /><em>Relationships are our foundation.</em></h2><p>We’re a Kenyan building and civil engineering company. Since 1983, our story has grown through the people we work with, the places we help create, and the care we bring to each project.</p></div>
        <div className={styles.storyLayout}>
          <figure className={styles.storyPhoto}><div><Image src="/images/profile/industrial-04.jpeg" alt="Steel framing and concrete flooring inside a Dunhill industrial construction project" fill sizes="(max-width: 800px) calc(100vw - 44px), 43vw" /></div><figcaption>THE WORK BEHIND THE FINISHED BUILDING.</figcaption></figure>
          <div className={styles.storyDetails}>
            <div className={styles.dates}><div><strong>1983</strong><span>Operations begin in Kenya</span></div><div><strong>1997</strong><span>Incorporated in Nairobi</span></div></div>
            <p>From homes and workplaces to industrial facilities and civil infrastructure, our experience has grown alongside our client relationships.</p>
            <Link className="text-link" href="/projects">Explore our building story <span aria-hidden="true"><ArrowIcon /></span></Link>
            <figure className={styles.storyInset}><div><Image src="/images/profile/national-park-villas.jpeg" alt="Completed villa exteriors at National Park Villas, Mlolongo" fill sizes="(max-width: 800px) calc(100vw - 80px), 28vw" /></div><figcaption>NATIONAL PARK VILLAS / MLOLONGO</figcaption></figure>
          </div>
        </div>
      </section>

      <section className={styles.purpose} id="values" aria-labelledby="values-title">
        <div className="wrap">
          <p className="eyebrow">WHAT MATTERS TO US</p>
          <div className={styles.sectionHeading}><h2 id="values-title">Our principles.<br /><em>In every project.</em></h2><div className={styles.mission}><p className="eyebrow">OUR MISSION</p><p>To exceed expectations through quality work, timely service and delivery within budget.</p></div></div>
          <div className={styles.values}>{values.map(([title, copy]) => <article key={title}><span aria-hidden="true">+</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <p className={styles.vision}><span>OUR VISION</span>To be a reputable leader in building and construction in Africa.</p>
        </div>
      </section>

      <section className={`wrap ${styles.section}`} id="team" aria-labelledby="team-title">
        <p className="eyebrow">MEET THE LEADERSHIP</p>
        <div className={styles.sectionHeading}><h2 id="team-title">People behind<br /><em>the progress.</em></h2><p>Construction, engineering, operations and finance, working together with our site teams and specialist trades.</p></div>
        <div className={styles.leaders}>{leaders.map(([name, role]) => <article key={name}><h3>{name}</h3><p>{role}</p></article>)}<div className={styles.teamNote}><span className="eyebrow">BEYOND THE LEADERSHIP</span><p>Engineers, quantity surveyors, site supervisors and skilled trades bring the work to life.</p></div></div>
        <p className={styles.note}>Names and roles as listed in the 2026 company profile.</p>
      </section>

      <section className={styles.resources} id="resources" aria-labelledby="resources-title">
        <div className={styles.resourcePhoto}><Image src="/images/profile/industrial-03.jpeg" alt="Construction plant working beside a steel structure at a Dunhill site" fill sizes="(max-width: 800px) 100vw, 50vw" /><span>EXPERIENCE, PUT TO WORK.</span></div>
        <div className={styles.resourceCopy}>
          <p className="eyebrow">OUR OWN RESOURCES. SHARED COMMITMENT.</p>
          <h2 id="resources-title">People. Plant.<br /><em>Practical capability.</em></h2>
          <p>Our site teams are supported by construction plant and our timber joinery and metal fabrication workshops in Embakasi, off Mombasa Road.</p>
          <ul><li>Plant & machinery</li><li>Timber joinery</li><li>Metal & structural fabrication</li></ul>
          <Link className="text-link" href="/plant-workshops">Explore our plant & machinery <span aria-hidden="true"><ArrowIcon /></span></Link>
          <Link className="quiet-link" href="/services">Find the right service <span aria-hidden="true"><ArrowIcon /></span></Link>
        </div>
      </section>

      <aside className={`wrap ${styles.credentials}`} aria-label="Company credentials"><div><strong>Get to know our credentials.</strong><p>Company documentation and contractor registration information.</p></div><Link className="text-link" href="/compliance">View credentials <span aria-hidden="true"><ArrowIcon /></span></Link></aside>

      <section className={`wrap ${styles.contact}`} id="contact" aria-labelledby="contact-title"><div><p className="eyebrow">NOW, LET’S TALK ABOUT YOUR STORY</p><h2 id="contact-title">Let’s build<br /><em>what comes next.</em></h2><p>Tell us about your plans. We’ll start with a conversation.</p></div><div className={styles.contactActions}><Link className="button" href="/contact">Contact us <span aria-hidden="true"><ArrowIcon /></span></Link><a className="quiet-link" href="mailto:info@dunhillbcon.com">Email our team <span aria-hidden="true"><ArrowIcon /></span></a></div></section>
    </main>
    <InnerFooter />
  </>;
}
