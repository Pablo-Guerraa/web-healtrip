"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function ManagementForm({
  onSubmit,
  pending,
  error,
  submitLabel,
  pendingLabel = "Guardando…",
  onCancel,
  children,
  destructive = false,
}: {
  onSubmit: () => Promise<void>;
  pending: boolean;
  error: string;
  submitLabel: string;
  pendingLabel?: string;
  onCancel: () => void;
  children?: ReactNode;
  destructive?: boolean;
}) {
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!pending) void onSubmit();
      }}
      className="space-y-5"
      aria-busy={pending}
    >
      <fieldset disabled={pending} className="min-w-0 space-y-5">
        {children}
      </fieldset>
      {error ? (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant={destructive ? "destructive" : "default"}
          disabled={pending}
        >
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
export function ConfirmAction({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  pending,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel: string;
  pending: boolean;
  error: string;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !pending) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {description}
        </DialogDescription>
        <ManagementForm
          pending={pending}
          error={error}
          onSubmit={onConfirm}
          onCancel={onClose}
          submitLabel={confirmLabel}
          pendingLabel="Procesando…"
          destructive
        />
      </DialogContent>
    </Dialog>
  );
}
