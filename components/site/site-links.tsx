import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { site, siteCopy, type SiteLocale } from "@/lib/site";

const logoMark = "/brand/logo-mark.webp";

export function SiteLogo({ locale }: { locale: SiteLocale }) {
  const { home, path } = siteCopy[locale];

  return (
    <Link className="site-logo" href={path} aria-label={`${site.name} · ${home}`}>
      <span className="site-logo-part site-logo-mark">
        <Image src={logoMark} alt="" width={88} height={54} />
      </span>
      <span className="site-logo-part site-logo-wordmark">
        <Image src="/brand/logo-wordmark.webp" alt="" width={81} height={34} />
      </span>
    </Link>
  );
}

export function WhatsAppLink({
  locale,
  className,
  floating = false,
}: {
  locale: SiteLocale;
  className?: string;
  floating?: boolean;
}) {
  const { whatsAppAction, whatsAppPrompt, whatsAppMessage } = siteCopy[locale];
  const message = encodeURIComponent(whatsAppMessage);
  const label = floating ? whatsAppPrompt : whatsAppAction;
  const variantClass = floating ? "site-floating-whatsapp" : "site-whatsapp-button";

  return (
    <a
      className={className ? `${variantClass} ${className}` : variantClass}
      href={`https://wa.me/${site.phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} · WhatsApp`}
    >
      {floating ? (
        <>
          <span className="site-floating-label" aria-hidden="true">{label}</span>
          <span className="site-floating-emblem" aria-hidden="true">
            <Image src={logoMark} alt="" width={40} height={25} />
            <span className="site-floating-badge"><Phone size={13} /></span>
          </span>
        </>
      ) : (
        <>
          <MessageCircle size={18} aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </a>
  );
}
