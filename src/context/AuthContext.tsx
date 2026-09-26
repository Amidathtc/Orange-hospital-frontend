import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setToken, clearToken } from '../lib/api';

type Role = 'MEMBER' | 'RECEPTIONIST' | 'MARKETER' | 'ADMIN';

interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  emailVerified: boolean;
  role: Role;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  signup: (fullName: string, phone: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'oha_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore whoever was logged in from localStorage.
  // We don't re-verify the token against the API here — any protected
  // request will naturally fail and log them out if the token's expired.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  function persist(response: AuthResponse) {
    setToken(response.accessToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
    setUser(response.user);
  }

  async function login(phone: string, password: string) {
    const response = await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { phone, password },
    });
    persist(response);
  }

  async function signup(fullName: string, phone: string, email: string, password: string) {
    const response = await api<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: { fullName, phone, password, ...(email ? { email } : {}) },
    });
    persist(response);
  }

  function logout() {
    clearToken();
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
