import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import { appName } from "@/lib/brand";
import "../globals.css";
export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s · ${appName}`,
  },
  description: "Panel de coordinación de turismo médico en Medellín.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
