"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "./auth-provider";
import { api, json, errorMessage } from "@/lib/api";
import { appName } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Loading, Notice } from "@/components/shared/form";

export type AuthMode =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "verify-email"
  | "resend-verification"
  | "invitation";
const titles: Record<AuthMode, string> = {
  login: "Iniciar sesión",
  register: "Crear cuenta de administrador",
  "forgot-password": "Recuperar contraseña",
  "reset-password": "Nueva contraseña",
  "verify-email": "Confirma tu correo",
  "resend-verification": "Reenviar confirmación",
  invitation: "Crear tu cuenta",
};
export function AuthScreen({ mode }: { mode: AuthMode }) {
  const auth = useAuth(),
    router = useRouter();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState("");
  const [token, setToken] = useState(""),
    [pending, setPending] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [complete, setComplete] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(
      null,
    ),
    [invitationReady, setInvitationReady] = useState(false),
    [companyName, setCompanyName] = useState("");
  useEffect(() => {
    let alive = true;
    const incoming =
      new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    setToken(incoming);
    if (incoming)
      window.history.replaceState(null, "", window.location.pathname);
    if (mode === "login" || mode === "register")
      api<{ registrationOpen: boolean }>("/auth/setup", {}, false)
        .then((result) => {
          if (alive) setRegistrationOpen(result.registrationOpen);
        })
        .catch((err) => {
          if (alive) setError(errorMessage(err));
        });
    if (mode === "invitation" && incoming)
      api<{ email: string; companyName: string }>(
        "/invitations/preview",
        json("POST", { token: incoming }),
        false,
      )
        .then((result) => {
          if (alive) {
            setEmail(result.email);
            setCompanyName(result.companyName);
            setInvitationReady(true);
          }
        })
        .catch((err) => {
          if (alive) setError(errorMessage(err));
        });
    return () => {
      alive = false;
    };
  }, [mode]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        await api("/auth/login", json("POST", { email, password }), false);
        await auth.reload();
        router.replace("/panel");
      } else {
        const input =
          mode === "register"
            ? { email, password, name }
            : mode === "invitation"
              ? { email, password, name, invitationToken: token }
              : mode === "reset-password"
                ? { token, password }
                : mode === "verify-email"
                  ? { token }
                  : { email };
        const result = await api<{ message: string }>(
          `/auth/${mode === "invitation" ? "register" : mode}`,
          json("POST", input),
          false,
        );
        setMessage(result.message);
        setComplete(true);
        setPassword("");
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }
  const createsAccount = mode === "register" || mode === "invitation";
  const isEmail = [
    "login",
    "register",
    "invitation",
    "forgot-password",
    "resend-verification",
  ].includes(mode);
  const isPassword = [
    "login",
    "register",
    "invitation",
    "reset-password",
  ].includes(mode);
  const requiresToken = [
    "reset-password",
    "verify-email",
    "invitation",
  ].includes(mode);
  const canShowForm =
    mode === "register"
      ? registrationOpen === true
      : mode === "invitation"
        ? invitationReady
        : true;
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md space-y-7">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-brand text-sm text-white"
          >
            {appName[0]}
          </span>
          {appName}
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl">{titles[mode]}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {mode === "login" ? (
              <p className="text-sm text-muted-foreground">
                Acceso para el equipo de coordinación de {appName}.
              </p>
            ) : null}
            <Notice message={error} error />
            <Notice message={message} />
            {mode === "register" && registrationOpen === null && !error ? (
              <Loading />
            ) : null}
            {mode === "register" && registrationOpen === false ? (
              <p className="text-sm text-muted-foreground">
                La aplicación ya está configurada. Para crear una cuenta,
                solicita una invitación al administrador. Si creaste la
                cuenta inicial, confirma tu correo para iniciar sesión.
              </p>
            ) : null}
            {mode === "register" && registrationOpen === true && !complete ? (
              <p className="text-sm text-muted-foreground">
                Esta cuenta administrará los accesos del equipo de {appName}.
              </p>
            ) : null}
            {mode === "invitation" && invitationReady && !complete ? (
              <p className="text-sm text-muted-foreground">
                Has recibido una invitación de {companyName}.
              </p>
            ) : null}
            {requiresToken && !token ? (
              <p className="text-sm text-muted-foreground">
                Abre el enlace completo que recibiste por correo.
              </p>
            ) : null}
            {!complete && canShowForm ? (
              <form onSubmit={submit} className="space-y-5">
                {createsAccount ? (
                  <Field
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                ) : null}
                {isEmail ? (
                  <Field
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={mode === "invitation"}
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                ) : null}
                {isPassword ? (
                  <div className="space-y-2">
                    <Field
                      label="Contraseña"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      minLength={mode === "login" ? 1 : 12}
                      maxLength={72}
                      required
                    />
                    {mode !== "login" ? (
                      <p className="text-xs text-muted-foreground">
                        Mínimo 12 caracteres. Máximo 72 bytes.
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending || (requiresToken && !token)}
                >
                  {pending
                    ? "Procesando…"
                    : mode === "forgot-password" ||
                        mode === "resend-verification"
                      ? "Enviar enlace"
                      : titles[mode]}
                </Button>
              </form>
            ) : complete ? (
              <Button asChild className="w-full">
                <Link href="/auth/login">Ir a iniciar sesión</Link>
              </Button>
            ) : null}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {mode === "register" &&
              (complete || registrationOpen === false) ? (
                <Link href="/auth/resend-verification" className="underline">
                  Reenviar confirmación
                </Link>
              ) : null}
              {mode === "login" ? (
                <>
                  {registrationOpen ? (
                    <Link href="/auth/register" className="underline">
                      Crear primera cuenta
                    </Link>
                  ) : null}
                  <Link href="/auth/forgot-password" className="underline">
                    Olvidé mi contraseña
                  </Link>
                </>
              ) : (
                <Link href="/auth/login" className="underline">
                  Volver al inicio de sesión
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
