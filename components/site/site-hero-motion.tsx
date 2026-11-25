"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const patientTotal = 500;
const poster = "/hero/hero-trip-poster.webp";

export function useHeroMotion() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const sync = () => setAllowed(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  return allowed;
}

export function HeroMedia() {
  const motion = useHeroMotion();

  return (
    <div className="site-hero-media" aria-hidden="true">
      <Image src={poster} alt="" fill sizes="100vw" priority unoptimized />
      {motion ? (
        <video
          src="/hero/hero-trip.mp4"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
        />
      ) : null}
    </div>
  );
}

export function HeroPatientCount() {
  const motion = useHeroMotion();
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = count.current;
    if (!motion || !node) return;

    let startedAt: number | undefined;
    let frame = 0;
    node.textContent = "0";

    const tick = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / 1800);
      const eased = 1 - (1 - progress) ** 3;
      node.textContent = String(Math.round(patientTotal * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const delay = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, 500);

    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(frame);
      node.textContent = String(patientTotal);
    };
  }, [motion]);

  return (
    <>
      <span className="sr-only">{patientTotal}+</span>
      <span ref={count} aria-hidden="true">{patientTotal}</span>
      <sup aria-hidden="true">+</sup>
    </>
  );
}
