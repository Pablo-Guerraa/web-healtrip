import { notFound } from "next/navigation";
import { AuthScreen, type AuthMode } from "@/components/auth/auth-screen";
const modes = [
  "login",
  "register",
  "forgot-password",
  "reset-password",
  "verify-email",
  "resend-verification",
  "invitation",
];
export function generateStaticParams() {
  return modes.map((mode) => ({ mode }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (!modes.includes(mode)) notFound();
  return <AuthScreen key={mode} mode={mode as AuthMode} />;
}
