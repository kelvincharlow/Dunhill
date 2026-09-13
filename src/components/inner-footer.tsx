import Link from "next/link";
import { Brand } from "./site-header";
import { navigation, navigationHref } from "@/lib/navigation";
export function InnerFooter() {
  return <footer className="footer"><div className="wrap footer-main"><div><Link href="/" aria-label="Dunhill home"><Brand /></Link><p>Building excellence.<br />Creating landmarks.</p></div><nav aria-label="Footer navigation">{navigation.map(([label,id])=><Link key={id} href={navigationHref(id,true)}>{label}</Link>)}<Link href="/contact">Contact</Link></nav><address><span className="eyebrow">Find us</span>Crescent Pearl, 2nd Floor<br />06 The Crescent, Westlands<br />Nairobi, Kenya</address></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Dunhill Building Contractors Ltd</span><a href="#main">Back to top ↑</a></div></footer>;
}
