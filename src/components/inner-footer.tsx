import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { Brand } from "./site-header";
import { navigation, navigationHref } from "@/lib/navigation";

export function InnerFooter() {
  return <footer className="footer">
    <div className="wrap footer-main">
      <div className="footer-brand"><Link href="/" aria-label="Dunhill home"><Brand /></Link><p>Building excellence.<br />Creating landmarks.</p><span className="footer-since">Building Kenya since 1983</span></div>
      <div className="footer-explore"><h2 className="eyebrow">Explore</h2><nav aria-label="Footer navigation">{navigation.map(([label, id]) => <Link key={id} href={navigationHref(id, true)}>{label}</Link>)}<Link href="/contact">Contact</Link></nav></div>
      <div className="footer-contact"><h2 className="eyebrow">Talk to us</h2><a href="tel:+254717229495">+254 717 229 495</a><a href="tel:+254722513547">+254 722 513 547</a><a href="mailto:info@dunhillbcon.com">info@dunhillbcon.com</a><Link className="footer-enquiry" href="/contact#enquiry">Contact us <span aria-hidden="true"><ArrowIcon /></span></Link></div>
      <div className="footer-visit"><h2 className="eyebrow">Visit our office</h2><address>Crescent Pearl, 2nd Floor<br />06 The Crescent, Westlands<br />Nairobi, Kenya</address><a className="footer-directions" href="https://www.google.com/maps/search/?api=1&query=Crescent+Pearl+06+The+Crescent+Westlands+Nairobi" target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true"><ArrowIcon /></span></a><p>Please call ahead to arrange a visit.</p></div>
    </div>
    <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Dunhill Building Contractors Ltd</span><a href="#main">Back to top <span aria-hidden="true"><ArrowIcon direction="up" /></span></a></div>
  </footer>;
}
