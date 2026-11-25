"use client";
import { useId, type ReactNode } from "react";
import {
  Search,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/shared/form";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { PageResult } from "@/lib/types";

export function ManagementHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}
export function ListToolbar({
  search,
  onSearch,
  placeholder,
  label,
  filtered,
  onReset,
  children,
}: {
  search: string;
  onSearch: (value: string) => void;
  placeholder: string;
  label: string;
  filtered: boolean;
  onReset: () => void;
  children?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-[1_1_240px] space-y-2">
        <label className="text-sm font-medium" htmlFor={id}>
          {label}
        </label>
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-3 text-muted-foreground"
          />
          <Input
            id={id}
            type="search"
            value={search}
            maxLength={100}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
      </div>
      {children}
      {filtered ? (
        <Button variant="ghost" onClick={onReset}>
          <RotateCcw size={15} aria-hidden="true" />
          Limpiar filtros
        </Button>
      ) : null}
    </div>
  );
}
export function ListFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div className="min-w-0 flex-[1_1_150px] sm:max-w-56">
      <SelectField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>
    </div>
  );
}
export function CollectionContent({
  loading,
  error,
  total,
  filtered,
  onRetry,
  onReset,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: {
  loading: boolean;
  error: string;
  total: number;
  filtered: boolean;
  onRetry: () => void;
  onReset: () => void;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}) {
  if (loading)
    return (
      <div
        role="status"
        className="rounded-xl border bg-background p-10 text-center text-sm text-muted-foreground"
      >
        Cargando resultados…
      </div>
    );
  if (error)
    return (
      <div
        role="alert"
        className="space-y-4 rounded-xl border bg-background p-8 text-center"
      >
        <p className="text-sm">{error}</p>
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  if (!total)
    return (
      <div className="space-y-4 rounded-xl border border-dashed bg-background p-8 text-center">
        <p className="font-medium">
          {filtered ? "Sin resultados" : emptyTitle}
        </p>
        <p className="text-sm text-muted-foreground">
          {filtered
            ? "Prueba otra búsqueda o cambia los filtros."
            : emptyDescription}
        </p>
        {filtered ? (
          <Button variant="outline" onClick={onReset}>
            Limpiar filtros
          </Button>
        ) : (
          emptyAction
        )}
      </div>
    );
  return <>{children}</>;
}
export interface Column<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  sort?: string;
  className?: string;
}
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  label,
  sort,
  direction,
  onSort,
  mobileRender,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  label: string;
  sort: string;
  direction: "asc" | "desc";
  onSort: (key: string) => void;
  mobileRender?: (row: T) => ReactNode;
}) {
  function sortControl(column: Column<T>) {
    const sortKey = column.sort;
    if (!sortKey) return column.label;
    const active = sortKey === sort;
    const Icon = active
      ? direction === "asc"
        ? ArrowUp
        : ArrowDown
      : ArrowUpDown;
    return (
      <button
        type="button"
        className="inline-flex min-h-10 items-center gap-2 rounded px-1 focus-visible:outline-2 focus-visible:outline-ring"
        onClick={() => onSort(sortKey)}
        aria-label={`Ordenar por ${column.label.toLowerCase()}`}
        aria-pressed={active}
        title={
          active
            ? direction === "asc"
              ? "Orden ascendente"
              : "Orden descendente"
            : "Ordenar"
        }
      >
        <span>{column.label}</span>
        <Icon size={14} aria-hidden="true" />
      </button>
    );
  }
  return (
    <>
      <div
        className={`${mobileRender ? "hidden md:block " : ""}overflow-hidden rounded-xl border bg-background`}
      >
        <Table aria-label={label}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const active = column.sort === sort;
                return (
                  <TableHead
                    key={column.id}
                    className={column.className}
                    scope="col"
                    aria-sort={
                      column.sort
                        ? active
                          ? direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                  >
                    {sortControl(column)}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {mobileRender && columns.some((column) => column.sort) ? (
        <div
          role="group"
          aria-label={`Orden de ${label.toLowerCase()}`}
          className="flex flex-wrap items-center gap-4 rounded-lg border bg-background px-3 text-sm md:hidden"
        >
          {columns
            .filter((column) => column.sort)
            .map((column) => (
              <span key={column.id}>{sortControl(column)}</span>
            ))}
        </div>
      ) : null}
      {mobileRender ? (
        <ul aria-label={label} className="space-y-3 md:hidden">
          {rows.map((row) => (
            <li
              key={rowKey(row)}
              className="space-y-4 rounded-xl border bg-background p-4"
            >
              {mobileRender(row)}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
export function ListPagination({
  data,
  disabled,
  onPage,
  onPageSize,
  label,
}: {
  data: Pick<PageResult<unknown>, "page" | "pageSize" | "total" | "totalPages">;
  disabled: boolean;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
  label: string;
}) {
  const start = data.total ? (data.page - 1) * data.pageSize + 1 : 0;
  const end = Math.min(data.page * data.pageSize, data.total);
  return (
    <nav
      aria-label={`Paginación de ${label}`}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <p role="status" className="text-sm text-muted-foreground">
        {start}–{end} de {data.total} resultados
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span>Por página</span>
          <select
            aria-label={`Resultados por página de ${label}`}
            className="h-10 rounded-md border bg-background px-2"
            value={data.pageSize}
            disabled={disabled}
            onChange={(e) => onPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={`Página anterior de ${label}`}
            disabled={disabled || data.page <= 1}
            onClick={() => onPage(data.page - 1)}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </Button>
          <span className="text-sm">
            {data.page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Página siguiente de ${label}`}
            disabled={disabled || data.page >= data.totalPages}
            onClick={() => onPage(data.page + 1)}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

export function ListSort({
  sort,
  direction,
  onChange,
  options,
}: {
  sort: string;
  direction: "asc" | "desc";
  onChange: (sort: string, direction: "asc" | "desc") => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <ListFilter
      label="Ordenar"
      value={`${sort}:${direction}`}
      options={options}
      onChange={(value) => {
        const [column, order] = value.split(":");
        onChange(column, order === "desc" ? "desc" : "asc");
      }}
    />
  );
}
