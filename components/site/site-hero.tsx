import { site, siteCopy, type SiteLocale } from "@/lib/site";
import { heroCopy } from "./site-hero-copy";
import { HeroJourney } from "./site-hero-journey";
import { HeroMedia, HeroPatientCount } from "./site-hero-motion";
import { SiteActionArrow } from "./site-links";

export function SiteHero({ locale }: { locale: SiteLocale }) {
  const copy = heroCopy[locale];
  const wordpressHome = `${site.origin}${siteCopy[locale].wordpressHome}`;

  return (
    <section className="site-hero" id="inicio" aria-labelledby="inicio-titulo">
      <HeroMedia />
      <div className="site-hero-veil" aria-hidden="true" />
      <div className="site-hero-content">
        <h1 id="inicio-titulo">
          <em>{copy.headline}</em>{" "}{copy.headlineEnd}
        </h1>
        <p className="site-hero-lead">
          <strong>{copy.promise}</strong>{" "}{copy.description}
        </p>
        <div className="site-hero-actions">
          <a className="site-gold-button site-hero-primary" href={`${wordpressHome}#planea`}>
            {copy.tripAction}
            <SiteActionArrow />
          </a>
          <a className="site-hero-secondary" href="#chequeos">
            {copy.checkupsAction}
          </a>
        </div>
        <dl className="site-hero-stats">
          <div>
            <dt>{copy.patients}</dt>
            <dd><HeroPatientCount /></dd>
          </div>
          <div>
            <dt>{copy.countries[0]}<br />{copy.countries[1]}</dt>
            <dd>10</dd>
          </div>
          <div>
            <dt>{copy.checkupDuration[0]}<br />{copy.checkupDuration[1]}</dt>
            <dd>1</dd>
          </div>
        </dl>
      </div>
      <HeroJourney copy={copy.journey} />
    </section>
  );
}
