"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Field, Loading, Notice } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, errorMessage, json } from "@/lib/api";
import type { AuditEvent, CompanySettings as Settings } from "@/lib/types";

export function CompanySettings({
  canEdit,
  onUpdated,
}: {
  canEdit: boolean;
  onUpdated: () => void;
}) {
  const [settings, setSettings] = useState<Settings | null>(null),
    [loadError, setLoadError] = useState("");
  useEffect(() => {
    let alive = true;
    api<Settings>("/settings")
      .then((value) => {
        if (alive) setSettings(value);
      })
      .catch((err) => {
        if (alive) setLoadError(errorMessage(err));
      });
    return () => {
      alive = false;
    };
  }, []);
  if (loadError) return <Notice message={loadError} error />;
  if (!settings) return <Loading />;
  return (
    <section className="space-y-6">
      {canEdit ? (
        <CompanyForm
          initial={settings}
          onSave={(value) => {
            setSettings(value);
            onUpdated();
          }}
        />
      ) : (
        <Card className="max-w-2xl shadow-none">
          <CardHeader>
            <CardTitle>
              <h2>Datos de la empresa</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{settings.name}</p>
            <p className="text-sm text-muted-foreground">
              Zona horaria: {settings.timeZone}
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
function CompanyForm({
  initial,
  onSave,
}: {
  initial: Settings;
  onSave: (value: Settings) => void;
}) {
  const [name, setName] = useState(initial.name),
    [timeZone, setTimeZone] = useState(initial.timeZone),
    [logoUrl, setLogoUrl] = useState(initial.logoUrl || "");
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const updated = await api<Settings>(
        "/settings",
        json("PATCH", { name, timeZone, logoUrl: logoUrl || null }),
      );
      onSave(updated);
      setMessage("Configuración guardada");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }
  return (
    <Card className="max-w-2xl shadow-none">
      <CardHeader>
        <CardTitle>
          <h2>Datos de la empresa</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <Field
            label="Nombre de la empresa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
          <Field
            label="Zona horaria de la empresa"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            maxLength={100}
            required
            placeholder="America/Bogota"
          />
          <Field
            label="URL del logo (opcional)"
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            maxLength={2048}
            placeholder="https://…"
          />
          <Notice message={error} error />
          <Notice message={message} />
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar configuración"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
const actionNames: Record<string, string> = {
  "setup.completed": "Administrador inicial creado",
  "role.created": "Rol creado",
  "role.updated": "Rol y permisos actualizados",
  "role.deleted": "Rol eliminado",
  "settings.updated": "Configuración actualizada",
  "user.updated": "Acceso de usuario actualizado",
  "invitation.created": "Invitación enviada",
  "invitation.revoked": "Invitación cancelada",
  "invitation.accepted": "Cuenta creada desde invitación",
  "settings.initialized": "Configuración inicial creada",
};
export function ActivityHistory({ timeZone }: { timeZone: string }) {
  const [events, setEvents] = useState<AuditEvent[]>([]),
    [error, setError] = useState(""),
    [offset, setOffset] = useState(0),
    [pending, setPending] = useState(true);
  const load = useCallback(async () => {
    setPending(true);
    setError("");
    try {
      setEvents(await api<AuditEvent[]>(`/audit?offset=${offset}`));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }, [offset]);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <section className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Actividad reciente</h2>
      <Notice message={error} error />
      <div className="divide-y rounded-xl border bg-background">
        {events.map((event) => (
          <div key={event.id} className="space-y-1 p-4">
            <p className="text-sm font-medium">
              {actionNames[event.action] || event.action}
            </p>
            <p className="text-xs text-muted-foreground">
              {event.actorName} ·{" "}
              {new Intl.DateTimeFormat("es-CO", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone,
              }).format(new Date(event.createdAt))}
            </p>
          </div>
        ))}
        {!events.length ? (
          <p className="p-4 text-sm text-muted-foreground">
            {pending ? "Cargando…" : "Sin actividad"}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          disabled={!offset || pending}
          onClick={() => setOffset(Math.max(0, offset - 50))}
        >
          Anterior
        </Button>
        <Button
          variant="ghost"
          disabled={events.length < 50 || pending}
          onClick={() => setOffset(offset + 50)}
        >
          Siguiente
        </Button>
      </div>
    </section>
  );
}
