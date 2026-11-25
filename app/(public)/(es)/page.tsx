import { SiteCountries } from "@/components/site/site-countries";
import { SiteHero } from "@/components/site/site-hero";
import { SiteWhyHealtrip } from "@/components/site/site-why-healtrip";
import { siteMetadata } from "../public-layout";

export const metadata = siteMetadata("es");

export default function Page() {
  return (
    <>
      <SiteHero locale="es" />
      <SiteCountries locale="es" />
      <SiteWhyHealtrip locale="es" />
    </>
  );
}
