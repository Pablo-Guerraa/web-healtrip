"use client";
import Link from "next/link";
import { ArrowUpRight, Users, Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
export default function Page() {
  const { user, can } = useAuth();
  if (!user) return null;
  const actions = [
    {
      href: "/panel/roles",
      label: "Roles y permisos",
      description: "Define qué puede hacer cada rol",
      icon: ShieldCheck,
      show: can("roles:manage"),
    },
    {
      href: "/panel/users",
      label: "Gestionar usuarios",
      description: "Invitaciones y accesos",
      icon: Users,
      show: can("users:read"),
    },
    {
      href: "/panel/settings",
      label: "Configuración",
      description: "Perfil, seguridad y preferencias",
      icon: Settings,
      show: true,
    },
  ];
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{user.roleName}</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Hola, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Tu espacio de trabajo está listo.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions
          .filter((a) => a.show)
          .map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href}>
              <Card className="h-full shadow-none transition-colors hover:border-brand">
                <CardContent className="space-y-7">
                  <div className="flex justify-between">
                    <Icon size={23} className="text-brand" aria-hidden="true" />
                    <ArrowUpRight
                      size={18}
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-semibold">{label}</h2>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
