"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site, siteCopy, type SiteLocale } from "@/lib/site";
import {
  checkupExams, checkupLevels, checkupPlans, type CheckupCurrency, type CheckupLevel, type CheckupProfile,
} from "./checkup-catalog";
import { SiteCheckupBody } from "./site-checkup-body";
import { checkupCopy, getCheckupBookingHref, getCheckupPrice } from "./site-checkup-copy";
import { SiteCheckupDetails } from "./site-checkup-details";
import { SiteActionArrow } from "./site-links";
import { selectSiteTabByKey } from "./site-tab-keys";
import { useSiteMotion, useSiteReveal } from "./use-site-motion";

const profiles = ["male", "female"] as const;
const currencies = ["COP", "USD"] as const;

export function SiteCheckups({ locale }: { locale: SiteLocale }) {
  const copy = checkupCopy[locale];
  const [level, setLevel] = useState<CheckupLevel>(1);
  const [profile, setProfile] = useState<CheckupProfile>("male");
  const [currency, setCurrency] = useState<CheckupCurrency>(locale === "en" ? "USD" : "COP");
  const [compact, setCompact] = useState(false);
  const motion = useSiteMotion();
  const section = useRef<HTMLElement>(null);
  useSiteReveal(section, motion);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1080px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const exams = checkupExams.filter((exam) => exam.profile === "all" || exam.profile === profile);
  const plan = checkupPlans[level][locale];
  const price = getCheckupPrice(level, profile, currency, locale);
  const serviceLevels = level === 0 ? [0 as const] : checkupLevels.slice(1, level + 1);
  const benefits = [
    ...(level > 0 ? [{ title: copy.samples, extra: false }] : []),
    ...serviceLevels.flatMap((option) => checkupPlans[option][locale].services.map((title) => ({
      title, extra: level > 0 && option === level,
    }))),
    ...exams.filter((exam) => exam.level <= level && (exam.type === "diagnostic" || exam.level > 0))
      .map((exam) => ({ title: exam[locale].title, extra: level > 0 && exam.level === level })),
  ];

  return (
    <section className="site-checkups" id="chequeos" aria-labelledby="chequeos-titulo" ref={section}>
      <div className="site-checkup-background" aria-hidden="true"><i /><i /><span /></div>
      <div className="site-container site-section-content">
        <div className="site-checkups-top">
          <div className="site-checkups-heading" data-site-reveal="">
            <span className="site-eyebrow">{copy.label}</span>
            <h2 id="chequeos-titulo">{copy.title} <em>{copy.emphasis}</em></h2>
            <p>{copy.intro}</p>
          </div>
          <div className="site-checkup-settings">
            <div>
              <span id="chequeo-perfil">{copy.profile}</span>
              <div role="group" aria-labelledby="chequeo-perfil" className="site-checkup-segment">
                {profiles.map((option) => (
                  <button key={option} type="button" aria-pressed={profile === option}
                    onClick={() => setProfile(option)}>{copy.profiles[option]}</button>
                ))}
              </div>
            </div>
            <div>
              <span id="chequeo-moneda">{copy.currency}</span>
              <div role="group" aria-labelledby="chequeo-moneda" className="site-checkup-segment">
                {currencies.map((option) => (
                  <button key={option} type="button" aria-pressed={currency === option}
                    onClick={() => setCurrency(option)}>{option}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="site-checkups-grid">
          <div className="site-checkup-options" data-site-reveal="">
            <div className="site-checkup-plans" role="tablist" aria-label={copy.plans}
              aria-orientation={compact ? "horizontal" : "vertical"} onKeyDown={selectSiteTabByKey}>
              {checkupLevels.map((option) => {
                const planOption = checkupPlans[option][locale];
                const optionPrice = getCheckupPrice(option, profile, currency, locale);
                const coverage = exams.filter((exam) => exam.level <= option).length / exams.length;
                return (
                  <button key={option} id={`chequeo-plan-${option}`} className="site-checkup-plan"
                    type="button" role="tab" aria-controls="chequeo-resumen" aria-selected={level === option}
                    tabIndex={level === option ? 0 : -1} onClick={() => setLevel(option)}>
                    {option === 1 ? <span className="site-checkup-popular">{copy.popular}</span> : null}
                    <span className="site-checkup-plan-number" aria-hidden="true">0{option + 1}</span>
                    <span className="site-checkup-plan-name"><b>{planOption.title}</b><small>{planOption.caption}</small></span>
                    <span className="site-checkup-plan-price">
                      <b key={optionPrice.compact}>{optionPrice.compact}</b> <small>{currency}</small>
                      <span>{optionPrice.alternate}</span>
                    </span>
                    <span className="site-checkup-coverage" aria-hidden="true"
                      style={{ "--coverage": `${Math.round(coverage * 100)}%` } as CSSProperties}><i /></span>
                  </button>
                );
              })}
            </div>
            <p className="site-checkup-hint">{copy.hint}</p>
          </div>
          <div className="site-checkup-body" data-site-reveal="">
            <SiteCheckupBody key={profile} locale={locale} profile={profile} level={level} exams={exams} motion={motion} />
          </div>
          <div className="site-checkup-card" id="chequeo-resumen" role="tabpanel"
            aria-labelledby={`chequeo-plan-${level}`} data-site-reveal="">
            <div className="site-checkup-card-info" key={`${level}-${profile}-${currency}`}>
              <span className="site-checkup-kicker">{copy.checkup}</span>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <div className="site-checkup-price"><b>{price.primary}</b><small>{price.summary}</small></div>
              <ul className="site-checkup-benefits">
                {benefits.map(({ title, extra }, index) => (
                  <li key={title} data-extra={extra} style={{ "--benefit-index": index } as CSSProperties}>{title}</li>
                ))}
              </ul>
            </div>
            <SiteCheckupDetails level={level} profile={profile} currency={currency} exams={exams} locale={locale} />
            <a className="site-gold-button" href={getCheckupBookingHref(level, profile, locale)}
              target="_blank" rel="noopener noreferrer">{copy.reserve} <SiteActionArrow /></a>
            <p className="site-checkup-confirmation">{copy.confirmation}</p>
          </div>
        </div>
        <div className="site-checkup-next">
          <div><span className="site-checkup-kicker">{copy.next}</span><b>{copy.dates}</b><small>{copy.datesIntro}</small></div>
          <a className="site-gold-button" href={`${site.origin}${siteCopy[locale].wordpressHome}#planea`}>
            {copy.bookDates} <SiteActionArrow />
          </a>
        </div>
      </div>
    </section>
  );
}
