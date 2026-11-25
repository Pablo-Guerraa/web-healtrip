"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Field, Notice } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, errorMessage, json } from "@/lib/api";
import type { Session } from "@/lib/types";
import {
  ActivityHistory,
  CompanySettings,
} from "@/components/settings/company-settings";

export default function Page() {
  const auth = useAuth();
  const [revision, setRevision] = useState(0);
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Tu perfil y la seguridad de tu cuenta.
        </p>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Profile key={auth.user?.id} />
        <PasswordForm />
      </div>
      <SessionList />
      {auth.can("settings:read") ? (
        <CompanySettings
          canEdit={auth.can("settings:manage")}
          onUpdated={() => setRevision((value) => value + 1)}
        />
      ) : null}
      {auth.can("audit:read") ? (
        <ActivityHistory
          key={revision}
          timeZone={auth.user?.timeZone || "UTC"}
        />
      ) : null}
    </div>
  );
}
function Profile() {
  const { user, reload } = useAuth();
  const [name, setName] = useState(user?.name || ""),
    [timeZone, setTimeZone] = useState(user?.timeZone || "UTC");
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await api("/auth/profile", json("PATCH", { name, timeZone }));
      setMessage("Perfil actualizado");
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          <h2>Mi perfil</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={submit}>
          <Field
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={100}
            autoComplete="name"
            required
          />
          <Field
            label="Correo"
            value={user?.email || ""}
            type="email"
            disabled
          />
          <Field
            label="Zona horaria"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            maxLength={100}
            required
            placeholder="America/Bogota"
          />
          <Notice message={error} error />
          <Notice message={message} />
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar perfil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
function PasswordForm() {
  const { reload } = useAuth();
  const [currentPassword, setCurrent] = useState(""),
    [password, setPassword] = useState(""),
    [repeat, setRepeat] = useState(""),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (repeat !== password) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }
    setPending(true);
    try {
      await api(
        "/auth/change-password",
        json("POST", { currentPassword, password }),
      );
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          <h2>Contraseña</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <Field
            label="Contraseña actual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Field
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={12}
            maxLength={72}
            autoComplete="new-password"
            required
          />
          <Field
            label="Repetir nueva contraseña"
            type="password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            minLength={12}
            maxLength={72}
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-muted-foreground">
            Mínimo 12 caracteres. Al cambiarla, se cerrarán todas tus sesiones.
          </p>
          <Notice message={error} error />
          <Button type="submit" disabled={pending}>
            {pending ? "Actualizando…" : "Cambiar contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
function SessionList() {
  const { user, reload } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  useEffect(() => {
    let alive = true;
    api<Session[]>("/auth/sessions")
      .then((rows) => {
        if (alive) setSessions(rows);
      })
      .catch((err) => {
        if (alive) setError(errorMessage(err));
      });
    return () => {
      alive = false;
    };
  }, []);
  async function revoke(session: Session) {
    setPending(true);
    setError("");
    try {
      await api(`/auth/sessions/${session.id}`, { method: "DELETE" });
      if (session.current) await reload();
      else
        setSessions((previous) => previous.filter((s) => s.id !== session.id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Sesiones abiertas</h2>
      <Notice message={error} error />
      <div className="divide-y rounded-xl border bg-background">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div>
              <p className="text-sm font-medium">
                {session.current ? "Esta sesión" : "Otra sesión"}
              </p>
              <p className="text-xs text-muted-foreground">
                Última actividad:{" "}
                {new Intl.DateTimeFormat("es-CO", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: user?.timeZone || "UTC",
                }).format(new Date(session.lastSeenAt))}
              </p>
            </div>
            <Button
              variant="ghost"
              disabled={pending}
              onClick={() => void revoke(session)}
            >
              Cerrar
              <span className="sr-only"> sesión del {session.createdAt}</span>
            </Button>
          </div>
        ))}
        {!sessions.length ? (
          <p className="p-4 text-sm text-muted-foreground">
            No hay sesiones para mostrar.
          </p>
        ) : null}
      </div>
    </section>
  );
}
