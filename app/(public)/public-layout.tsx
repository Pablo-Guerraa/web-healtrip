import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { WhatsAppLink } from "@/components/site/site-links";
import { site, siteCopy, type SiteLocale } from "@/lib/site";
import "../globals.css";
import "./site.css";
import "./site-brand.css";
import "./site-hero.css";
import "./site-experience.css";
import "./site-services.css";
import "./site-checkups.css";
import "./site-checkup-details.css";

const sans = localFont({
  src: "./_fonts/source-sans-3.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--site-font-sans",
});

const serif = localFont({
  src: [
    { path: "./_fonts/source-serif-4.woff2", weight: "400 600", style: "normal" },
    { path: "./_fonts/source-serif-4-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--site-font-serif",
  adjustFontFallback: "Times New Roman",
});

export const siteViewport: Viewport = {
  themeColor: "#050d1e",
  colorScheme: "dark",
};

export function siteMetadata(locale: SiteLocale): Metadata {
  const { path, title, description, socialLocale } = siteCopy[locale];

  return {
    metadataBase: new URL(site.origin),
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        es: siteCopy.es.path,
        en: siteCopy.en.path,
        "x-default": siteCopy.es.path,
      },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title,
      description,
      locale: socialLocale,
    },
    icons: {
      icon: { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      apple: { url: "/brand/apple-touch-icon.png", sizes: "180x180" },
    },
    // Keep redesign previews out of search results until launch.
    robots: { index: false, follow: true },
  };
}

export function PublicLayout({
  locale,
  children,
}: {
  locale: SiteLocale;
  children: ReactNode;
}) {
  return (
    <html lang={locale}>
      <body className={`public-site ${sans.variable} ${serif.variable}`}>
        <a className="site-skip-link" href="#contenido">
          {siteCopy[locale].skipLink}
        </a>
        <SiteHeader locale={locale} />
        <main className="site-main" id="contenido" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={locale} />
        <WhatsAppLink locale={locale} floating />
      </body>
    </html>
  );
}
