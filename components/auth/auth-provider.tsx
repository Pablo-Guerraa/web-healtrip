"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError, json } from "@/lib/api";
import { hasPermission } from "@/lib/access";
import type { Permission, User } from "@/lib/types";
interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "anonymous" | "error";
  reload: () => Promise<void>;
  can: (permission: Permission) => boolean;
  logout: () => Promise<void>;
}
const Context = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");
  const generation = useRef(0);
  const reload = useCallback(async () => {
    const current = ++generation.current;
    try {
      const result = await api<{ user: User }>("/auth/me");
      if (current !== generation.current) return;
      setUser(result.user);
      setStatus("authenticated");
    } catch (error) {
      if (current !== generation.current) return;
      setUser(null);
      setStatus(
        error instanceof ApiError && error.status === 401
          ? "anonymous"
          : "error",
      );
    }
  }, []);
  useEffect(() => {
    void reload();
    const expired = () => {
      generation.current++;
      setUser(null);
      setStatus("anonymous");
    };
    window.addEventListener("core:unauthorized", expired);
    const refreshAccess = () => {
      if (document.visibilityState === "visible") void reload();
    };
    window.addEventListener("focus", refreshAccess);
    return () => {
      generation.current++;
      window.removeEventListener("core:unauthorized", expired);
      window.removeEventListener("focus", refreshAccess);
    };
  }, [reload]);
  const logout = async () => {
    await api("/auth/logout", json("POST", {}), false);
    generation.current++;
    setUser(null);
    setStatus("anonymous");
  };
  return (
    <Context.Provider
      value={{
        user,
        status,
        reload,
        can: (p) => hasPermission(user?.permissions, p),
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error("AuthProvider is missing");
  return value;
}
