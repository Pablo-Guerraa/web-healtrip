"use client";
import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, Notice } from "@/components/shared/form";
import {
  CollectionContent,
  ListFilter,
  ListPagination,
  ListSort,
  ListToolbar,
  ManagementHeader,
} from "@/components/management/collection";
import {
  ConfirmAction,
  ManagementForm,
} from "@/components/management/management-form";
import { useManagementList } from "@/hooks/use-management-list";
import { useResource } from "@/hooks/use-resource";
import { useMutation } from "@/hooks/use-mutation";
import { api, json } from "@/lib/api";
import { togglePermission } from "@/lib/access";
import type {
  Permission,
  PermissionDefinition,
  RoleDefinition,
} from "@/lib/types";

export default function Page() {
  const { can } = useAuth();
  return can("roles:manage") ? (
    <RolesPanel />
  ) : (
    <Notice
      message="No tienes permiso para gestionar roles y permisos."
      error
    />
  );
}
function RolesPanel() {
  const auth = useAuth();
  const list = useManagementList<RoleDefinition>("/roles", {
    sort: "name",
    filters: { permission: "" },
  });
  const catalog = useResource<PermissionDefinition[]>("/permissions");
  const mutation = useMutation();
  const [message, setMessage] = useState(""),
    [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RoleDefinition | null>(null),
    [deleting, setDeleting] = useState<RoleDefinition | null>(null);
  const [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [selected, setSelected] = useState<Permission[]>([]);
  function edit(role: RoleDefinition | null) {
    mutation.reset();
    setEditing(role);
    setName(role?.name || "");
    setDescription(role?.description || "");
    setSelected(role?.permissions || []);
    setOpen(true);
  }
  async function save() {
    setMessage("");
    if (
      await mutation.run(async () => {
        await api(
          editing ? `/roles/${editing.id}` : "/roles",
          json(editing ? "PATCH" : "POST", {
            name,
            description,
            permissions: selected,
          }),
        );
      })
    ) {
      setOpen(false);
      list.reload();
      setMessage(
        editing
          ? "Rol actualizado"
          : "Rol creado. Ya puedes asignarlo desde Equipo.",
      );
      if (editing?.id === auth.user?.role) await auth.reload();
    }
  }
  async function remove() {
    if (!deleting) return;
    setMessage("");
    if (
      await mutation.run(async () => {
        await api(`/roles/${deleting.id}`, { method: "DELETE" });
      })
    ) {
      setDeleting(null);
      list.reload();
      setMessage("Rol eliminado");
    }
  }
  const definitions = catalog.data || [];
  const groups = [
    ...new Set(definitions.map((permission) => permission.group)),
  ];
  const createButton = (
    <Button
      disabled={catalog.loading || !definitions.length || mutation.pending}
      onClick={() => edit(null)}
    >
      <Plus size={16} aria-hidden="true" />
      Crear rol
    </Button>
  );
  return (
    <div className="space-y-7">
      <ManagementHeader
        title="Roles y permisos"
        description="Define qué puede hacer cada rol y asígnalo a tus usuarios."
        action={createButton}
      />
      <Notice message={message} />
      <ListToolbar
        label="Buscar roles"
        search={list.search}
        onSearch={list.setSearch}
        placeholder="Nombre o descripción del rol"
        filtered={list.filtered}
        onReset={list.reset}
      >
        <ListFilter
          label="Permiso incluido"
          value={list.query.filters.permission}
          onChange={(value) => list.setFilter("permission", value)}
          options={[
            { value: "", label: "Todos los permisos" },
            ...definitions.map((permission) => ({
              value: permission.id,
              label: permission.label,
            })),
          ]}
        />
        <ListSort
          sort={list.query.sort}
          direction={list.query.direction}
          onChange={list.setSort}
          options={[
            { value: "name:asc", label: "Nombre: A–Z" },
            { value: "name:desc", label: "Nombre: Z–A" },
            { value: "users:desc", label: "Más usuarios" },
            { value: "users:asc", label: "Menos usuarios" },
            { value: "permissions:desc", label: "Más permisos" },
            { value: "permissions:asc", label: "Menos permisos" },
          ]}
        />
      </ListToolbar>
      <CollectionContent
        loading={list.loading || catalog.loading}
        error={list.error || catalog.error}
        total={list.data.total}
        filtered={list.filtered}
        onRetry={() => {
          list.reload();
          catalog.reload();
        }}
        onReset={list.reset}
        emptyTitle="Todavía no hay roles"
        emptyDescription="Crea un rol y selecciona los permisos que necesitan sus usuarios."
        emptyAction={createButton}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {list.data.items.map((role) => (
            <article
              key={role.id}
              className="flex min-w-0 flex-col gap-5 rounded-xl border bg-background p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <h2 className="break-words text-lg font-semibold">
                    {role.name}
                  </h2>
                  <p className="break-words text-sm text-muted-foreground">
                    {role.description || "Sin descripción"}
                  </p>
                </div>
                <ShieldCheck
                  className="shrink-0 text-brand"
                  size={22}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {role.userCount}{" "}
                  {role.userCount === 1 ? "usuario" : "usuarios"}
                </Badge>
                <Badge variant="secondary">
                  {role.permissions.length}{" "}
                  {role.permissions.length === 1 ? "permiso" : "permisos"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {definitions.find((item) => item.id === permission)
                      ?.label || permission}
                  </span>
                ))}
                {!role.permissions.length ? (
                  <p className="text-sm text-muted-foreground">
                    Perfil y sesiones propias.
                  </p>
                ) : null}
              </div>
              <div className="mt-auto flex gap-2">
                <Button
                  variant="outline"
                  disabled={mutation.pending}
                  onClick={() => edit(role)}
                  aria-label={`Editar rol ${role.name}`}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  disabled={mutation.pending || role.userCount > 0}
                  onClick={() => {
                    mutation.reset();
                    setDeleting(role);
                  }}
                  aria-label={`Eliminar rol ${role.name}`}
                >
                  Eliminar
                </Button>
              </div>
            </article>
          ))}
        </div>
      </CollectionContent>
      {!list.error && !catalog.error ? (
        <ListPagination
          data={list.data}
          disabled={list.loading || catalog.loading}
          onPage={list.setPage}
          onPageSize={list.setPageSize}
          label="roles"
        />
      ) : null}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!mutation.pending) setOpen(value);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogTitle className="text-xl font-semibold">
            {editing ? "Editar rol" : "Crear rol"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Todos los usuarios conservan el acceso a su perfil, contraseña y
            sesiones.
          </DialogDescription>
          <ManagementForm
            onSubmit={save}
            pending={mutation.pending}
            error={mutation.error}
            submitLabel={editing ? "Guardar cambios" : "Crear rol"}
            onCancel={() => setOpen(false)}
          >
            <Field
              label="Nombre del rol"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={80}
              placeholder="Por ejemplo, Auxiliar"
            />
            <Field
              label="Descripción (opcional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={300}
            />
            <div className="space-y-4">
              {groups.map((group) => (
                <fieldset
                  key={group}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <legend className="px-1 text-sm font-semibold">
                    {group}
                  </legend>
                  {definitions
                    .filter((permission) => permission.group === group)
                    .map((permission) => (
                      <label
                        key={permission.id}
                        className="flex cursor-pointer items-start gap-3 rounded-md p-1"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
                          checked={selected.includes(permission.id)}
                          onChange={(event) =>
                            setSelected((current) =>
                              togglePermission(
                                current,
                                permission.id,
                                event.target.checked,
                                definitions,
                              ),
                            )
                          }
                        />
                        <span className="min-w-0 space-y-1">
                          <span className="block text-sm font-medium">
                            {permission.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {permission.description}
                          </span>
                        </span>
                      </label>
                    ))}
                </fieldset>
              ))}
            </div>
            {editing ? (
              <p className="text-xs text-muted-foreground">
                Si cambias los permisos, los usuarios con este rol tendrán que
                iniciar sesión nuevamente.
              </p>
            ) : null}
          </ManagementForm>
        </DialogContent>
      </Dialog>
      <ConfirmAction
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Eliminar rol"
        description={`Se eliminará el rol ${deleting?.name || "seleccionado"}. Solo es posible si no tiene usuarios ni invitaciones asociadas.`}
        confirmLabel="Eliminar rol"
        pending={mutation.pending}
        error={mutation.error}
      />
    </div>
  );
}
