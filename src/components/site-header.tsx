"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { navigation, navigationHref } from "@/lib/navigation";

export function Brand() {
  return <span className="brand"><svg viewBox="0 0 36 40" aria-hidden="true"><path d="M3 37V3h15c10 0 15 7 15 17s-5 17-15 17H3Zm8-8h7c5 0 7-4 7-9s-2-9-7-9h-7v18Z" fill="currentColor"/><path d="M3 37 25 11" stroke="var(--paper)" strokeWidth="2"/></svg><span><strong>DUNHILL</strong><small>BUILDING CONTRACTORS</small></span></span>;
}

export function SiteHeader({ onAbout = false, onServices = false, onProjects = false, onPlant = false, onCompliance = false, onContact = false }: { onAbout?: boolean; onServices?: boolean; onProjects?: boolean; onPlant?: boolean; onCompliance?: boolean; onContact?: boolean }) {
  const innerPage = onAbout || onServices || onProjects || onPlant || onCompliance || onContact;
  const pageId = onContact ? "contact" : onCompliance ? "compliance" : onPlant ? "plant-workshops" : onProjects ? "projects" : onServices ? "services" : "about";
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const media = matchMedia("(min-width: 1200px)");
    const close = () => { if (media.matches) dialog.current?.close(); };
    media.addEventListener("change", close);
    return () => { media.removeEventListener("change", close); };
  }, []);
  const close = () => dialog.current?.close();
  return <header className="site-header">
    <div className="header-inner wrap">
      <Link href={navigationHref("home", innerPage)} aria-label="Dunhill home"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, id]) =>
        <Link key={id} href={navigationHref(id, innerPage)} aria-current={id === (innerPage ? pageId : "home") ? "page" : undefined}>{label}</Link>
      )}</nav>
      <Link href={onContact ? "#enquiry" : "/contact"} className="header-cta" aria-current={onContact ? "page" : undefined}><span className="header-cta-label">Start a project</span><span className="header-cta-short">Contact</span><span className="header-cta-arrow" aria-hidden="true">↗</span></Link>
      <button type="button" className="menu-button" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><span /><span /></button>
    </div>
    <dialog ref={dialog} className="mobile-menu" aria-label="Main navigation">
      <div className="menu-top"><Brand /><button className="close-button" onClick={close} aria-label="Close navigation">×</button></div>
      <p className="eyebrow">Explore Dunhill</p>
      <nav>{navigation.map(([label, id], index) => <Link key={id} href={navigationHref(id, innerPage)} aria-current={id === (innerPage ? pageId : "home") ? "page" : undefined} onClick={close}><small>0{index + 1}</small>{label}<span aria-hidden="true">↗</span></Link>)}</nav>
      <Link className="button" href={onContact ? "#enquiry" : "/contact"} aria-current={onContact ? "page" : undefined} onClick={close}>{onContact ? "Go to your enquiry" : "Start a project"} <span aria-hidden="true">↗</span></Link>
      <p className="menu-location">Westlands, Nairobi · Building Kenya since 1983</p>
    </dialog>
  </header>;
}
