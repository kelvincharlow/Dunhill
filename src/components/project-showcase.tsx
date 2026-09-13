"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const projects = [
  { title: "Crescent Pearl", location: "Westlands, Nairobi", year: "2025", category: "Residential", image: "crescent-pearl-b.jpeg", description: "A residential apartment development on Crescent Road in Westlands. Crescent Pearl is also home to Dunhill’s head office.", credit: "Project photography", client: "Dunhill" },
  { title: "National Park Villas", location: "Mlolongo", year: "2025", category: "Villas", image: "national-park-villas.jpeg", description: "A villa development in Mlolongo, bringing together contemporary residential buildings and Dunhill’s construction experience.", credit: "Project photography", client: "Dunhill" },
  { title: "Nyahururu Housing", location: "Nyahururu", year: "2026", category: "Affordable housing", image: "profile-intro.jpeg", description: "The affordable housing apartment project listed in Dunhill’s 2026 company profile. The profile records a contract sum of KSh 2.3 billion.", credit: "Construction image from the company profile", client: "" },
];

export function ProjectShowcase() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const project = projects[selected];
  return <div className="showcase">
    <div className="project-image">
      <Image key={project.image} src={`/images/profile/${project.image}`} alt={`${project.title}, ${project.location}`} fill sizes="(max-width: 800px) 100vw, 70vw" />
      <span className="project-tag">{project.category}</span>
      <button className="project-open" onClick={() => dialog.current?.showModal()} aria-label={`Read about ${project.title}`}>Explore project <span aria-hidden="true">↗</span></button>
    </div>
    <div className="project-selector" aria-label="Choose a featured project">
      <p className="eyebrow">Selected projects / 01—03</p>
      {projects.map((item, index) => <button key={item.title} aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <span className="project-number">0{index + 1}</span>
        <span><strong>{item.title}</strong><small>{item.location} · {item.year}</small></span>
        <span className="project-arrow" aria-hidden="true">↗</span>
      </button>)}
      <div className="project-note"><span className="tiny-cross" aria-hidden="true">+</span><p>Different scales.<br />The same attention to detail.</p></div>
    </div>
    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title">
      <button className="close-button" aria-label="Close project details" onClick={() => dialog.current?.close()}>×</button>
      <div className="dialog-image"><Image src={`/images/profile/${project.image}`} alt={project.title} fill sizes="(max-width: 800px) 100vw, 850px" /></div>
      <div className="dialog-copy"><p className="eyebrow">{project.category} / {project.year}</p><h2 id="project-title">{project.title}</h2><p>{project.description}</p><dl><div><dt>Location</dt><dd>{project.location}</dd></div>{project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}</dl><small>{project.credit}. Year as listed in the company profile.</small><a className="text-link" href="#contact" onClick={() => dialog.current?.close()}>Discuss a similar project <span aria-hidden="true">↗</span></a></div>
    </dialog>
  </div>;
}
