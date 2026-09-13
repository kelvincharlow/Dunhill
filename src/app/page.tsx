import Link from "next/link";
import Image from "next/image";
import { Brand, SiteHeader } from "@/components/site-header";
import { navigation, navigationHref } from "@/lib/navigation";
import { ProjectShowcase } from "@/components/project-showcase";
import heroStyles from "./hero.module.css";

const services = [
  ["Building construction", "Homes, workplaces and destinations.", "Residential apartments, villas, office blocks, commercial buildings and hospitality developments.", "01"],
  ["Civil & industrial works", "The foundations of everyday progress.", "Road works, drainage, culverts, sewer infrastructure, warehouses, industrial plants and associated structures.", "02"],
  ["Renovation & refurbishment", "New possibilities for existing places.", "Alterations, additions and upgrades to existing buildings, including residential, commercial and institutional premises.", "03"],
  ["Joinery & fabrication", "Craftsmanship in every finishing detail.", "Timber doors, window frames, cabinets and handrails, alongside metal doors, grills and structural steel fabrication.", "04"],
];

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <section className={heroStyles.hero} id="home" aria-labelledby="hero-title">
        <div className={heroStyles.heading}>
          <div className={heroStyles.title}>
          <p className="eyebrow"><span className="status-dot" />Building Kenya since 1983</p>
          <h1 id="hero-title">Building excellence.</h1>
          <p className={heroStyles.tagline}>Creating landmarks.</p>
          </div>
          <div className={heroStyles.introduction}>
            <p>Construction and civil engineering.<br />Four decades of building Kenya.</p>
            <a className="button" href="#projects">Explore our work <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <figure className={heroStyles.visual}>
          <Image src="/images/profile/crescent-pearl-b.jpeg" alt="Crescent Pearl rising above the trees in Westlands, Nairobi" fill preload sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1472px) calc(100vw - 112px), 1360px" />
          <span className={heroStyles.edition}>SELECTED WORK / 01</span>
          <figcaption className={heroStyles.caption}>
            <div><span>RESIDENTIAL / 2025</span><strong>Crescent Pearl</strong></div>
            <p>Westlands, Nairobi</p>
            <a href="#projects" aria-label="Explore Crescent Pearl">Explore project <span aria-hidden="true">↗</span></a>
          </figcaption>
        </figure>
      </section>

      <section className="credentials wrap" aria-label="Experience and credentials">
        <div className="credentials-caption"><span className="eyebrow">A foundation of trust</span><p>Experience you can build on.</p></div>
        <div><strong>1983<span>Est.</span></strong><p>Our operating history</p></div>
        <div><strong>NCA 1</strong><p>Building works*</p></div>
        <div><strong>40<span>+ years</span></strong><p>Construction experience</p></div>
      </section>

      <section className="company section wrap" id="company">
        <div className="section-label"><span>01 / WHO WE ARE</span><span aria-hidden="true">+</span></div>
        <div className="company-layout">
          <div className="company-photo"><Image src="/images/profile/industrial-02.jpeg" alt="Structural steelwork and stairs during construction" fill sizes="(max-width: 800px) 85vw, 30vw" /><span>PRECISION, FROM THE GROUND UP.</span></div>
          <div className="company-copy"><p className="eyebrow">Dunhill Building Contractors</p><h2>Good buildings begin<br />with <em>good foundations.</em></h2><p className="lead">Ours are experience, integrity and a commitment to the people we build for.</p><p>Operating since 1983 and incorporated in 1997, Dunhill brings together building construction, civil engineering and specialist fabrication. Our portfolio spans homes, workplaces, industrial facilities and infrastructure across Kenya.</p><div className="values"><span>Trust</span><span>Integrity</span><span>Collaboration</span></div><a className="text-link" href="#capabilities">See what we bring to a project <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <section className="projects section" id="projects">
        <div className="wrap"><div className="section-label"><span>02 / SELECTED WORK</span><span>BUILT ON EXPERIENCE</span></div><div className="section-heading"><h2>The work<br /><em>speaks for itself.</em></h2><p>A selection of places we help bring to life.<br />Explore the projects behind our experience.</p></div><ProjectShowcase /></div>
      </section>

      <section className="capabilities section wrap" id="capabilities">
        <div className="section-label"><span>03 / OUR CAPABILITIES</span><span aria-hidden="true">+</span></div>
        <div className="capability-layout"><div><h2>Big-picture thinking.<br /><em>Detail-level care.</em></h2><p>Connected expertise across construction, engineering and the finishing trades.</p><a className="button" href="#contact">Find the right expertise <span aria-hidden="true">↗</span></a></div><div className="services">{services.map(([title, subtitle, description, number]) => <details key={number} name="capabilities"><summary><small>{number}</small><span><strong>{title}</strong><span>{subtitle}</span></span><i aria-hidden="true">+</i></summary><div className="service-detail"><p>{description}</p><a href="#contact">Discuss your requirements <span aria-hidden="true">↗</span></a></div></details>)}</div></div>
      </section>

      <section className="relationships wrap" aria-labelledby="relationships-title">
        <p className="eyebrow">Relationships that endure</p><h2 id="relationships-title">Built together. <em>Time and again.</em></h2><p>Selected clients with repeat engagements across our portfolio.</p><div className="client-names"><span>JAMBO <small>HOLDINGS</small></span><span>Amber<small>PROPERTIES</small></span><span>ACTA<small>HOLDINGS</small></span><span>KAPA<small>OIL REFINERIES</small></span><span>Willow<small>PROPERTIES</small></span></div>
      </section>

      <section className="plant" id="plant-workshops">
        <div className="plant-photo"><Image src="/images/profile/industrial-01.jpeg" alt="Dunhill steel erection work with lifting equipment" fill sizes="(max-width: 800px) 100vw, 53vw" /><span>ON SITE. HANDS ON.</span></div>
        <div className="plant-copy"><p className="eyebrow">04 / Plant & workshops</p><h2>Our capability<br />goes <em>deeper.</em></h2><p>The right resources make a difference. Our plant, timber joinery and metal fabrication facilities support the work from construction through to finishing.</p><div className="resource-list"><span><b>01</b> Plant & machinery</span><span><b>02</b> Timber joinery</span><span><b>03</b> Metal & structural fabrication</span></div><a className="text-link" href="#contact">Talk to us about your project <span aria-hidden="true">↗</span></a></div>
      </section>

      <section className="compliance section wrap" id="compliance">
        <div><p className="eyebrow">05 / Professional credentials</p><h2>Confidence,<br /><em>built in.</em></h2><p>Registration and company documentation are included in our company profile. Contact our team for current copies.</p><a className="text-link" href="mailto:info@dunhillbcon.com?subject=Request%20for%20current%20company%20credentials">Request credentials <span aria-hidden="true">↗</span></a></div>
        <div className="compliance-cards"><article><span className="credential-icon" aria-hidden="true">↗</span><h3>Contractor registration</h3><p>NCA building and road works documentation.</p></article><article><span className="credential-icon" aria-hidden="true">✓</span><h3>Company documentation</h3><p>Incorporation, business licensing and tax compliance records.</p></article><small>*NCA category as stated in the company profile. Request current practising licences from our team.</small></div>
      </section>

      <section className="contact wrap" id="contact">
        <div className="contact-top"><p className="eyebrow">Your ambition. Our commitment.</p><span>LET’S BUILD WHAT’S NEXT.</span></div>
        <a className="contact-title" href="mailto:info@dunhillbcon.com?subject=New%20project%20enquiry"><h2>Have a project<br /><em>in mind?</em></h2><span className="contact-arrow" aria-hidden="true">↗</span></a>
        <div className="contact-bottom"><p>Tell us about your plans.<br />A great project starts with a conversation.</p><a href="mailto:info@dunhillbcon.com">info@dunhillbcon.com <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>
    <footer className="footer"><div className="wrap footer-main"><div><a href="#home" aria-label="Dunhill home"><Brand /></a><p>Building excellence.<br />Creating landmarks.</p></div><nav aria-label="Footer navigation">{navigation.map(([label, id]) => <a key={id} href={navigationHref(id)}>{label}</a>)}<Link href="/contact">Contact</Link></nav><address><span className="eyebrow">Find us</span>Crescent Pearl, 2nd Floor<br />06 The Crescent, Westlands<br />Nairobi, Kenya<a href="https://www.google.com/maps/search/?api=1&query=Crescent+Pearl+Westlands+Nairobi" target="_blank" rel="noopener noreferrer">Get directions ↗</a></address></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Dunhill Building Contractors Ltd</span><a href="#home">Back to top ↑</a></div></footer>
  </>;
}
