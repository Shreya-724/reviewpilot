import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { fetchMe, login, logout, register, type Credentials, type RegisterPayload } from "../../api/auth";
import { refreshAccessToken, setAuthFailureHandler } from "../../api/client";
import { tokenStore } from "../../api/tokenStore";
import type { User } from "../../types/api";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Startup: the in-memory token is gone after a reload, but the HttpOnly
  // refresh cookie may still be valid. Try it before deciding "logged out".
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshAccessToken();
        const me = await fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // If a mid-session refresh fails, drop to the logged-out state.
  useEffect(() => {
    setAuthFailureHandler(() => {
      tokenStore.set(null);
      setUser(null);
      queryClient.clear();
    });
    return () => setAuthFailureHandler(null);
  }, [queryClient]);

  const signIn = useCallback(async (credentials: Credentials) => {
    const data = await login(credentials);
    tokenStore.set(data.access);
    setUser(data.user);
  }, []);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    const data = await register(payload);
    tokenStore.set(data.access);
    setUser(data.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      // Clear local state even if the network call failed.
      tokenStore.set(null);
      setUser(null);
      queryClient.clear(); // never leave one user's cached data for the next
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, signIn, signUp, signOut }),
    [user, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}