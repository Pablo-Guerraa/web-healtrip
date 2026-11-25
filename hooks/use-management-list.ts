"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useResource } from "./use-resource";
import type { PageResult } from "@/lib/types";

export interface ListState {
  page: number;
  pageSize: number;
  q: string;
  sort: string;
  direction: "asc" | "desc";
  filters: Record<string, string>;
}
export function useManagementList<T>(
  path: string,
  defaults: Pick<ListState, "sort" | "filters"> & {
    direction?: "asc" | "desc";
  },
) {
  const initial = useRef<ListState>({
    page: 1,
    pageSize: 10,
    q: "",
    direction: defaults.direction || "asc",
    ...defaults,
  });
  const [query, setQuery] = useState(initial.current),
    [search, setSearch] = useState("");
  const params = new URLSearchParams({
    ...query.filters,
    page: String(query.page),
    pageSize: String(query.pageSize),
    q: query.q,
    sort: query.sort,
    direction: query.direction,
  });
  const url = `${path}?${params.toString()}`;
  const resource = useResource<PageResult<T>>(url);
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setQuery((current) =>
          current.q === search ? current : { ...current, q: search, page: 1 },
        ),
      250,
    );
    return () => clearTimeout(timer);
  }, [search]);
  const reset = useCallback(() => {
    setSearch("");
    setQuery((current) => ({ ...initial.current, pageSize: current.pageSize }));
  }, []);
  return {
    query,
    search,
    setSearch,
    reload: resource.reload,
    reset,
    data: resource.data || {
      items: [],
      total: 0,
      page: 1,
      pageSize: query.pageSize,
      totalPages: 1,
    },
    loading: resource.loading,
    error: resource.error,
    filtered: Boolean(search || Object.values(query.filters).some(Boolean)),
    setFilter: (name: string, value: string) =>
      setQuery((current) => ({
        ...current,
        page: 1,
        filters: { ...current.filters, [name]: value },
      })),
    setPage: (page: number) => setQuery((current) => ({ ...current, page })),
    setPageSize: (pageSize: number) =>
      setQuery((current) => ({ ...current, page: 1, pageSize })),
    setSort: (sort: string, direction?: "asc" | "desc") =>
      setQuery((current) => ({
        ...current,
        page: 1,
        sort,
        direction:
          direction ||
          (current.sort === sort && current.direction === "asc"
            ? "desc"
            : "asc"),
      })),
  };
}
