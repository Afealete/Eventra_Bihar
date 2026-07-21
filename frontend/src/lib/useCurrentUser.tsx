"use client";
import { useState, useEffect } from "react";
import { CurrentUser, me } from "./auth";

export default function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await me();
      if (!mounted) return;
      setUser(data?.user ?? null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}
