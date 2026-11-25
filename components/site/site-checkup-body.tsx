"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { SiteLocale } from "@/lib/site";
import { checkupPlans, type CheckupArea, type CheckupExam, type CheckupLevel, type CheckupProfile } from "./checkup-catalog";
import { CheckupFigure, type AreaCoverage } from "./checkup-figure";
import { checkupCopy } from "./site-checkup-copy";

const zoneDetails = [
  { id: "thyroid", x: 50, y: 23.9, color: "#4fd1c5", es: "Tiroides", en: "Thyroid" },
  { id: "blood", x: 67, y: 34.4, color: "#ff4d5e", es: "Sangre", en: "Blood" },
  { id: "lungs", x: 35, y: 43.3, color: "#8fc3ff", es: "Pulmones", en: "Lungs" },
  { id: "breast", x: 39, y: 35, color: "#ff8fc8", es: "Mama", en: "Breast" },
  { id: "heart", x: 56, y: 40, color: "#ff6b7d", es: "Corazón", en: "Heart" },
  { id: "liver", x: 41, y: 51.7, color: "#d9895a", es: "Hígado", en: "Liver" },
  { id: "kidney", x: 64, y: 60, color: "#c792ff", es: "Riñones", en: "Kidneys" },
  { id: "gut", x: 50, y: 71.7, color: "#f5b971", es: "Digestivo", en: "Digestive" },
  { id: "pelvis", x: 50, y: 84.4, color: "#6aa8ff", es: "Próstata", en: "Prostate" },
] as const;

function ExamTally({ total, motion }: { total: number; motion: boolean }) {
  const [value, setValue] = useState(total);
  const previous = useRef(total);

  useEffect(() => {
    if (!motion) {
      previous.current = total;
      setValue(total);
      return;
    }

    const from = previous.current;
    if (from === total) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / 600, 1);
      const count = Math.round(from + (total - from) * (1 - (1 - progress) ** 3));
      previous.current = count;
      setValue(count);
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [total, motion]);

  return <><b aria-hidden="true">{motion ? value : total}</b><b className="sr-only">{total}</b></>;
}

export function SiteCheckupBody({ locale, profile, level, exams, motion }: {
  locale: SiteLocale;
  profile: CheckupProfile;
  level: CheckupLevel;
  exams: readonly CheckupExam[];
  motion: boolean;
}) {
  const copy = checkupCopy[locale];
  const wrapper = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<{ id: CheckupArea; pinned: boolean } | null>(null);
  const detailsOpen = point !== null;
  const areas = zoneDetails.flatMap((zone) => {
    const tests = exams.filter((exam) => exam.area === zone.id);
    if (!tests.length) return [];
    const included = tests.filter((exam) => exam.level <= level).length;
    const coverage: AreaCoverage = included === tests.length ? "included" : included ? "partial" : "unavailable";
    const gynecology = zone.id === "pelvis" && profile === "female";
    return [{
      ...zone,
      label: gynecology ? (locale === "es" ? "Ginecología" : "Gynecology") : zone[locale],
      color: gynecology ? "#ff8fc8" : zone.color,
      tests,
      coverage,
    }];
  });

  const active = areas.find((area) => area.id === point?.id);
  const included = exams.filter((exam) => exam.level <= level);
  const show = (id: CheckupArea) => setPoint((current) => current?.pinned ? current : { id, pinned: false });
  const clear = (id: CheckupArea) => setPoint((current) => current?.id === id && !current.pinned ? null : current);

  useEffect(() => {
    if (!detailsOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapper.current?.contains(event.target)) setPoint(null);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setPoint(null); };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [detailsOpen]);

  return (
    <>
      <div ref={wrapper} className="site-checkup-diagram">
        <span className="site-checkup-profile">{copy.profileTitle[profile]}</span>
        <CheckupFigure key={profile} profile={profile} areas={areas} highlighted={active?.id} />
        <span className="site-checkup-scan" aria-hidden="true" />
        {areas.map(({ id, label, coverage, color, x, y }, index) => (
          <button
            key={id}
            className="site-checkup-point"
            type="button"
            aria-label={label}
            aria-expanded={active?.id === id}
            aria-controls={active?.id === id ? "chequeo-zona" : undefined}
            data-coverage={coverage}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") show(id); }}
            onPointerLeave={() => clear(id)}
            onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) show(id); }}
            onBlur={() => clear(id)}
            onClick={() => setPoint((current) => current?.id === id && current.pinned ? null : { id, pinned: true })}
            style={{ "--organ-color": color, "--point-x": `${x}%`, "--point-y": `${y}%`, "--point-delay": `${index * 180}ms` } as CSSProperties}
          />
        ))}
        {active ? (
          <div id="chequeo-zona" className="site-checkup-tooltip" role="status"
            data-side={active.x > 50 ? "left" : "right"}
            data-low={active.y > 64}
            style={{ "--organ-color": active.color, "--point-x": `${active.x}%`, "--point-y": `${active.y}%` } as CSSProperties}>
            <b>{active.label}</b>
            <ul>
              {active.tests.map((exam) => (
                <li key={exam.id} data-included={exam.level <= level}>
                  <span>{exam[locale].title}</span>
                  <small>{exam.level <= level ? `✓ ${copy.included}` : `${copy.from} ${checkupPlans[exam.level][locale].short}`}</small>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <ul className="site-checkup-legend" aria-hidden="true">
        {areas.map(({ id, label, color, coverage }) => (
          <li key={id} data-coverage={coverage} style={{ "--organ-color": color } as CSSProperties}>{label}</li>
        ))}
      </ul>
      <div className="site-checkup-tallies">
        <span><ExamTally total={included.filter((exam) => exam.type === "lab").length} motion={motion} /><small>{copy.labs}</small></span>
        <span><ExamTally total={included.filter((exam) => exam.type === "diagnostic").length} motion={motion} /><small>{copy.diagnostics}</small></span>
      </div>
    </>
  );
}
