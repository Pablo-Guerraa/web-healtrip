"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Home, Users, Settings, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Loading, Notice } from "@/components/shared/form";
import { errorMessage } from "@/lib/api";
import type { Permission } from "@/lib/types";
const links: {
  href: string;
  label: string;
  icon: typeof Home;
  permission?: Permission;
}[] = [
  { href: "/panel", label: "Inicio", icon: Home },
  {
    href: "/panel/users",
    label: "Usuarios",
    icon: Users,
    permission: "users:read",
  },
  {
    href: "/panel/roles",
    label: "Roles y permisos",
    icon: ShieldCheck,
    permission: "roles:manage",
  },
  { href: "/panel/settings", label: "Configuración", icon: Settings },
];
export function PanelShell({ children }: { children: ReactNode }) {
  const auth = useAuth(),
    path = usePathname(),
    router = useRouter();
  const [mobile, setMobile] = useState(false),
    [error, setError] = useState(""),
    [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => {
    if (auth.status === "anonymous") router.replace("/auth/login");
  }, [auth.status, router]);
  useEffect(() => setMobile(false), [path]);
  if (auth.status === "loading" || auth.status === "anonymous")
    return <Loading />;
  if (auth.status === "error")
    return (
      <main className="mx-auto max-w-lg space-y-5 p-8">
        <Notice message="No se pudo cargar tu espacio de trabajo." error />
        <Button onClick={() => void auth.reload()}>Reintentar</Button>
      </main>
    );
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[244px_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:p-3"
      >
        Ir al contenido
      </a>
      <div className="flex items-center justify-between border-b bg-background p-4 lg:hidden">
        <Link href="/panel" className="font-semibold">
          {process.env.NEXT_PUBLIC_APP_NAME || "Business Core"}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={mobile ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobile}
          onClick={() => setMobile(!mobile)}
        >
          <Menu />
        </Button>
      </div>
      <aside
        className={`${mobile ? "block" : "hidden"} border-r bg-background p-5 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col`}
      >
        <Link
          href="/panel"
          className="mb-9 hidden items-center gap-3 text-lg font-semibold lg:flex"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-brand text-sm text-white"
          >
            B
          </span>
          {process.env.NEXT_PUBLIC_APP_NAME || "Business Core"}
        </Link>
        <nav aria-label="Principal" className="space-y-1">
          {links
            .filter((link) => !link.permission || auth.can(link.permission))
            .map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${path === href ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            ))}
        </nav>
        <div className="mt-8 space-y-3 border-t pt-5 lg:mt-auto">
          <p className="truncate text-sm font-medium">{auth.user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {auth.user?.email}
          </p>
          <Button
            variant="ghost"
            disabled={loggingOut}
            className="justify-start px-0"
            onClick={async () => {
              setLoggingOut(true);
              try {
                await auth.logout();
              } catch (err) {
                setError(errorMessage(err));
              } finally {
                setLoggingOut(false);
              }
            }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </Button>
          <Notice message={error} error />
        </div>
      </aside>
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-9 lg:py-12"
      >
        {children}
      </main>
    </div>
  );
}
