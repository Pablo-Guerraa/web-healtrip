import { SiteCountries } from "@/components/site/site-countries";
import { SiteHero } from "@/components/site/site-hero";
import { SiteWhyHealtrip } from "@/components/site/site-why-healtrip";
import { siteMetadata } from "../public-layout";

export const metadata = siteMetadata("en");

export default function Page() {
  return (
    <>
      <SiteHero locale="en" />
      <SiteCountries locale="en" />
      <SiteWhyHealtrip locale="en" />
    </>
  );
}
