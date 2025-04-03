import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  email: string;
  subscription?: {
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!state.loading && state.user) {
      router.push('/dashboard');
    }
  }, [state.user, state.loading, router]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setState({ user, loading: false, error: null });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    } catch (error) {
      setState({ user: null, loading: false, error: 'Erro ao verificar autenticação' });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      const user = await response.json();
      setState({ user, loading: false, error: null });
      router.push('/dashboard');
      return user;
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login',
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao registrar');
      }

      const user = await response.json();
      setState({ user, loading: false, error: null });
      return user;
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao registrar',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setState({ user: null, loading: false, error: null });
      router.push('/');
    } catch (error) {
      setState({
        ...state,
        error: error instanceof Error ? error.message : 'Erro ao fazer logout',
      });
    }
  };

  const updateProfile = async (data: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    try {
      console.log('Iniciando atualização de perfil...');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Resposta da atualização:', response.status);

      const userData = await response.json();
      console.log('Dados da resposta:', userData);

      if (!response.ok) {
        console.error('Erro na resposta do servidor:', userData);
        throw new Error(userData.message || 'Erro ao atualizar perfil');
      }

      console.log('Perfil atualizado com sucesso:', userData);
      setState({ ...state, user: userData });
    } catch (error) {
      console.error('Erro detalhado ao atualizar perfil:', error);
      throw error;
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
  };
} 