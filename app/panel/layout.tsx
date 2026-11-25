import { PanelShell } from "@/components/layout/panel-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PanelShell>{children}</PanelShell>;
}
