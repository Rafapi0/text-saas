import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from '../types/models';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setAuthState({ user, loading: false, error: null });
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    } catch (error) {
      setAuthState({ user: null, loading: false, error: 'Erro ao verificar autenticação' });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      setAuthState({ user: data.user, loading: false, error: null });
      router.push('/dashboard');
    } catch (error) {
      setAuthState({ user: null, loading: false, error: 'Erro ao fazer login' });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthState({ user: null, loading: false, error: null });
      router.push('/login');
    } catch (error) {
      setAuthState({ ...authState, error: 'Erro ao fazer logout' });
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
  };
} 