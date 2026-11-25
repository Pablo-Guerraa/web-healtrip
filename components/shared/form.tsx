"use client";
import { useId, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function Field({
  label,
  description,
  error,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  description?: string;
  error?: string;
}) {
  const generatedId = useId(),
    id = props.id || generatedId;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...props}
        id={id}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={
          [
            props["aria-describedby"],
            description ? `${id}-description` : "",
            error ? `${id}-error` : "",
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {description ? (
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
export function SelectField({
  label,
  children,
  ...props
}: React.ComponentProps<"select"> & { label: string; children: ReactNode }) {
  const generatedId = useId(),
    id = props.id || generatedId;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        {...props}
        id={id}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-60"
      >
        {children}
      </select>
    </div>
  );
}
export function Notice({
  message,
  error = false,
}: {
  message: string;
  error?: boolean;
}) {
  return message ? (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-lg px-4 py-3 text-sm ${error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-900"}`}
    >
      {message}
    </p>
  ) : null;
}
export function Loading() {
  return (
    <div role="status" className="p-8 text-sm text-muted-foreground">
      Cargando…
    </div>
  );
}
