import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import styles from "./plant.module.css";

export const metadata: Metadata = { title: "Plant & Workshops | Dunhill Building Contractors", description: "Explore Dunhill’s construction equipment, transport, site resources, timber joinery and metal fabrication workshops." };
const equipment = [
  ["Earthmoving", "Excavators, wheel loaders and earthmoving machinery."],
  ["Transport", "Lorries, tippers, Canter trucks and pickups."],
  ["Concrete works", "Mixers, vibrators, pokers and dumpers."],
  ["Compaction", "Rollers and compactor plates."],
  ["Lifting", "Hoists and cranes for construction work."],
  ["Site support", "Generators, pumps, formwork, steel plates and jacks."],
];
const enquiry = (service: string) => `/contact?service=${encodeURIComponent(service)}#enquiry`;

function WorkshopDrawing({ metal = false }: { metal?: boolean }) {
  return <svg viewBox="0 0 400 180" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    {metal ? <><path d="M60 155V55l140-35 140 35v100M60 55h280M110 155V55m180 100V55M60 155l50-100m0 100L60 55m230 100 50-100m0 100-50-100M110 155h180M110 105h180M150 55l50-35 50 35M60 155h280" /><path d="M40 165h320M200 20v135" strokeDasharray="4 6" opacity=".45" /></> : <><path d="M116 160V20h168v140M126 160V30h148v130M142 46h116v43H142zM142 105h116v39H142zM241 96h16M109 160h182" /><path d="M76 20v140m-6-140h12m-12 140h12M116 8h168m-168-5v10m168-10v10M304 30v130" strokeDasharray="4 5" opacity=".5" /></>}
  </svg>;
}

export default function PlantWorkshops() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader onPlant /><main id="main" tabIndex={-1}>
    <section className={`wrap ${styles.hero}`} aria-labelledby="plant-title"><p className="eyebrow">DUNHILL / PLANT & WORKSHOPS</p><div className={styles.heading}><h1 id="plant-title">The tools.<br /><em>The craft.</em></h1><div><p>Construction plant on site. Timber and metal expertise in the workshop. Connected resources, from preparation to finishing.</p><p className={styles.location}><span aria-hidden="true">↗</span> Workshops in Embakasi, off Mombasa Road.</p></div></div><nav className={styles.jump} aria-label="Explore plant and workshops"><a href="#equipment"><small>01</small>Plant & equipment <span aria-hidden="true">↓</span></a><a href="#joinery-workshop"><small>02</small>Timber joinery <span aria-hidden="true">↓</span></a><a href="#metal-workshop"><small>03</small>Metal fabrication <span aria-hidden="true">↓</span></a></nav></section>

    <section className={`wrap ${styles.equipment}`} id="equipment" aria-labelledby="equipment-title">
      <div className={styles.siteVisual}><figure><Image src="/images/profile/industrial-03.jpeg" alt="Construction plant beside a steel-framed building at a Dunhill site" fill sizes="(max-width: 800px) calc(100vw - 44px), 44vw" /><figcaption>ON SITE / PLANT IN CONTEXT</figcaption></figure><Link className="text-link" href="/projects">See the work it supports <span aria-hidden="true">↗</span></Link></div>
      <div><p className="eyebrow">PLANT & EQUIPMENT</p><h2 id="equipment-title">Ready for<br /><em>the practical details.</em></h2><dl className={styles.inventory}>{equipment.map(([title, items], index) => <div key={title}><dt><small>0{index + 1}</small>{title}</dt><dd>{items}</dd></div>)}</dl><p className={styles.note}>Equipment types follow the 2026 company profile. Confirm specifications, quantities and availability for your project with our team.</p><Link className="text-link" href={enquiry("Plant & workshops")}>Discuss equipment requirements <span aria-hidden="true">↗</span></Link></div>
    </section>

    <section className={styles.workshops} id="workshops" aria-labelledby="workshop-title"><div className="wrap"><div className={styles.workshopHeading}><div><p className="eyebrow">TWO SPECIALIST WORKSHOPS</p><h2 id="workshop-title">Crafted for<br /><em>the finishing detail.</em></h2></div><p>From doors and cabinetry to steel frames, our workshops connect fabrication with the needs of the building.</p></div>
      <div className={styles.workshopGrid}>
        <article id="joinery-workshop" className={styles.timber}><div className={styles.drawing}><span>TIMBER / JOINERY</span><WorkshopDrawing /></div><div className={styles.workshopBody}><h3>Timber joinery</h3><p>Building openings and interior details, made through our timber workshop.</p><ul><li>Window & door frames</li><li>Panel doors & handrails</li><li>Shelves & cabinets</li></ul><Link className="button" href={enquiry("Timber joinery")}>Discuss timber work <span aria-hidden="true">↗</span></Link><Link className="quiet-link" href="/services#joinery">View joinery service <span aria-hidden="true">↗</span></Link></div></article>
        <article id="metal-workshop" className={styles.metal}><div className={styles.drawing}><span>METAL / STRUCTURAL FABRICATION</span><WorkshopDrawing metal /></div><div className={styles.workshopBody}><h3>Metal fabrication</h3><p>Metal components and structural steelwork for construction and finishing.</p><ul><li>Metal windows, grills & doors</li><li>Gratings & frames</li><li>Structural steelwork</li></ul><Link className="button" href={enquiry("Metal & structural fabrication")}>Discuss metal work <span aria-hidden="true">↗</span></Link><Link className="quiet-link" href="/services#fabrication">View fabrication service <span aria-hidden="true">↗</span></Link></div></article>
      </div>
    </div></section>

    <section className={`wrap ${styles.delivery}`} id="delivery" aria-labelledby="delivery-title"><div><p className="eyebrow">LET’S DISCUSS YOUR REQUIREMENTS</p><h2 id="delivery-title">Start with<br /><em>what you need.</em></h2><p>A few practical details help us discuss the right resources for your project.</p></div><ol>{[["The scope", "The work or components you need, with drawings if available."], ["The location", "Your site location, access and any practical constraints."], ["The timing", "Your intended programme and when support is needed."]].map(([title, copy], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>
    <section className={`wrap ${styles.contact}`} id="contact" aria-labelledby="contact-title"><div><h2 id="contact-title">Bring us your plans.</h2><p>Let’s connect the right resources to your project.</p></div><Link className="button" href={enquiry("Plant & workshops")}>Discuss your requirements <span aria-hidden="true">↗</span></Link></section>
  </main><InnerFooter /></>;
}
