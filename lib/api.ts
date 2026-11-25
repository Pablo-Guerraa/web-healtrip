export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
let renewing: Promise<boolean> | null = null;
async function renew(): Promise<boolean> {
  if (!renewing) {
    renewing = fetch("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        renewing = null;
      });
  }
  return renewing;
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
  refresh = true,
): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  if (response.status === 401 && refresh) {
    if (await renew()) return api<T>(path, options, false);
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event("core:unauthorized"));
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      result.message || "No se pudo completar la solicitud",
      response.status,
    );
  return result as T;
}
export function json(method: string, body: unknown): RequestInit {
  return { method, body: JSON.stringify(body) };
}
export function errorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "No se pudo conectar. Intenta nuevamente.";
}
