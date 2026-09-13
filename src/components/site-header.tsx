"use client";

import { useEffect, useRef, useState } from "react";

import { navigation, navigationHref } from "@/lib/navigation";

export function Brand() {
  return <span className="brand"><svg viewBox="0 0 36 40" aria-hidden="true"><path d="M3 37V3h15c10 0 15 7 15 17s-5 17-15 17H3Zm8-8h7c5 0 7-4 7-9s-2-9-7-9h-7v18Z" fill="currentColor"/><path d="M3 37 25 11" stroke="var(--paper)" strokeWidth="2"/></svg><span><strong>DUNHILL</strong><small>BUILDING CONTRACTORS</small></span></span>;
}

export function SiteHeader({ onAbout = false, onServices = false, onProjects = false, onPlant = false, onCompliance = false, onContact = false }: { onAbout?: boolean; onServices?: boolean; onProjects?: boolean; onPlant?: boolean; onCompliance?: boolean; onContact?: boolean }) {
  const innerPage = onAbout || onServices || onProjects || onPlant || onCompliance || onContact;
  const pageId = onContact ? "contact" : onCompliance ? "compliance" : onPlant ? "plant-workshops" : onProjects ? "projects" : onServices ? "services" : "about";
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-15% 0px -65% 0px" });
    navigation.forEach(([, id]) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    const media = matchMedia("(min-width: 1200px)");
    const close = () => { if (media.matches) dialog.current?.close(); };
    media.addEventListener("change", close);
    return () => { observer.disconnect(); media.removeEventListener("change", close); };
  }, []);
  const close = () => dialog.current?.close();
  return <header className="site-header">
    <div className="header-inner">
      <a href={navigationHref("home", innerPage)} aria-label="Dunhill home"><Brand /></a>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, id]) =>
        <a key={id} href={navigationHref(id, innerPage)} aria-current={innerPage ? (id === pageId ? "page" : undefined) : (active === id ? "location" : undefined)}>{label}</a>
      )}</nav>
      <a href={onContact ? "#enquiry" : "/contact"} className="header-cta" aria-current={onContact ? "page" : undefined}>Start a project <span aria-hidden="true">↗</span></a>
      <button type="button" className="menu-button" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><span /><span /></button>
    </div>
    <dialog ref={dialog} className="mobile-menu" aria-label="Main navigation">
      <div className="menu-top"><Brand /><button className="close-button" onClick={close} aria-label="Close navigation">×</button></div>
      <p className="eyebrow">Explore Dunhill</p>
      <nav>{navigation.map(([label, id], index) => <a key={id} href={navigationHref(id, innerPage)} aria-current={innerPage && id === pageId ? "page" : undefined} onClick={close}><small>0{index + 1}</small>{label}<span aria-hidden="true">↗</span></a>)}</nav>
      <a className="button" href={onContact ? "#enquiry" : "/contact"} onClick={close}>Start a project <span aria-hidden="true">↗</span></a>
      <p className="menu-location">Westlands, Nairobi · Building Kenya since 1983</p>
    </dialog>
  </header>;
}
