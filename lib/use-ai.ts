"use client";

import { useCallback, useState } from "react";

export type AiError = { code: string; message: string };

export function useAiRequest<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AiError | null>(null);

  const run = useCallback(async (body: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError({
          code: payload?.error?.code ?? "unknown",
          message: payload?.error?.message ?? "The assistant could not answer.",
        });
        setData(null);
        return null;
      }
      setData(payload as T);
      return payload as T;
    } catch {
      setError({ code: "network", message: "Network error. Check your connection and try again." });
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, run, reset };
}
