import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchMe, login as loginRequest, register as registerRequest } from "../api/auth";
import { getStoredToken, storeToken } from "../api/http";
import type { AuthUser, RoleName } from "../types";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isManager: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { fullName: string; email: string; phone?: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((me) => setUser({ userId: me.userId, email: me.email, fullName: me.fullName, roles: me.roles }))
      .catch(() => {
        storeToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isManager: Boolean(user?.roles.includes("EVENT_MANAGER" as RoleName)),
      async login(email, password) {
        const me = await loginRequest({ email, password });
        setUser({ userId: me.userId, email: me.email, fullName: me.fullName, roles: me.roles });
      },
      async register(payload) {
        const me = await registerRequest(payload);
        setUser({ userId: me.userId, email: me.email, fullName: me.fullName, roles: me.roles });
      },
      logout() {
        storeToken(null);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
