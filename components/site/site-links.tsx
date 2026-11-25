import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { site, siteCopy, type SiteLocale } from "@/lib/site";

export function SiteLogo({ locale }: { locale: SiteLocale }) {
  const { home, path } = siteCopy[locale];

  return (
    <Link className="site-logo" href={path} aria-label={`${site.name} · ${home}`}>
      <Image src="/brand/logo-mark.webp" alt="" width={65} height={40} />
      <Image src="/brand/logo-wordmark.webp" alt="" width={96} height={40} />
    </Link>
  );
}

export function WhatsAppLink({
  locale,
  className,
}: {
  locale: SiteLocale;
  className?: string;
}) {
  const { whatsApp, whatsAppMessage } = siteCopy[locale];
  const message = encodeURIComponent(whatsAppMessage);

  return (
    <a
      className={`site-whatsapp ${className ?? ""}`}
      href={`https://wa.me/${site.phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsApp}
    >
      <MessageCircle size={19} aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
