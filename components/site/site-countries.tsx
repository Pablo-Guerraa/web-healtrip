"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SiteLocale } from "@/lib/site";
import { useSiteMotion, useSiteReveal } from "./use-site-motion";

const countries = [
  { code: "us", es: "Estados Unidos", en: "United States" },
  { code: "aw", es: "Aruba", en: "Aruba" },
  { code: "cw", es: "Curaçao", en: "Curaçao" },
  { code: "bq", es: "Bonaire", en: "Bonaire" },
  { code: "sx", es: "San Martín", en: "Sint Maarten" },
  { code: "ag", es: "Antigua y Barbuda", en: "Antigua and Barbuda" },
  { code: "tt", es: "Trinidad y Tobago", en: "Trinidad and Tobago" },
  { code: "cl", es: "Chile", en: "Chile" },
  { code: "br", es: "Brasil", en: "Brazil" },
  { code: "nl", es: "Holanda", en: "Netherlands" },
];

const countryCopy = {
  es: {
    label: "Pacientes de 10 países",
    title: "Pacientes internacionales",
    emphasis: "confían en Healtrip",
    caption: "Del Caribe, América y Europa · a Medellín, Colombia",
    strip: "Países de origen de nuestros pacientes",
    pause: "Pausar carrusel de países",
    resume: "Reanudar carrusel de países",
  },
  en: {
    label: "Patients from 10 countries",
    title: "International patients",
    emphasis: "trust Healtrip",
    caption: "From the Caribbean, the Americas and Europe · to Medellín, Colombia",
    strip: "Where our patients come from",
    pause: "Pause country carousel",
    resume: "Resume country carousel",
  },
};

export function SiteCountries({ locale }: { locale: SiteLocale }) {
  const copy = countryCopy[locale];
  const motion = useSiteMotion();
  const [paused, setPaused] = useState(false);
  const section = useRef<HTMLElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useSiteReveal(section, motion);

  useEffect(() => {
    const viewport = band.current;
    const rail = track.current;
    if (!motion || !viewport || !rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>(".site-country"));
    let frame = 0;
    let delay: number | undefined;
    let started = false;
    let hovered = false;
    let previous = 0;
    let offset = 0;
    let stride = 0;
    let halfCard = 0;
    let midpoint = 0;
    let speed = 48;

    const paint = () => {
      const x = midpoint - stride * countries.length - halfCard - offset;
      rail.style.transform = `translate3d(${x}px, 0, 0)`;

      cards.forEach((card, index) => {
        const distance = Math.abs(x + halfCard + stride * index - midpoint);
        const near = 1 - Math.min(1, distance / (midpoint * 0.62));
        const focus = near * near * (3 - 2 * near);
        const value = focus.toFixed(3);
        if (card.style.getPropertyValue("--country-focus") !== value) {
          card.style.setProperty("--country-focus", value);
          card.toggleAttribute("data-centered", focus > 0.86);
        }
      });
    };

    const measure = () => {
      midpoint = viewport.clientWidth / 2;
      halfCard = cards[0].offsetWidth / 2;
      stride = cards[1].offsetLeft - cards[0].offsetLeft;
      if (midpoint > 0 && stride > 0) {
        offset %= stride * countries.length;
        paint();
      }
    };

    const tick = (now: number) => {
      const elapsed = previous ? Math.min(0.05, (now - previous) / 1000) : 0;
      previous = now;
      if (started && stride > 0 && viewport.dataset.paused !== "true") {
        const target = hovered ? 8 : 48;
        speed += (target - speed) * Math.min(1, elapsed * 4);
        offset = (offset + speed * elapsed) % (stride * countries.length);
        paint();
      }
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.6 && !started && delay === undefined) {
        delay = window.setTimeout(() => {
          started = true;
        }, 1200);
      }
      if (entry.isIntersecting && !frame) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        cancelAnimationFrame(frame);
        frame = 0;
        if (!started) {
          window.clearTimeout(delay);
          delay = undefined;
        }
      }
    }, { threshold: [0, 0.6] });

    const pointerEnter = (event: PointerEvent) => { hovered = event.pointerType !== "touch"; };
    const pointerLeave = () => { hovered = false; };
    const resize = new ResizeObserver(measure);
    measure();
    observer.observe(viewport);
    resize.observe(viewport);
    viewport.addEventListener("pointerenter", pointerEnter);
    viewport.addEventListener("pointerleave", pointerLeave);

    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(delay);
      viewport.removeEventListener("pointerenter", pointerEnter);
      viewport.removeEventListener("pointerleave", pointerLeave);
      rail.style.removeProperty("transform");
      cards.forEach((card) => {
        card.style.removeProperty("--country-focus");
        card.removeAttribute("data-centered");
      });
    };
  }, [motion]);

  return (
    <section ref={section} className="site-countries" id="paises" aria-labelledby="paises-titulo">
      <div className="site-container site-section-content">
        <div className="site-countries-heading" data-site-reveal="">
          <span className="site-eyebrow">{copy.label}</span>
          <h2 id="paises-titulo">
            {copy.title} <em>{copy.emphasis}</em>
          </h2>
        </div>
        <div
          className="site-countries-band"
          id="paises-carrusel"
          ref={band}
          data-site-reveal=""
          data-moving={motion}
          data-paused={paused}
          role="group"
          aria-label={copy.strip}
          tabIndex={motion ? undefined : 0}
        >
          <div className="site-countries-track" ref={track}>
            {(motion ? [0, 1, 2] : [1]).map((copyIndex) => (
              <ul className="site-countries-list" key={copyIndex} aria-hidden={copyIndex !== 1 || undefined}>
                {countries.map((country, index) => (
                  <li className="site-country" key={country.code}>
                    <span
                      className="site-country-flag"
                      style={{ backgroundPositionY: `${index * 100 / (countries.length - 1)}%` }}
                      aria-hidden="true"
                    />
                    <span className="site-country-name">{country[locale]}</span>
                    <span className="site-country-destination" aria-hidden="true">→ Medellín</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="site-countries-footer">
          <p>{copy.caption}</p>
          {motion ? (
            <button
              className="site-countries-toggle"
              type="button"
              aria-controls="paises-carrusel"
              aria-label={paused ? copy.resume : copy.pause}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
