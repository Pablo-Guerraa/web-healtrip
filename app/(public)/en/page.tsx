import { SiteHero } from "@/components/site/site-hero";
import { siteMetadata } from "../public-layout";

export const metadata = siteMetadata("en");

export default function Page() {
  return <SiteHero locale="en" />;
}
