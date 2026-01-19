import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import api from "../lib/apiClient";
import type { AuthUser, LoginResponse } from "../types/auth";

const TOKEN_KEY = "rp_token";
const USER_KEY = "rp_user";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    // Only try /me if we have a token
    if (!token) return;

    const res = await api.get<AuthUser>("/auth/me");
    setUser(res.data);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data));
  };

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshMe();
      } catch (err) {
        console.error("Failed to fetch /auth/me, clearing auth", err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email: string, password: string) => {
    // Use apiClient so baseURL is correct
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const nextUser: AuthUser = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    };

    setUser(nextUser);
    setToken(res.data.token);

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_KEY, res.data.token);

    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = Boolean(user && token);
    const isAdmin = user?.role === "admin";

    return {
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      logout,
      refreshMe,
    };
  }, [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
