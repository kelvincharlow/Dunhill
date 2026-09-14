"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./arrow-icon";
import type { ProjectPhoto } from "@/lib/projects";
import styles from "@/app/hero.module.css";

export type HeroSlide = { slug: string; title: string; location: string; cover: ProjectPhoto };
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(update: () => void) {
  const media = matchMedia(motionQuery);
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
}

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => matchMedia(motionQuery).matches, () => true);
  const active = index % Math.max(slides.length, 1);
  const current = slides[active];
  const rotating = slides.length > 1 && !paused && !hovered && !hidden && !reducedMotion;

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!rotating) return;
    const timer = setInterval(() => setIndex(value => (value + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [rotating, slides.length]);

  function move(direction: number) {
    setPaused(true);
    setIndex((active + direction + slides.length) % slides.length);
  }

  if (!current) return <div className={styles.visual}><Image src="/images/profile/industrial-01.jpeg" alt="Dunhill construction site" fill preload sizes="100vw" /></div>;

  return <div className={styles.visual} role="region" aria-roledescription="carousel" aria-label="Project photographs"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={event => { if (!event.target.closest("[data-rotation]")) setPaused(true); }}
    onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}
    onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
    onTouchEnd={event => { const start = touchStart.current; touchStart.current = null; if (!start || slides.length < 2) return; const dx = event.changedTouches[0].clientX - start.x; const dy = event.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); }}>
    {slides.map((slide, position) => <div key={slide.slug} className={styles.slide} data-active={position === active} aria-hidden={position !== active}>
      {(position === active || position === (active + 1) % slides.length || position === (active + slides.length - 1) % slides.length) && <Image src={slide.cover.src} alt={slide.cover.alt} style={{ objectPosition: slide.cover.position }} fill sizes="100vw" preload={position === 0} loading={position === 0 ? undefined : "lazy"} />}
    </div>)}
    <div className={styles.caption} aria-live={rotating ? "off" : "polite"} aria-atomic="true">
      <Link href={`/projects/${current.slug}`} aria-label={`View ${current.title} project`}>
        <span className={styles.projectInfo}><small>FROM OUR PORTFOLIO</small><strong>{current.title}</strong><span>{current.location}</span></span>
        <span className={styles.projectArrow} aria-hidden="true"><ArrowIcon /></span>
      </Link>
    </div>
    {slides.length > 1 && <div className={styles.slideControls}>
      <button type="button" aria-label="Previous project photograph" onClick={() => move(-1)}><ArrowIcon direction="left" /></button>
      <span className={styles.slideCount} aria-label={`Photograph ${active + 1} of ${slides.length}`}>{String(active + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {String(slides.length).padStart(2, "0")}</span>
      <button type="button" aria-label="Next project photograph" onClick={() => move(1)}><ArrowIcon direction="right" /></button>
      {!reducedMotion && <button type="button" className={styles.playPause} data-rotation aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(value => !value)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paused ? <path d="m9 5 10 7-10 7Z" /> : <path d="M8 5v14M16 5v14" />}</svg>
      </button>}
    </div>}
  </div>;
}
