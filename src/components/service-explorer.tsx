"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/services";
import styles from "@/app/services/services.module.css";

export function ServiceExplorer() {
  const container = useRef<HTMLDivElement>(null);

  const reveal = (id: string) => {
    const detail = container.current?.querySelector<HTMLDetailsElement>(`details[id="${id}"]`);
    if (!detail) return;
    detail.open = true;
    requestAnimationFrame(() => detail.scrollIntoView({ block: "start", behavior: "instant" }));
  };

  useEffect(() => {
    const followHash = () => {
      const id = window.location.hash.slice(1);
      if (services.some(service => service.id === id)) reveal(id);
    };
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, []);

  return <div ref={container}>
    <nav className={styles.directory} aria-label="Choose a service">
      {services.map((service, index) => <a key={service.id} href={`#${service.id}`} onClick={() => reveal(service.id)}><small>0{index + 1}</small>{service.short}<span aria-hidden="true">↓</span></a>)}
    </nav>
    <section className={styles.explorer} id="service-directory" aria-labelledby="expertise-title">
      <div className={styles.visual}>
        <div className={styles.photo}><Image src="/images/profile/industrial-05.jpeg" alt="Construction work from Dunhill’s company profile" fill sizes="(max-width: 800px) calc(100vw - 44px), 36vw" /><span>ON SITE. IN THE DETAIL.</span></div>
        <h2 id="expertise-title">The right expertise.<br /><em>For your next step.</em></h2>
        <p>Choose a service to see what’s included and explore our experience.</p>
        <Link className="text-link" href="/projects">See our work <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={styles.services}>
        {services.map((service, index) => <details key={service.id} id={service.id} name="dunhill-services" open={index === 0} className={styles.service}>
          <summary><small>0{index + 1}</small><div><h3>{service.title}</h3><p>{service.intro}</p></div><span className={styles.toggle} aria-hidden="true">+</span></summary>
          <div className={styles.serviceBody}>
            <p className="eyebrow">HOW WE CAN HELP</p>
            <ul>{service.scope.map(item => <li key={item}>{item}</li>)}</ul>
            <div className={styles.evidence}><p>{service.evidence}</p><Link href={service.href}>{service.related} <span aria-hidden="true">↗</span></Link></div>
            <Link className="button" href={`/contact?service=${encodeURIComponent(service.title)}#enquiry`}>Discuss {service.short.toLowerCase()} <span aria-hidden="true">↗</span></Link>
          </div>
        </details>)}
      </div>
    </section>
  </div>;
}
