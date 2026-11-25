"use client";
import Link from "next/link";
import { ArrowUpRight, Settings, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Loading, Notice } from "@/components/shared/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useResource } from "@/hooks/use-resource";
import type { CoordinatedService } from "@/lib/types";

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
      label: "Equipo",
      description: "Invitaciones y accesos del equipo de coordinación",
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
      <header className="space-y-3">
        <p className="text-sm font-medium text-brand">
          {user.roleName} · Medellín, Colombia
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Hola, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Panel de coordinación de turismo médico para pacientes internacionales.
        </p>
      </header>
      {can("settings:read") ? <CoordinatedServices /> : null}
      <section aria-labelledby="panel-access" className="space-y-4">
        <h2 id="panel-access" className="text-lg font-semibold">
          Administración del panel
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions
            .filter((action) => action.show)
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
                      <h3 className="font-semibold">{label}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

function CoordinatedServices() {
  const { data, error, loading, reload } = useResource<{
    services?: CoordinatedService[];
  }>("/settings");

  if (!loading && !error && !data?.services?.length) return null;

  return (
    <section aria-labelledby="coordinated-services" className="space-y-4">
      <h2 id="coordinated-services" className="text-lg font-semibold">
        Servicios que coordinamos
      </h2>
      {loading ? <Loading /> : null}
      {error ? (
        <div className="space-y-3">
          <Notice message="No se pudieron cargar los servicios de Healtrip." error />
          <Button variant="outline" onClick={reload}>
            Reintentar
          </Button>
        </div>
      ) : null}
      {!loading && data?.services?.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.services.map((service) => (
            <li key={service.id}>
              <Card className="h-full shadow-none">
                <CardContent className="space-y-3">
                  <Badge variant="secondary" className="px-2.5">
                    {service.modality === "virtual" ? "Virtual" : "Presencial"}
                  </Badge>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
