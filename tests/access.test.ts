import assert from "node:assert/strict";
import { test } from "node:test";
import { hasPermission } from "../lib/access";
test("permissions fail closed while bootstrap is unavailable or incomplete", () => {
  assert.equal(hasPermission(undefined, "users:manage"), false);
  assert.equal(hasPermission(null, "users:manage"), false);
  assert.equal(hasPermission([], "users:manage"), false);
  assert.equal(hasPermission(["settings:read"], "users:manage"), false);
  assert.equal(hasPermission(["users:manage"], "users:manage"), true);
});

test("granting a management permission also grants its read prerequisite; removing read removes management", async () => {
  const { togglePermission } = await import("../lib/access");
  const catalog: import("../lib/types").PermissionDefinition[] = [
    {
      id: "settings:read",
      group: "Empresa",
      label: "Read",
      description: "",
      requires: [],
    },
    {
      id: "settings:manage",
      group: "Empresa",
      label: "Manage",
      description: "",
      requires: ["settings:read"],
    },
    {
      id: "roles:manage",
      group: "Accesos",
      label: "Roles",
      description: "",
      requires: [],
    },
  ];
  const selected = togglePermission(
    ["roles:manage"],
    "settings:manage",
    true,
    catalog,
  );
  assert.deepEqual(
    new Set(selected),
    new Set(["roles:manage", "settings:manage", "settings:read"]),
  );
  assert.deepEqual(
    togglePermission(selected, "settings:read", false, catalog),
    ["roles:manage"],
  );
  assert.deepEqual(togglePermission([], "roles:manage", true, catalog), [
    "roles:manage",
  ]);
});
