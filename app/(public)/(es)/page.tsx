import { SiteHero } from "@/components/site/site-hero";
import { siteMetadata } from "../public-layout";

export const metadata = siteMetadata("es");

export default function Page() {
  return <SiteHero locale="es" />;
}
