import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import {
  CollectionContent,
  DataTable,
} from "../components/management/collection";
import { ManagementForm } from "../components/management/management-form";
import { Field } from "../components/shared/form";

test("loading, error and empty states hide old records and offer an appropriate recovery action", () => {
  const props = {
    loading: false,
    error: "",
    total: 0,
    filtered: false,
    onRetry: () => {},
    onReset: () => {},
    emptyTitle: "No users",
    emptyDescription: "Invite someone",
    children: h("span", null, "Stale secret record"),
  };
  const failure = render(
    h(CollectionContent, { ...props, total: 5, error: "Could not load" }),
  );
  assert.match(failure, /role="alert"/);
  assert.match(failure, /Reintentar/);
  assert.doesNotMatch(failure, /Stale secret record/);
  const pending = render(
    h(CollectionContent, { ...props, total: 5, loading: true }),
  );
  assert.match(pending, /role="status"/);
  assert.doesNotMatch(pending, /Stale secret record/);
  const empty = render(h(CollectionContent, { ...props, filtered: true }));
  assert.match(empty, /Sin resultados/);
  assert.match(empty, /Limpiar filtros/);
  assert.doesNotMatch(empty, /Stale secret record/);
});
test("busy forms disable inputs and submission, with a non-submitting cancel action", () => {
  const html = render(
    h(ManagementForm, {
      pending: true,
      error: "",
      onSubmit: async () => {},
      onCancel: () => {},
      submitLabel: "Save",
      children: h(Field, { label: "Email", type: "email" }),
    }),
  );
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /<fieldset disabled=""/);
  assert.match(html, /type="button" disabled=""/);
  assert.match(html, /type="submit"[^>]*disabled=""/);
});
test("table sorting is announced and field errors are associated with their input", () => {
  const table = render(
    h(DataTable<{ id: string }>, {
      rows: [{ id: "one" }],
      columns: [
        { id: "name", label: "Nombre", sort: "name", render: (row) => row.id },
      ],
      rowKey: (row) => row.id,
      label: "Users",
      sort: "name",
      direction: "desc",
      onSort: () => {},
    }),
  );
  assert.match(table, /aria-sort="descending"/);
  assert.match(table, /Ordenar por nombre/);
  const field = render(
    h(Field, {
      label: "Correo",
      id: "email",
      error: "Invalid email",
      description: "Use your email",
    }),
  );
  assert.match(field, /aria-invalid="true"/);
  assert.match(field, /aria-describedby="email-description email-error"/);
  assert.match(field, /id="email-error"/);
});
