import type { CSSProperties, ReactNode } from "react";
import type { CheckupArea, CheckupProfile } from "./checkup-catalog";

export type AreaCoverage = "included" | "partial" | "unavailable";

// Anatomical paths from the original interactive checkup diagram.
const bodyOutline = {
  male: "M91.0 70.0 C87.5 71.0 77.5 73.7 70.0 76.0 C62.5 78.3 52.2 80.5 46.0 84.0 C39.8 87.5 35.8 91.3 33.0 97.0 C30.2 102.7 29.0 108.8 29.0 118.0 C29.0 127.2 30.8 140.0 33.0 152.0 C35.2 164.0 39.2 178.3 42.0 190.0 C44.8 201.7 48.7 211.7 50.0 222.0 C51.3 232.3 50.5 242.0 50.0 252.0 C49.5 262.0 46.7 272.3 47.0 282.0 C47.3 291.7 49.2 301.8 52.0 310.0 C54.8 318.2 59.0 325.5 64.0 331.0 C69.0 336.5 76.0 340.5 82.0 343.0 C88.0 345.5 94.0 346.0 100.0 346.0 C106.0 346.0 112.0 345.5 118.0 343.0 C124.0 340.5 131.0 336.5 136.0 331.0 C141.0 325.5 145.2 318.2 148.0 310.0 C150.8 301.8 152.7 291.7 153.0 282.0 C153.3 272.3 150.5 262.0 150.0 252.0 C149.5 242.0 148.7 232.3 150.0 222.0 C151.3 211.7 155.2 201.7 158.0 190.0 C160.8 178.3 164.8 164.0 167.0 152.0 C169.2 140.0 171.0 127.2 171.0 118.0 C171.0 108.8 169.8 102.7 167.0 97.0 C164.2 91.3 160.2 87.5 154.0 84.0 C147.8 80.5 137.5 78.3 130.0 76.0 C122.5 73.7 112.5 71.0 109.0 70.0 Z",
  female: "M92.0 70.0 C89.3 70.8 81.7 73.0 76.0 75.0 C70.3 77.0 62.8 78.7 58.0 82.0 C53.2 85.3 49.3 89.3 47.0 95.0 C44.7 100.7 43.8 108.5 44.0 116.0 C44.2 123.5 47.7 134.3 48.0 140.0 C48.3 145.7 45.3 142.5 46.0 150.0 C46.7 157.5 50.0 173.7 52.0 185.0 C54.0 196.3 57.3 207.8 58.0 218.0 C58.7 228.2 58.3 235.7 56.0 246.0 C53.7 256.3 46.3 269.7 44.0 280.0 C41.7 290.3 40.3 299.7 42.0 308.0 C43.7 316.3 48.0 324.0 54.0 330.0 C60.0 336.0 70.3 341.2 78.0 344.0 C85.7 346.8 92.7 347.0 100.0 347.0 C107.3 347.0 114.3 346.8 122.0 344.0 C129.7 341.2 140.0 336.0 146.0 330.0 C152.0 324.0 156.3 316.3 158.0 308.0 C159.7 299.7 158.3 290.3 156.0 280.0 C153.7 269.7 146.3 256.3 144.0 246.0 C141.7 235.7 141.3 228.2 142.0 218.0 C142.7 207.8 146.0 196.3 148.0 185.0 C150.0 173.7 153.3 157.5 154.0 150.0 C154.7 142.5 151.7 145.7 152.0 140.0 C152.3 134.3 155.8 123.5 156.0 116.0 C156.2 108.5 155.3 100.7 153.0 95.0 C150.7 89.3 146.8 85.3 142.0 82.0 C137.2 78.7 129.7 77.0 124.0 75.0 C118.3 73.0 110.7 70.8 108.0 70.0 Z",
} as const;

const organs: Record<Exclude<CheckupArea, "pelvis">, ReactNode> = {
  blood: (
    <>
      <path d="M100 96v150M100 120c-10 6-22 8-34 6M100 120c10 6 22 8 34 6M100 246l-16 40M100 246l16 40" />
    </>
  ),
  thyroid: (
    <>
      <path d="M99 84c-4-5-11-4-11 1 0 4 5 6 10 4M101 84c4-5 11-4 11 1 0 4-5 6-10 4" />
    </>
  ),
  lungs: (
    <>
      <path d="M93 104c-14 2-30 20-32 52-1 12 6 16 14 13 10-4 18-10 18-22z" />
      <path d="M107 104c14 2 30 20 32 52 1 12-6 16-14 13-10-4-18-10-18-22z" />
    </>
  ),
  breast: (
    <>
      <path d="M56 128c2 12 14 18 27 13M144 128c-2 12-14 18-27 13" />
      <circle cx="72" cy="134" r="2" />
      <circle cx="128" cy="134" r="2" />
    </>
  ),
  heart: (
    <>
      <path d="M113 158c-9-6-15-11-15-19a7 7 0 0 1 13-4 7 7 0 0 1 13 4c0 8-6 13-11 19z" />
    </>
  ),
  liver: (
    <>
      <path d="M60 182c0-8 10-12 30-12h22c6 0 8 4 6 9-5 12-24 20-40 24-10 2-18-6-18-21z" />
    </>
  ),
  kidney: (
    <>
      <path d="M74 204c-7 0-10 7-10 13s3 13 10 13c4 0 5-4 3-7s-2-8 0-11 1-8-3-8z" />
      <path d="M126 204c7 0 10 7 10 13s-3 13-10 13c-4 0-5-4-3-7s2-8 0-11-1-8 3-8z" />
    </>
  ),
  gut: (
    <>
      <path d="M78 238h44a7 7 0 0 1 0 14H80a7 7 0 0 0 0 14h40a7 7 0 0 1 0 14H86" />
    </>
  ),
};

const pelvicOrgans = {
  male: (
    <>
      <path d="M92 300c0-6 4-10 8-10s8 4 8 10-4 11-8 11-8-5-8-11z" />
      <path d="M100 311v14" />
    </>
  ),
  female: (
    <>
      <path d="M86 290c0 6 5 7 8 11v7a6 6 0 0 0 12 0v-7c3-4 8-5 8-11" />
      <circle cx="84" cy="288" r="3" />
      <circle cx="116" cy="288" r="3" />
    </>
  ),
};

export function CheckupFigure({ profile, areas, highlighted }: {
  profile: CheckupProfile;
  areas: readonly { id: CheckupArea; coverage: AreaCoverage; color: string }[];
  highlighted?: CheckupArea;
}) {
  return (
    <svg className="site-checkup-figure" viewBox="0 0 200 360" fill="none"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle className="site-checkup-outline" cx="100" cy="35" r="22" />
      <path className="site-checkup-outline" d="M91 56 90 70M109 56 110 70" />
      <path className="site-checkup-shape" d={bodyOutline[profile]} />
      <path className="site-checkup-midline" d="M100 70v276" />
      {areas.map(({ id, coverage, color }) => (
        <g key={id} className="site-checkup-organ" data-area={id} data-coverage={coverage}
          data-highlighted={highlighted === id} style={{ "--organ-color": color } as CSSProperties}>
          {id === "pelvis" ? pelvicOrgans[profile] : organs[id]}
        </g>
      ))}
    </svg>
  );
}
