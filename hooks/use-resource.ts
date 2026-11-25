"use client";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
export function useResource<T>(url: string) {
  const [revision, setRevision] = useState(0);
  const key = `${url}:${revision}`;
  const [state, setState] = useState<{ key: string; data?: T; error: string }>({
    key: "",
    error: "",
  });
  useEffect(() => {
    const controller = new AbortController();
    api<T>(url, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setState({ key, data, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ key, error: errorMessage(error) });
      });
    return () => controller.abort();
  }, [url, key]);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  return {
    data: state.data,
    loading: state.key !== key,
    error: state.key === key ? state.error : "",
    reload,
  };
}
