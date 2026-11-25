"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { site, siteCopy, type SiteLocale } from "@/lib/site";
import { SiteLogo, WhatsAppLink } from "./site-links";

export function SiteHeader({ locale }: { locale: SiteLocale }) {
  const copy = siteCopy[locale];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
      menuButton.current?.focus();
    }
  }

  const wordpressHome = `${site.origin}${copy.wordpressHome}`;

  return (
    <header className="site-header" onKeyDown={handleKeyDown}>
      <div className="site-container site-header-row">
        <SiteLogo locale={locale} />
        <button
          type="button"
          ref={menuButton}
          className="site-menu-toggle"
          aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <div className="site-header-menu" id="site-menu" data-open={menuOpen}>
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
          <WhatsAppLink locale={locale} className="site-whatsapp-desktop" />
        </div>
      </div>
    </header>
  );
}
