"use client";

import { useEffect, useState, type RefObject } from "react";

export function useSiteMotion() {
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

export function useSiteReveal(section: RefObject<HTMLElement>, motion: boolean) {
  useEffect(() => {
    const container = section.current;
    if (!motion || !container) return;

    const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-site-reveal=""]'));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio < 0.12) continue;
        (entry.target as HTMLElement).dataset.siteReveal = "visible";
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    elements.forEach((element) => {
      if (element.getBoundingClientRect().top <= window.innerHeight) return;
      element.dataset.siteReveal = "pending";
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      elements.forEach((element) => {
        if (element.dataset.siteReveal === "pending") element.dataset.siteReveal = "";
      });
    };
  }, [section, motion]);
}
