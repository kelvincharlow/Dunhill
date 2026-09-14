"use client";

import { ArrowIcon } from "@/components/arrow-icon";


import { useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

import { navigation, navigationHref } from "@/lib/navigation";

export function Brand() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true"><Image src="/images/brand/dunhill-logo.png" alt="" width={2170} height={725} sizes="190px" /></span><span><strong>DUNHILL</strong><small>BUILDING CONTRACTORS</small></span></span>;
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
      <div className="header-actions">
      <Link href={onContact ? "#enquiry" : "/contact"} className="header-cta" aria-current={onContact ? "page" : undefined}><span className="header-cta-label">Contact us</span><span className="header-cta-short">Contact</span><span className="header-cta-arrow" aria-hidden="true"><ArrowIcon /></span></Link>
      <ThemeToggle />
      <button type="button" className="menu-button" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><span /><span /></button>
      </div>
    </div>
    <dialog ref={dialog} className="mobile-menu" aria-label="Main navigation">
      <div className="menu-top"><Brand /><button className="close-button" onClick={close} aria-label="Close navigation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
      <p className="eyebrow">Explore Dunhill</p>
      <nav>{navigation.map(([label, id], index) => <Link key={id} href={navigationHref(id, innerPage)} aria-current={id === (innerPage ? pageId : "home") ? "page" : undefined} onClick={close}><small>0{index + 1}</small>{label}<span aria-hidden="true"><ArrowIcon /></span></Link>)}</nav>
      <Link className="button" href={onContact ? "#enquiry" : "/contact"} aria-current={onContact ? "page" : undefined} onClick={close}>{onContact ? "Go to your enquiry" : "Contact us"} <span aria-hidden="true"><ArrowIcon /></span></Link>
      <p className="menu-location">Westlands, Nairobi · Building Kenya since 1983</p>
    </dialog>
  </header>;
}
