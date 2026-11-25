"use client";
import { useRef, useState } from "react";
import { errorMessage } from "@/lib/api";
export function useMutation() {
  const running = useRef(false);
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function run(action: () => Promise<void>): Promise<boolean> {
    if (running.current) return false;
    running.current = true;
    setPending(true);
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      running.current = false;
      setPending(false);
    }
  }
  return { pending, error, run, reset: () => setError("") };
}
