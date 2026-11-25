"use client";

import { HeartPulse, House, Plane, Stethoscope } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { HeroJourneyCopy } from "./site-hero-copy";
import { useHeroMotion } from "./site-hero-motion";

const icons = [
  { Icon: Plane, name: "plane" },
  { Icon: House, name: "house" },
  { Icon: HeartPulse, name: "pulse" },
  { Icon: Stethoscope, name: "specialist" },
];

export function HeroJourney({ copy }: { copy: HeroJourneyCopy }) {
  const section = useRef<HTMLElement>(null);
  const motion = useHeroMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const stepCount = copy.steps.length;

  useEffect(() => {
    if (!motion || !section.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setRevealed(true);
    }, { threshold: 0.25 });

    observer.observe(section.current);
    return () => observer.disconnect();
  }, [motion]);

  useEffect(() => {
    if (!motion || !inView || hovered || keyboardFocus) return;

    const cycle = window.setInterval(() => {
      if (!document.hidden) setActive((step) => (step + 1) % stepCount);
    }, 2600);

    return () => window.clearInterval(cycle);
  }, [motion, inView, hovered, keyboardFocus, stepCount]);

  return (
    <section
      ref={section}
      className="site-journey"
      aria-labelledby="viaje-titulo"
      data-reveal={motion ? (revealed ? "visible" : "pending") : undefined}
      onPointerEnter={(event) => setHovered(event.pointerType !== "touch")}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => setKeyboardFocus(event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
      }}
    >
      <div className="site-journey-heading">
        <h2 id="viaje-titulo">{copy.label}</h2>
        <p>{copy.title}</p>
      </div>
      <div className="site-journey-track">
        <span className="site-journey-line" aria-hidden="true" />
        <ol className="site-journey-steps">
          {copy.steps.map((step, index) => {
            const { Icon, name } = icons[index];

            return (
              <li key={name} style={{ "--journey-index": index } as CSSProperties}>
                <button
                  className="site-journey-step"
                  type="button"
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") setActive(index);
                  }}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) setActive(index);
                  }}
                >
                  <span className={`site-journey-medallion site-journey-medallion-${name}`} aria-hidden="true">
                    <Icon size={34} strokeWidth={1.35} />
                  </span>
                  <span className="site-journey-copy">
                    <span className="site-journey-label">
                      {String(index + 1).padStart(2, "0")} · {step.label}
                    </span>
                    <span className="site-journey-title">{step.title}</span>
                    <span className="site-journey-description">{step.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
