import type { ReactNode } from "react";
import { PublicLayout, siteViewport } from "../public-layout";

export const viewport = siteViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <PublicLayout locale="en">{children}</PublicLayout>;
}
