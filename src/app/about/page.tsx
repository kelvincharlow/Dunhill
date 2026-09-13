import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Brand, SiteHeader } from "@/components/site-header";
import { navigation, navigationHref } from "@/lib/navigation";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | Dunhill Building Contractors",
  description: "Discover Dunhill’s story, from operations beginning in 1983 to incorporation in 1997, and the people and principles behind our work.",
};

const milestones = [
  ["1983", "Our story begins", "Dunhill begins its construction operations in Kenya, establishing the foundations of the business."],
  ["1997", "A new chapter", "Incorporated as Dunhill Building Contractors Ltd in Nairobi, Kenya."],
  ["1998–2004", "Relationships take root", "A series of residential projects for Jambo Holdings, from Lavington to Lower Kabete and Parklands."],
  ["2009–2011", "Growing industrial expertise", "Sewer infrastructure, godowns and a soap plant for Kapa Oil Refineries feature in our project history."],
  ["Today", "Building on experience", "Building construction, civil engineering, timber joinery and metal fabrication come together under one company."],
];
const leaders = [
  ["Devshi A. Patel", "Chairman"], ["Kunverji A. Kerai", "Managing Director"],
  ["Paresh D. Patel", "Finance Director"], ["Hitesh D. Kerai", "Civil & Construction Engineer"],
  ["Ghansyam K. Varsani", "General Manager"],
];

export default function About() {
  return <>
    <Link className="skip-link" href="#main">Skip to content</Link>
    <SiteHeader onAbout />
    <main id="main" className={styles.page}>
      <section className={`wrap ${styles.hero}`} aria-labelledby="about-title">
        <p className="eyebrow">About Dunhill / Our story</p>
        <div className={styles.heroHeading}><h1 id="about-title">Built on experience.<br /><em>Defined by people.</em></h1><p>Since 1983, our story has been about more than construction. It is about the people, principles and relationships behind every project.</p></div>
        <div className={styles.heroMedia}><Image src="/images/profile/industrial-02.jpeg" alt="Structural steelwork and access stairs during construction" fill preload sizes="(max-width: 800px) 100vw, 90vw" /><div className={styles.year}><strong>1983</strong><span>WHERE OUR STORY BEGINS</span></div><span className={styles.imageNote}>DUNHILL BUILDING CONTRACTORS LTD · KENYA</span></div>
      </section>

      <section className="wrap section" aria-labelledby="intro-title">
        <div className="section-label"><span>01 / THE COMPANY</span><span>NAIROBI, KENYA</span></div>
        <div className={styles.split}><h2 id="intro-title">Good foundations.<br /><em>Lasting ambition.</em></h2><div className={styles.prose}><p className={styles.lead}>We are Dunhill Building Contractors Ltd, a Kenyan building and civil engineering company with more than four decades of operating history.</p><p>Operating since 1983 and incorporated in 1997, we bring construction expertise to homes, workplaces, industrial facilities and infrastructure. Our work connects on-site delivery with the specialist capabilities of our timber joinery and metal fabrication workshops.</p><p>From our base in Nairobi, we work with clients, architects and consulting engineers to turn plans into places, with care for workmanship and the relationships that make each project possible.</p><Link className="text-link" href="/services">Explore our capabilities <span aria-hidden="true">↗</span></Link></div></div>
      </section>

      <section className={`wrap section ${styles.history}`} aria-labelledby="history-title">
        <div className="section-label"><span>02 / OUR JOURNEY</span><span>1983 — TODAY</span></div>
        <div className={styles.split}><div><h2 id="history-title">Four decades.<br /><em>One continuing story.</em></h2><p className={styles.aside}>A few milestones from the company and project history that shaped Dunhill.</p></div><ol className={styles.timeline}>{milestones.map(([year, title, copy]) => <li key={year}><span>{year}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div>
      </section>

      <section className={styles.purpose} aria-labelledby="purpose-title"><div className="wrap"><div className="section-label"><span>03 / OUR PURPOSE</span><span>THE DIRECTION WE SHARE</span></div><h2 id="purpose-title">Ambition with <em>purpose.</em></h2><div className={styles.purposeGrid}><article><span className="eyebrow">Our mission</span><p>To exceed our customers’ expectations through quality work, timely service and delivery within budget.</p></article><article><span className="eyebrow">Our vision</span><p>To be a reputable leader in the building and construction industry in Africa.</p></article></div></div></section>

      <section className="wrap section" aria-labelledby="values-title"><div className="section-label"><span>04 / OUR VALUES</span><span>HOW WE WORK</span></div><h2 id="values-title">The principles<br /><em>behind the work.</em></h2><div className={styles.values}>{[["Trust", "We build trust through our relationships with clients, creating the basis for clear communication and smooth collaboration."], ["Integrity", "We believe integrity underpins safe, environmentally responsible buildings and the way we conduct our work."], ["Collaboration", "We involve our clients throughout the process, listening closely to understand their needs and deliver their vision."]].map(([title, copy], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className={styles.team} aria-labelledby="team-title"><div className="wrap"><div className="section-label"><span>05 / OUR PEOPLE</span><span>LEADERSHIP & EXPERTISE</span></div><div className={styles.split}><div><h2 id="team-title">People behind<br /><em>the progress.</em></h2><p className={styles.aside}>Leadership across construction, engineering, operations and finance, supported by the people who bring each project to life.</p></div><div className={styles.leaders}>{leaders.map(([name, role], i) => <article key={name}><span>0{i + 1}</span><div><h3>{name}</h3><p>{role}</p></div></article>)}<p className={styles.note}>Leadership roles as listed in the 2026 company profile.</p></div></div></div></section>

      <section className="wrap section" aria-labelledby="relationships-title"><div className="section-label"><span>06 / ENDURING RELATIONSHIPS</span><span>BETTER, TOGETHER</span></div><div className={styles.split}><h2 id="relationships-title">Construction is<br /><em>a shared effort.</em></h2><p className={styles.lead}>Our portfolio records repeat engagements with clients and collaboration with architects and consulting engineers. Those relationships are an important part of our story.</p></div><div className={styles.partners}><div><h3>Long-term clients</h3><ul><li>Jambo Holdings Ltd</li><li>Kapa Oil Refineries Ltd</li><li>Amber Properties Ltd</li></ul></div><div><h3>Architects & consulting engineers</h3><ul><li>FNDA Architects</li><li>Steel Graphics Associates</li><li>JAP International Ltd</li><li>Midrock Consulting Engineers</li></ul></div></div><Link className="text-link" href="/projects">Discover the work behind the relationships <span aria-hidden="true">↗</span></Link></section>

      <section className={`wrap ${styles.contact}`} id="contact"><p className="eyebrow">The next chapter starts with a conversation</p><div><h2>Let’s build<br /><em>what comes next.</em></h2><Link className="button" href="mailto:info@dunhillbcon.com?subject=New%20project%20enquiry">Start a project <span aria-hidden="true">↗</span></Link></div><Link className="text-link" href="mailto:info@dunhillbcon.com">info@dunhillbcon.com <span aria-hidden="true">↗</span></Link></section>
    </main>
    <footer className="footer"><div className="wrap footer-main"><div><Link href="/" aria-label="Dunhill home"><Brand /></Link><p>Building excellence.<br />Creating landmarks.</p></div><nav aria-label="Footer navigation">{navigation.map(([label, id]) => <Link key={id} href={navigationHref(id, true)}>{label}</Link>)}<Link href="/contact">Contact</Link></nav><address><span className="eyebrow">Find us</span>Crescent Pearl, 2nd Floor<br />06 The Crescent, Westlands<br />Nairobi, Kenya</address></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Dunhill Building Contractors Ltd</span><Link href="#main">Back to top ↑</Link></div></footer>
  </>;
}
