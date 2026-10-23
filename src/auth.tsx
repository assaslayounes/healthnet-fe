import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Provider, Role } from '@/lib/types';
export interface User { id: number; role: Role; full_name: string; email: string; phone?: string | null; provider?: Provider | null }
interface AuthCtx {
  user: User | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => void;
}
const Ctx = createContext<AuthCtx>(null!);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();
  const refresh = useCallback(async () => {
    if (!localStorage.getItem('token')) { setUser(null); setLoading(false); return; }
    try { setUser((await api.get<User>('/me')).data); }
    catch { localStorage.removeItem('token'); setUser(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const store = async (token: string) => { localStorage.setItem('token', token); await refresh(); };
  const login = async (email: string, password: string) => store((await api.post<{ token: string }>('/auth/login', { email, password })).data.token);
  const register = async (payload: Record<string, unknown>) => store((await api.post<{ token: string }>('/auth/register', payload)).data.token);
  const logout = () => { localStorage.removeItem('token'); setUser(null); qc.clear(); };
  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
