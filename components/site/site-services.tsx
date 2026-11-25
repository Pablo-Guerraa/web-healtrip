"use client";

import { CalendarDays, Pause, Play, ScanSearch, Stethoscope, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site, siteCopy, whatsAppHref, type SiteLocale } from "@/lib/site";
import { checkupPlans, formatCheckupAmount } from "./checkup-catalog";
import { SiteActionArrow } from "./site-links";
import { serviceCopy, type ServiceCopy } from "./site-services-copy";
import { selectSiteTabByKey } from "./site-tab-keys";
import { useSiteMotion, useSiteReveal } from "./use-site-motion";

const services = [
  { id: "chequeos", Icon: Stethoscope, photo: "/care/checkups.webp" },
  { id: "especialistas", Icon: CalendarDays, photo: "/care/specialists.webp" },
  { id: "segunda-opinion", Icon: ScanSearch, photo: null },
  { id: "consultas-virtuales", Icon: Video, photo: "/care/virtual-consultations.webp" },
] as const;

function CaseReview({ copy }: { copy: ServiceCopy }) {
  return (
    <div className="site-service-case">
      <div className="site-service-film">
        <Image src="/care/case-xray.webp" alt="" width={400} height={440} unoptimized />
        <span className="site-service-case-scan" />
        <span className="site-service-case-target">{copy.caseTarget}</span>
      </div>
      <div className="site-service-case-records">
        <span>{copy.caseTitle}</span>
        {copy.caseRows.map(([title, status], index) => (
          <div key={title} className="site-service-case-row"
            style={{ "--record-index": index } as CSSProperties}>
            <i>{index === copy.caseRows.length - 1 ? "◆" : "✓"}</i>
            <span>{title}<small>{status}</small></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SiteServices({ locale }: { locale: SiteLocale }) {
  const copy = serviceCopy[locale];
  const section = useRef<HTMLElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const motion = useSiteMotion();
  const [selection, setSelection] = useState({ current: 0, previous: -1 });
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const rotating = motion && inView && tabVisible && !hovered && !focused && !paused;
  const current = selection.current;
  useSiteReveal(section, motion);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    const media = window.matchMedia("(max-width: 980px)");
    const updateLayout = () => setCompact(media.matches);
    const updateVisibility = () => setTabVisible(!document.hidden);
    observer.observe(element);
    media.addEventListener("change", updateLayout);
    document.addEventListener("visibilitychange", updateVisibility);
    updateLayout();
    updateVisibility();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateLayout);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const list = tabs.current;
    const button = list?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[current];
    if (!compact || !button || !list) return;
    list.scrollTo({ left: button.offsetLeft - 24, behavior: motion ? "smooth" : "auto" });
  }, [compact, current, motion]);

  const select = (index: number) => {
    setSelection((value) => value.current === index ? value : { current: index, previous: value.current });
  };
  const profiles = locale === "es" ? ["Hombre", "Mujer"] : ["Male", "Female"];

  return (
    <section
      id="servicios"
      className="site-services"
      aria-labelledby="servicios-titulo"
      ref={section}
      data-rotating={rotating}
      data-in-view={inView}
      onPointerEnter={(event) => setHovered(event.pointerType !== "touch")}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={(event) => {
        if (!motion || event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
        event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
      }}
      onFocusCapture={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="site-container site-section-content site-services-grid">
        <div className="site-services-intro" data-site-reveal="">
          <span className="site-eyebrow">{copy.label}</span>
          <h2 id="servicios-titulo">{copy.title} <em>{copy.emphasis}</em></h2>
          <div className="site-services-tabs" ref={tabs} role="tablist" aria-label={copy.tabLabel}
            aria-orientation={compact ? "horizontal" : "vertical"} onKeyDown={selectSiteTabByKey}>
            {services.map(({ id, Icon }, index) => (
              <button
                key={id}
                type="button"
                className="site-service-tab"
                id={`servicio-tab-${id}`}
                role="tab"
                tabIndex={current === index ? 0 : -1}
                aria-selected={current === index}
                aria-controls={`servicio-panel-${id}`}
                onClick={() => select(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") select(index);
                }}
              >
                <span className="site-service-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.7} /></span>
                <span className="site-service-label">
                  <strong>{copy.panels[index].label}</strong>
                  <small>{copy.panels[index].meta}</small>
                </span>
                <span className="site-service-tab-arrow" aria-hidden="true">→</span>
                {motion && current === index ? <span className="site-service-progress" aria-hidden="true"
                  onAnimationEnd={() => { if (rotating) select((current + 1) % services.length); }} /> : null}
              </button>
            ))}
          </div>
        </div>
        <div className="site-services-stage" data-site-reveal="">
          <div className="site-services-media">
            {services.map(({ id, photo }, index) => (
              <div
                key={id}
                className="site-services-slide"
                data-state={current === index ? "active" : selection.previous === index ? "previous" : "inactive"}
                aria-hidden="true"
              >
                {photo ? <Image src={photo} alt="" fill sizes="(max-width: 980px) 100vw, 630px" unoptimized />
                  : <CaseReview copy={copy} />}
              </div>
            ))}
            {selection.previous >= 0 ? <span className="site-service-sweep" key={current} aria-hidden="true" /> : null}
            <span className="site-service-mode" aria-hidden="true">{current < 2 ? copy.inPerson : copy.virtual}</span>
            <span className="site-service-position" aria-hidden="true"><b>0{current + 1}</b> / 0{services.length}</span>
            {motion ? (
              <button className="site-service-pause" type="button" aria-controls="servicios-paneles"
                aria-label={paused ? copy.resume : copy.pause} onClick={() => setPaused((value) => !value)}>
                {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
              </button>
            ) : null}
          </div>
          <div id="servicios-paneles" className="site-services-panels">
            {services.map(({ id }, index) => {
              const pane = copy.panels[index];
              const active = current === index;
              return (
                <div className="site-service-panel" key={id}
                  id={`servicio-panel-${id}`} role="tabpanel" data-active={active}
                  aria-labelledby={`servicio-tab-${id}`} aria-hidden={!active}>
                  <h3>{pane.title} <em>{pane.emphasis}</em></h3>
                  <p>{pane.description}</p>
                  <ul>{pane.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                  <div className="site-service-footer">
                    {index === 0 ? (
                      <div className="site-service-starting-price">
                        <span>{copy.from}</span>
                        <dl>
                          {(["male", "female"] as const).map((profile, position) => (
                            <div key={profile}>
                              <dt>{profiles[position]}</dt>
                              <dd>${formatCheckupAmount(checkupPlans[0].prices[profile].COP, locale)}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : <span className="site-service-specialties">{pane.specialties}</span>}
                    <a className="site-gold-button" href={pane.message ? whatsAppHref(pane.message) : "#chequeos"}
                      target={pane.message ? "_blank" : undefined} rel={pane.message ? "noopener noreferrer" : undefined}
                      tabIndex={active ? undefined : -1}>
                      {pane.action} <SiteActionArrow />
                    </a>
                  </div>
                  {index === 1 ? (
                    <a className="site-service-support" tabIndex={active ? undefined : -1}
                      href={`${site.origin}${siteCopy[locale].wordpressServices}#acompanamiento`}>{copy.support}</a>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
