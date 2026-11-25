import type { Permission } from "./types";
export function hasPermission(
  permissions: readonly Permission[] | null | undefined,
  permission: Permission,
): boolean {
  return Array.isArray(permissions) && permissions.includes(permission);
}

export function togglePermission(
  selected: readonly Permission[],
  permission: Permission,
  checked: boolean,
  catalog: readonly import("./types").PermissionDefinition[],
): Permission[] {
  const result = new Set(selected);
  if (checked) {
    const add = (id: Permission) => {
      if (result.has(id)) return;
      result.add(id);
      catalog.find((p) => p.id === id)?.requires.forEach(add);
    };
    add(permission);
  } else {
    const remove = (id: Permission) => {
      if (!result.delete(id)) return;
      catalog
        .filter((p) => p.requires.includes(id))
        .forEach((p) => remove(p.id));
    };
    remove(permission);
  }
  return [...result];
}
