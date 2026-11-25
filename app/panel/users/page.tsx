"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, Notice, SelectField } from "@/components/shared/form";
import {
  CollectionContent,
  DataTable,
  ListFilter,
  ListPagination,
  ListToolbar,
  ManagementHeader,
  type Column,
} from "@/components/management/collection";
import { ManagementForm } from "@/components/management/management-form";
import { useManagementList } from "@/hooks/use-management-list";
import { useMutation } from "@/hooks/use-mutation";
import { useResource } from "@/hooks/use-resource";
import { api, json } from "@/lib/api";
import type { RoleOption, UserSummary } from "@/lib/types";

export default function Page() {
  const { can } = useAuth();
  return can("users:read") ? (
    <UsersPanel />
  ) : (
    <Notice message="No tienes acceso a la sección Equipo." error />
  );
}
function UserStatus({ user }: { user: UserSummary }) {
  return (
    <Badge
      variant={
        !user.active ? "secondary" : user.emailConfirmed ? "success" : "warning"
      }
    >
      {!user.active
        ? "Inactivo"
        : user.emailConfirmed
          ? "Activo"
          : "Por confirmar"}
    </Badge>
  );
}
function UsersPanel() {
  const auth = useAuth(),
    canManage = auth.can("users:manage");
  const list = useManagementList<UserSummary>("/users", {
    sort: "name",
    filters: { role: "", status: "" },
  });
  const roleOptions = useResource<RoleOption[]>("/roles/options");
  const mutation = useMutation();
  const [message, setMessage] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false),
    [editing, setEditing] = useState<UserSummary | null>(null);
  const [email, setEmail] = useState(""),
    [inviteRole, setInviteRole] = useState("");
  const [editRole, setEditRole] = useState(""),
    [editActive, setEditActive] = useState(true);
  const assignable = (roleOptions.data || []).filter((role) => role.canAssign);
  function openInvite() {
    mutation.reset();
    setEmail("");
    setInviteRole("");
    setInviteOpen(true);
  }
  async function invite() {
    setMessage("");
    if (
      await mutation.run(async () => {
        await api("/invitations", json("POST", { email, role: inviteRole }));
      })
    ) {
      setInviteOpen(false);
      setMessage("Invitación enviada");
    }
  }
  async function update() {
    if (!editing) return;
    setMessage("");
    if (
      await mutation.run(async () => {
        await api(
          `/users/${editing.id}`,
          json("PATCH", { role: editRole, active: editActive }),
        );
      })
    ) {
      setEditing(null);
      setMessage("Acceso actualizado");
      list.reload();
      if (editing.id === auth.user?.id) await auth.reload();
    }
  }
  const editButton = (user: UserSummary) =>
    canManage && user.canManage ? (
      <Button
        variant="ghost"
        disabled={mutation.pending}
        onClick={() => {
          mutation.reset();
          setEditing(user);
          setEditRole(user.role);
          setEditActive(user.active);
        }}
      >
        Editar<span className="sr-only"> a {user.name}</span>
      </Button>
    ) : null;
  const identity = (user: UserSummary) => (
    <div className="min-w-0">
      <p className="break-words font-medium">
        {user.name}
        {user.id === auth.user?.id ? " (tú)" : ""}
      </p>
      <p className="break-all text-xs text-muted-foreground">{user.email}</p>
    </div>
  );
  const columns: Column<UserSummary>[] = [
    {
      id: "name",
      label: "Usuario",
      sort: "name",
      render: identity,
      className: "pl-5",
    },
    { id: "role", label: "Rol", sort: "role", render: (user) => user.roleName },
    {
      id: "status",
      label: "Estado",
      sort: "status",
      render: (user) => <UserStatus user={user} />,
    },
    ...(canManage
      ? [{ id: "actions", label: "Acciones", render: editButton }]
      : []),
  ];
  const inviteButton = canManage ? (
    <Button
      onClick={openInvite}
      disabled={roleOptions.loading || !assignable.length}
    >
      Invitar al equipo
    </Button>
  ) : null;
  return (
    <div className="space-y-7">
      <ManagementHeader
        title="Equipo"
        description="Administra quién tiene acceso al panel de Healtrip."
        action={inviteButton}
      />
      <Notice message={message} />
      {roleOptions.error ? (
        <div className="space-y-2">
          <Notice message={roleOptions.error} error />
          <Button variant="outline" onClick={roleOptions.reload}>
            Recargar roles
          </Button>
        </div>
      ) : null}
      <ListToolbar
        label="Buscar en el equipo"
        search={list.search}
        onSearch={list.setSearch}
        placeholder="Nombre o correo electrónico"
        filtered={list.filtered}
        onReset={list.reset}
      >
        <ListFilter
          label="Rol"
          value={list.query.filters.role}
          onChange={(value) => list.setFilter("role", value)}
          options={[
            { value: "", label: "Todos los roles" },
            ...(roleOptions.data || []).map((role) => ({
              value: role.id,
              label: role.name,
            })),
          ]}
        />
        <ListFilter
          label="Estado"
          value={list.query.filters.status}
          onChange={(value) => list.setFilter("status", value)}
          options={[
            { value: "", label: "Todos los estados" },
            { value: "active", label: "Activos" },
            { value: "pending", label: "Por confirmar" },
            { value: "inactive", label: "Inactivos" },
          ]}
        />
      </ListToolbar>
      <CollectionContent
        {...list}
        total={list.data.total}
        onRetry={list.reload}
        onReset={list.reset}
        emptyTitle="Todavía no hay cuentas en el equipo"
        emptyDescription="Invita a una persona para darle acceso al panel de Healtrip."
        emptyAction={inviteButton}
      >
        <DataTable
          rows={list.data.items}
          columns={columns}
          rowKey={(user) => user.id}
          label="Equipo"
          sort={list.query.sort}
          direction={list.query.direction}
          onSort={list.setSort}
          mobileRender={(user) => (
            <>
              {identity(user)}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="break-words text-sm">{user.roleName}</span>
                <UserStatus user={user} />
              </div>
              {editButton(user)}
            </>
          )}
        />
      </CollectionContent>
      {!list.error ? (
        <ListPagination
          data={list.data}
          disabled={list.loading}
          onPage={list.setPage}
          onPageSize={list.setPageSize}
          label="usuarios"
        />
      ) : null}
      <Dialog
        open={inviteOpen}
        onOpenChange={(value) => {
          if (!mutation.pending) setInviteOpen(value);
        }}
      >
        <DialogContent>
          <DialogTitle className="text-lg font-semibold">
            Invitar al equipo
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Recibirá un enlace válido por 7 días.
          </DialogDescription>
          <ManagementForm
            onSubmit={invite}
            pending={mutation.pending}
            error={mutation.error}
            submitLabel="Enviar invitación"
            pendingLabel="Enviando…"
            onCancel={() => setInviteOpen(false)}
          >
            <Field
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
            />
            <SelectField
              label="Rol"
              value={inviteRole}
              onChange={(event) => setInviteRole(event.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona un rol
              </option>
              {assignable.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </SelectField>
          </ManagementForm>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(value) => {
          if (!value && !mutation.pending) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogTitle className="text-lg font-semibold">
            Editar acceso
          </DialogTitle>
          <DialogDescription className="break-words text-sm text-muted-foreground">
            {editing?.name} · {editing?.email}
          </DialogDescription>
          <ManagementForm
            onSubmit={update}
            pending={mutation.pending}
            error={mutation.error}
            submitLabel="Guardar cambios"
            onCancel={() => setEditing(null)}
          >
            <SelectField
              label="Rol"
              value={editRole}
              onChange={(event) => setEditRole(event.target.value)}
              required
            >
              {assignable.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Estado"
              value={editActive ? "active" : "inactive"}
              onChange={(event) =>
                setEditActive(event.target.value === "active")
              }
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </SelectField>
            <p className="text-xs text-muted-foreground">
              Al cambiar el rol o desactivar al usuario se cerrarán sus
              sesiones.
            </p>
          </ManagementForm>
        </DialogContent>
      </Dialog>
    </div>
  );
}
