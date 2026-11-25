import Link from "next/link";
import { site, siteCopy, type SiteLocale } from "@/lib/site";
import { SiteLogo } from "./site-links";

export function SiteFooter({ locale }: { locale: SiteLocale }) {
  const copy = siteCopy[locale];

  return (
    <footer className="site-footer" id="contacto" tabIndex={-1}>
      <div className="site-container">
        <div className="site-footer-row">
          <div className="site-footer-brand">
            <SiteLogo locale={locale} />
            <span>{site.city}</span>
          </div>
          <address className="site-footer-contact">
            <h2>{copy.contact}</h2>
            <a href={`tel:+${site.phoneNumber}`}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </div>
        <div className="site-footer-bottom">
          <small>© {site.name}</small>
          <Link href="/panel">{copy.team}</Link>
        </div>
      </div>
    </footer>
  );
}
