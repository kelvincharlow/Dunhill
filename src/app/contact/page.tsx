import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { InnerFooter } from "@/components/inner-footer";
import { credentialRequestDescription } from "@/lib/credentials";
import { serviceInterests } from "@/lib/enquiry";
import { EnquiryForm } from "@/components/enquiry-form";
import styles from "./contact.module.css";
export const metadata:Metadata={title:"Contact | Dunhill Building Contractors",description:"Contact Dunhill’s Westlands office or tell us about your construction project, service requirements or general enquiry."};
export const dynamic="force-dynamic";
const mapUrl="https://www.google.com/maps/search/?api=1&query=Crescent+Pearl+06+The+Crescent+Westlands+Nairobi";
export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string | string[]; documents?: string | string[] }> }) {
  const { service, documents } = await searchParams;
  const initialService = typeof service === "string" && serviceInterests.includes(service) ? service : "";
  const initialDescription = initialService === "Compliance documents" ? credentialRequestDescription(documents) : "";
  const deliveryEnabled=Boolean(process.env.ENQUIRY_WEBHOOK_URL?.startsWith("https://") && process.env.ENQUIRY_WEBHOOK_TOKEN);
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader onContact /><main id="main" tabIndex={-1}>
    <section className={`wrap ${styles.hero}`} aria-labelledby="contact-title"><p className="eyebrow">DUNHILL / CONTACT</p><div className={styles.heading}><h1 id="contact-title">Let’s <em>talk.</em></h1><p>A project, a question, or a request for documents.<br />Tell us how we can help.</p></div><nav className={styles.quickLinks} aria-label="Contact options"><a href="tel:+254717229495">Call our office <span aria-hidden="true">↗</span></a><a href="mailto:info@dunhillbcon.com">Email the team <span aria-hidden="true">↗</span></a><a href="#office">Find our office <span aria-hidden="true">↓</span></a></nav></section>
    <div className={`wrap ${styles.contactLayout}`}>
      <section className={styles.enquiry} id="enquiry" aria-labelledby="enquiry-title"><div className={styles.formHeading}><h2 id="enquiry-title">Your enquiry</h2><p>Start with the essentials. You can add project details if you have them.</p></div><EnquiryForm deliveryEnabled={deliveryEnabled} initialService={initialService} initialDescription={initialDescription} /></section>
      <aside className={styles.contactDetails} aria-label="Contact and office details">
        <section className={styles.direct} aria-labelledby="direct-title"><p className="eyebrow">PREFER A CONVERSATION?</p><h2 id="direct-title">We’re here to help.</h2><div><span>CALL</span><a href="tel:+254717229495">+254 717 229 495 <span aria-hidden="true">↗</span></a><a className={styles.alternative} href="tel:+254722513547">+254 722 513 547 <span aria-hidden="true">↗</span></a></div><div><span>EMAIL</span><a href="mailto:info@dunhillbcon.com">info@dunhillbcon.com <span aria-hidden="true">↗</span></a></div></section>
        <section className={styles.office} id="office" aria-labelledby="office-title"><div className={styles.officePhoto}><Image src="/images/profile/crescent-pearl-b.jpeg" alt="Crescent Pearl, the building housing Dunhill’s Westlands office" fill sizes="(max-width: 800px) calc(100vw - 44px), 33vw" /></div><div className={styles.officeCopy}><p className="eyebrow">VISIT DUNHILL</p><h2 id="office-title">Westlands, Nairobi</h2><address>Crescent Pearl, 2nd Floor<br />06 The Crescent<br />Nairobi, Kenya</address><a className="text-link" href={mapUrl} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a><p>Please call ahead to arrange a visit.</p></div></section>
      </aside>
    </div>
    <div className={`wrap ${styles.backToForm}`} id="contact"><p>Have the details ready?</p><a className="text-link" href="#enquiry">Back to your enquiry <span aria-hidden="true">↑</span></a></div>
  </main><InnerFooter /></>;
}
