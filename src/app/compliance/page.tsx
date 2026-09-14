import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import { CredentialRequest } from "@/components/credential-request";
import styles from "./compliance.module.css";

export const metadata: Metadata = { title: "Compliance | Dunhill Building Contractors", description: "Request Dunhill’s contractor registration, practising licences and company documentation for your project review." };

export default function Compliance() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader onCompliance /><main id="main" tabIndex={-1}>
    <section className={`wrap ${styles.hero}`} aria-labelledby="compliance-title"><p className="eyebrow">DUNHILL / COMPANY CREDENTIALS</p><div className={styles.heading}><h1 id="compliance-title">Confidence starts<br /><em>with clarity.</em></h1><div><p>Reviewing Dunhill for a project or tender? Choose the contractor and company documents you need.</p><a className="text-link" href="#register">Build your document request <span aria-hidden="true"><ArrowIcon direction="down" /></span></a></div></div><div className={styles.availability}><span className={styles.documentMark} aria-hidden="true"><ArrowIcon /></span><div><strong>Request current copies from our team.</strong><p>Certificates and licences are shared directly on request. Request the latest copies for your project or tender review.</p></div></div></section>
    <section className={`wrap ${styles.profile}`} aria-labelledby="profile-title">
      <div className={styles.profileBrand}><Image src="/images/brand/dunhill-logo.png" alt="Dunhill Building Contractors Ltd" width={2170} height={725} sizes="(max-width: 800px) 90vw, 40vw" /></div>
      <div className={styles.profileCopy}><p className="eyebrow">GET TO KNOW DUNHILL</p><h2 id="profile-title">Our company profile.</h2><p>Explore our experience, services, people and project portfolio in one document.</p><a className="button" href="/documents/dunhill-company-profile-2026.pdf" download="Dunhill Company Profile 2026.pdf">Download company profile <span aria-hidden="true"><ArrowIcon direction="down" /></span></a><small>2026 edition · PDF · 8 MB</small></div>
    </section>
    <section className={`wrap ${styles.register}`} id="register" aria-labelledby="register-title"><CredentialRequest /></section>
    <section className={styles.help} aria-labelledby="questions-title"><div className={`wrap ${styles.helpInner}`}><div><p className="eyebrow">BEFORE YOU REQUEST</p><h2 id="questions-title">A few<br /><em>useful details.</em></h2><p>Help our team understand your review and the documents you need.</p></div><div className={styles.faq}><details><summary>What should I include in my request?<span aria-hidden="true">+</span></summary><p>Your organisation, project or tender reference, the documents required and your deadline. You can add these on the contact form before sending your request.</p></details><details><summary>Can I request the full set of documents?<span aria-hidden="true">+</span></summary><p>Yes. Choose “Select all documents” above, then continue to add your contact details and requirements.</p></details><details><summary>Where can I check current licence information?<span aria-hidden="true">+</span></summary><p>Ask our team for current registration and practising licence copies for your review. Categories or dates recorded in a company profile do not confirm current validity.</p></details></div></div></section>
    <section className={`wrap ${styles.contact}`} id="contact"><div><p className="eyebrow">NEED SOMETHING ELSE?</p><h2>Let’s talk through<br /><em>your requirements.</em></h2></div><Link className="button" href="/contact?service=Compliance%20documents#enquiry">Contact our team <span aria-hidden="true"><ArrowIcon /></span></Link></section>
  </main><InnerFooter /></>;
}
