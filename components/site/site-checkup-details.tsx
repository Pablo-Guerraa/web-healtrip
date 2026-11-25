"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Activity, ArrowUpRight, AudioLines, Check, CircleDot, Dna, Droplet, FlaskConical, HeartPulse,
  Pill, Ribbon, Scan, Sun, TestTubeDiagonal, Timer, X, type LucideIcon,
} from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { SiteLocale } from "@/lib/site";
import {
  checkupLevels, checkupPlans, type CheckupCurrency, type CheckupExam,
  type CheckupLevel, type CheckupProfile,
} from "./checkup-catalog";
import { checkupCopy, getCheckupBookingHref, getCheckupPrice } from "./site-checkup-copy";
import { selectSiteTabByKey } from "./site-tab-keys";

const examIcons: Record<string, LucideIcon> = {
  "lipid-profile": HeartPulse,
  hba1c: Dna,
  "blood-count": Droplet,
  tsh: Activity,
  psa: CircleDot,
  "pap-test": CircleDot,
  urinalysis: TestTubeDiagonal,
  b12: Pill,
  "vitamin-d": Sun,
  ferritin: Droplet,
  ekg: Activity,
  "abdominal-ultrasound": AudioLines,
  "chest-xray": Scan,
  "stress-test": Timer,
  "breast-ultrasound": Ribbon,
};

function ExamList({ exams, level, locale, diagnostic }: {
  exams: readonly CheckupExam[];
  level: CheckupLevel;
  locale: SiteLocale;
  diagnostic: boolean;
}) {
  const copy = checkupCopy[locale];
  const count = exams.filter((exam) => exam.level <= level).length;
  const name = checkupPlans[level][locale].short;

  return (
    <div>
      <div className="site-exams-group-heading">
        <h4>{diagnostic ? copy.diagnosticTitle : copy.labTitle(exams.length)}</h4>
        <p>
          <b>{copy.countOf(count, exams.length)}</b>
          {" "}{diagnostic ? copy.includedIn(name) : copy.allIncluded}
          {diagnostic ? <span className="site-exams-coverage" aria-hidden="true">
            {exams.map((exam) => <i key={exam.id} data-included={exam.level <= level} />)}
          </span> : null}
        </p>
      </div>
      <ul className="site-exams-list" data-diagnostic={diagnostic}>
        {exams.map((exam, index) => {
          const included = exam.level <= level;
          const Icon = examIcons[exam.id] ?? FlaskConical;
          const item = exam[locale];
          const status = included ? copy.included : `${copy.from} ${checkupPlans[exam.level][locale].short}`;
          return (
            <li className="site-exam" key={exam.id} data-included={included}
              style={{ "--exam-index": index + (diagnostic ? 0 : 5) } as CSSProperties}>
              <span className="site-exam-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.5} /></span>
              <div className="site-exam-info">
                <span>{item.category}</span>
                <b>{item.title}</b>
                <small>{item.description}</small>
              </div>
              <span className="site-exam-mark" aria-hidden="true">{included ? <Check size={12} /> : <X size={12} />}</span>
              <span className={diagnostic || !included ? "site-exam-status" : "sr-only"}>{status}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteCheckupDetails({ level, profile, currency, exams, locale }: {
  level: CheckupLevel;
  profile: CheckupProfile;
  currency: CheckupCurrency;
  exams: readonly CheckupExam[];
  locale: SiteLocale;
}) {
  const copy = checkupCopy[locale];
  const [selection, setSelection] = useState({ level, switched: false });
  const active = selection.level;
  const price = getCheckupPrice(active, profile, currency, locale);

  return (
    <Dialog.Root onOpenChange={(open) => { if (open) setSelection({ level, switched: false }); }}>
      <Dialog.Trigger className="site-exams-trigger">
        <span className="site-exams-trigger-icon" aria-hidden="true"><FlaskConical size={17} strokeWidth={1.7} /></span>
        <span className="site-exams-trigger-label"><b>{copy.examDetails}</b><small>{copy.examDescription}</small></span>
        <ArrowUpRight className="site-exams-trigger-arrow" size={17} aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="site-exams-overlay" />
        <Dialog.Content className="site-exams-dialog">
          <Dialog.Close className="site-exams-close" aria-label={copy.close}><X size={18} aria-hidden="true" /></Dialog.Close>
          <div className="site-exams-header">
            <div>
              <span className="site-checkup-kicker">{copy.checkup} · {copy.profileTitle[profile]}</span>
              <Dialog.Title>{copy.detailsTitle} <em>{copy.detailsPlan(checkupPlans[active][locale].title)}</em></Dialog.Title>
              <Dialog.Description className="sr-only">{copy.examDescription}</Dialog.Description>
            </div>
            <div className="site-exams-tabs" role="tablist" aria-label={copy.plan}
              onKeyDown={selectSiteTabByKey} style={{ "--active-plan": active } as CSSProperties}>
              {checkupLevels.map((option) => (
                <button key={option} role="tab" id={`examenes-plan-${option}`} type="button"
                  aria-selected={active === option} aria-controls="examenes-lista"
                  tabIndex={active === option ? 0 : -1}
                  onClick={() => setSelection((value) => value.level === option ? value : { level: option, switched: true })}>
                  {checkupPlans[option][locale].short}
                </button>
              ))}
            </div>
          </div>
          <div className="site-exams-body" id="examenes-lista" role="tabpanel" aria-labelledby={`examenes-plan-${active}`}>
            <div key={active} data-switched={selection.switched}>
              <ExamList exams={exams.filter((exam) => exam.type === "diagnostic")} level={active} locale={locale} diagnostic />
              <ExamList exams={exams.filter((exam) => exam.type === "lab")} level={active} locale={locale} diagnostic={false} />
            </div>
          </div>
          <div className="site-exams-footer">
            <p><b>{price.primary}</b><small>{price.summary}</small></p>
            <a className="site-gold-button" href={getCheckupBookingHref(active, profile, locale)}
              target="_blank" rel="noopener noreferrer">{copy.reserve}</a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
