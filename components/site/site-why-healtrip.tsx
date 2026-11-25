"use client";

import {
  CalendarX, CircleDollarSign, FileText, FlaskConical, MapPin,
  MessageCircleQuestion, MessagesSquare, Route, Timer,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { SiteLocale } from "@/lib/site";
import { whyCopy, type WhyCopy } from "./site-why-copy";
import { useSiteMotion, useSiteReveal } from "./use-site-motion";

const photos = [
  "/experience/coordination-1.webp",
  "/experience/coordination-2.webp",
  "/experience/coordination-3.webp",
  "/experience/coordination-4.webp",
];

const nodes = [
  { Icon: MessagesSquare, before: [46, 6.5], mobile: [47, 5], after: [28, 36], row: 8, turn: -3, partner: 4 },
  { Icon: CalendarX, before: [62, 17.4], mobile: [54, 16], after: [72, 36], row: 18.5, turn: 2.5, partner: 6 },
  { Icon: MapPin, before: [42, 28.3], mobile: [46, 27], after: [28, 48], row: 29, turn: -2, partner: 8 },
  { Icon: CircleDollarSign, before: [60, 39.2], mobile: [54, 38], after: [72, 48], row: 39.5, turn: 3, partner: 0 },
  { Icon: Timer, before: [48, 50.1], mobile: [47, 49], after: [28, 60], row: 50, turn: -2.5, partner: 2 },
  { Icon: MessageCircleQuestion, before: [64, 61], mobile: [54, 60], after: [72, 60], row: 60.5, turn: 2, partner: 7 },
  { Icon: FileText, before: [44, 71.9], mobile: [46, 71], after: [28, 72], row: 71, turn: -3, partner: 1 },
  { Icon: Route, before: [58, 82.8], mobile: [54, 82], after: [72, 72], row: 81.5, turn: 2.5, partner: 3 },
  { Icon: FlaskConical, before: [52, 93.7], mobile: [50, 93], after: [50, 85], row: 92, turn: -1.5, partner: 5 },
];

function WhyDiagram({ copy, ordered, animate, stage, onToggle }: {
  copy: WhyCopy;
  ordered: boolean;
  animate: boolean;
  stage: RefObject<HTMLButtonElement>;
  onToggle: () => void;
}) {
  const links = useRef<SVGSVGElement>(null);
  const core = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const diagram = stage.current;
    const svg = links.current;
    const emblem = core.current;
    if (!diagram || !svg || !emblem) return;

    const cards = Array.from(diagram.querySelectorAll<HTMLElement>(".site-why-node"));
    const groups = Array.from(svg.querySelectorAll<SVGGElement>(".site-why-link"));
    let frame = 0;

    const draw = () => {
      const { left, top, width, height } = svg.getBoundingClientRect();
      if (!width || !height) return;

      const center = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return [rect.left - left + rect.width / 2, rect.top - top + rect.height / 2];
      };
      const positions = cards.map(center);
      const hub = center(emblem);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      groups.forEach((group, index) => {
        const [x1, y1] = positions[index];
        const [x2, y2] = ordered ? hub : positions[nodes[index].partner];
        const path = `M ${x1} ${y1} L ${x2} ${y2}`;
        for (const link of group.children) link.setAttribute("d", path);
      });
    };

    const resize = new ResizeObserver(draw);
    resize.observe(diagram);
    draw();

    if (animate) {
      const start = performance.now();
      const follow = (now: number) => {
        draw();
        if (now - start < 1800) frame = requestAnimationFrame(follow);
      };
      frame = requestAnimationFrame(follow);
    }

    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ordered, animate, stage]);

  return (
    <>
      <button
        className="site-why-stage"
        ref={stage}
        type="button"
        data-site-reveal=""
        aria-label={copy.diagramLabel}
        aria-pressed={ordered}
        aria-describedby="coordinacion-aspectos"
        onClick={onToggle}
      >
        <svg ref={links} className="site-why-lines" aria-hidden="true">
          {copy.nodes.map(({ label }, index) => (
            <g className="site-why-link" key={label} style={{ "--node-index": index } as CSSProperties}>
              <path className="site-why-connection" />
              <path className="site-why-signal" pathLength={100} />
            </g>
          ))}
        </svg>
        <span className="site-why-hub" aria-hidden="true">
          <span className="site-why-orbit">
            <span />
            <span className="site-why-core" ref={core}>
              <Image src="/brand/logo-mark.webp" alt="" width={62} height={38} unoptimized />
            </span>
          </span>
          <strong>Healtrip</strong>
          <small>{copy.agent}</small>
        </span>
        {copy.nodes.map(({ label, problem }, index) => {
          const { Icon, before, mobile, after, row, turn } = nodes[index];

          return (
            <span
              className="site-why-node"
              key={label}
              aria-hidden="true"
              style={{
                "--node-index": index,
                "--node-before-x": `${before[0]}%`,
                "--node-before-y": `${before[1]}%`,
                "--node-mobile-x": `${mobile[0]}%`,
                "--node-mobile-y": `${mobile[1]}%`,
                "--node-turn": `${turn}deg`,
                "--node-row": `${row}%`,
                "--node-after-x": `${after[0]}%`,
                "--node-after-y": `${after[1]}%`,
              } as CSSProperties}
            >
              <Icon size={15} strokeWidth={1.6} />
              <span>{label}</span>
              <span className="site-why-node-issue">{problem}</span>
            </span>
          );
        })}
        <span className="site-why-hint" aria-hidden="true">
          {ordered ? copy.compareHint : copy.organizeHint}
        </span>
      </button>
      <p id="coordinacion-aspectos" className="sr-only">
        {ordered ? copy.agent + ". " : ""}
        {copy.nodes.map(({ label, problem }) => ordered ? label : `${label}: ${problem}`).join(". ")}
      </p>
    </>
  );
}

export function SiteWhyHealtrip({ locale }: { locale: SiteLocale }) {
  const copy = whyCopy[locale];
  const motion = useSiteMotion();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  const [ordered, setOrdered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [photo, setPhoto] = useState(0);
  useSiteReveal(section, motion);

  useEffect(() => {
    const container = section.current;
    const diagram = stage.current;
    if (!motion || !container || !diagram) return;

    let organize: number | undefined;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) setVisible(entry.isIntersecting);
        if (entry.target === diagram && entry.intersectionRatio >= 0.45) {
          observer.unobserve(diagram);
          organize = window.setTimeout(() => {
            if (!interacted.current) setOrdered(true);
          }, 900);
        }
      }
    }, { threshold: [0, 0.45] });

    observer.observe(container);
    observer.observe(diagram);
    return () => {
      observer.disconnect();
      window.clearTimeout(organize);
    };
  }, [motion]);

  useEffect(() => {
    if (!motion || !visible) return;

    const cycle = window.setInterval(() => {
      if (!document.hidden) setPhoto((current) => (current + 1) % photos.length);
    }, 5000);
    return () => window.clearInterval(cycle);
  }, [motion, visible]);

  const toggle = () => {
    interacted.current = true;
    setOrdered((value) => !value);
  };

  return (
    <section
      ref={section}
      className="site-why"
      id="por-que-healtrip"
      aria-labelledby="por-que-titulo"
      data-ordered={ordered}
      data-visible={motion && visible}
    >
      <div className="site-why-backdrop" aria-hidden="true">
        {(motion ? photos : photos.slice(0, 1)).map((src, index) => (
          <Image key={src} src={src} alt="" fill sizes="100vw" unoptimized data-current={(motion ? photo : 0) === index} />
        ))}
      </div>
      <div className="site-container site-section-content site-why-grid">
        <div className="site-why-intro" data-site-reveal="">
          <span className="site-eyebrow">{copy.label}</span>
          <h2 id="por-que-titulo">{copy.title} <em>{copy.emphasis}</em></h2>
          <div className="site-why-benefits">
            <p>{copy.intro}</p>
            <ul>
              {copy.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
            </ul>
            <p className="site-why-closing">{copy.closing}</p>
          </div>
          <button
            className="site-why-switch"
            type="button"
            role="switch"
            aria-checked={ordered}
            aria-label={copy.switchLabel}
            onClick={toggle}
          >
            <span>{copy.before}</span>
            <span>{copy.after}</span>
          </button>
          <dl className="site-why-metrics">
            {copy.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  <span className="sr-only">{ordered ? metric.after : metric.before}</span>
                  <span className="site-why-metric-values" aria-hidden="true">
                    <span>{metric.before}</span>
                    <span>{metric.after}</span>
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <WhyDiagram copy={copy} ordered={ordered} animate={motion && visible} stage={stage} onToggle={toggle} />
      </div>
    </section>
  );
}
