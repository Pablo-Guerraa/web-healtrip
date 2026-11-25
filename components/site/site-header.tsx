"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site, siteCopy, type SiteLocale } from "@/lib/site";
import { SiteLogo, WhatsAppLink } from "./site-links";

export function SiteHeader({ locale }: { locale: SiteLocale }) {
  const copy = siteCopy[locale];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 1080px)");
    const resetMenu = () => setMenuOpen(false);
    const updateTone = () => {
      header.current?.toggleAttribute(
        "data-scrolled",
        window.scrollY > window.innerHeight * 0.6,
      );
    };

    updateTone();
    window.addEventListener("scroll", updateTone, { passive: true });
    window.addEventListener("resize", updateTone);
    compact.addEventListener("change", resetMenu);
    return () => {
      window.removeEventListener("scroll", updateTone);
      window.removeEventListener("resize", updateTone);
      compact.removeEventListener("change", resetMenu);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const wordpressHome = `${site.origin}${copy.wordpressHome}`;

  return (
    <header ref={header} className="site-header" data-menu-open={menuOpen}>
      <div className="site-container site-header-row">
        <SiteLogo locale={locale} />
        <WhatsAppLink locale={locale} className="site-whatsapp-tablet" />
        <button
          type="button"
          ref={menuButton}
          className="site-menu-toggle"
          aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div className="site-header-menu" id="site-menu">
          <nav className="site-nav" aria-label={copy.navLabel}>
            <Link
              href={copy.path}
              aria-current={pathname === copy.path ? "page" : undefined}
              onClick={closeMenu}
            >
              {copy.home}
            </Link>
            <a href={`${site.origin}${copy.wordpressServices}`} onClick={closeMenu}>
              {copy.services}
            </a>
            <a href={`${wordpressHome}#chequeos`} onClick={closeMenu}>
              {copy.checkups}
            </a>
            <a href={`${wordpressHome}#nosotros`} onClick={closeMenu}>
              {copy.about}
            </a>
            <a href="#contacto" onClick={closeMenu}>
              {copy.contact}
            </a>
          </nav>
          <nav className="site-languages" aria-label={copy.languageLabel}>
            {Object.entries(siteCopy).map(([code, language]) => (
              <Link
                key={code}
                href={language.path}
                hrefLang={code}
                lang={code}
                aria-label={language.language}
                aria-current={locale === code ? "true" : undefined}
                onClick={closeMenu}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </nav>
          <WhatsAppLink locale={locale} />
        </div>
      </div>
    </header>
  );
}
