"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories, projects } from "@/lib/projects";
import styles from "@/app/projects/projects.module.css";
export function ProjectGrid() {
  const [category,setCategory] = useState<string>("All projects");
  const visible = projects.filter(p=>category === "All projects" || p.category === category);
  return <><div className={styles.filters} role="group" aria-label="Filter projects by category">{categories.map(c=><button key={c} type="button" aria-pressed={category===c} aria-controls="project-results" onClick={()=>setCategory(c)}>{c}<span>{c === "All projects" ? projects.length : projects.filter(p=>p.category===c).length}</span></button>)}</div><p className={styles.count} role="status">{visible.length} {visible.length===1 ? "project" : "projects"} · {category}</p><div className={styles.grid} id="project-results">{visible.map(p=><Link className={styles.card} href={`/projects/${p.slug}`} key={p.slug}><div className={styles.cardImage}>{p.image ? <Image src={`/images/profile/${p.image}`} alt={p.title} fill sizes="(max-width: 800px) 90vw, 45vw" /> : <div className={styles.pending}><span>FROM THE PROJECT ARCHIVE</span><strong>{p.title}</strong><small>Project photography pending</small></div>}<span className={styles.arrow} aria-hidden="true">↗</span></div><div className={styles.cardMeta}><span>{p.category}</span><span>{p.year}</span></div><h3>{p.title}</h3><p>{p.location}</p></Link>)}</div></>;
}
