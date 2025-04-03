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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      setUser(data);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar');
      }

      const data = await response.json();
      setUser(data);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erro no logout:', error);
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
      setUser(userData);
    } catch (error) {
      console.error('Erro detalhado ao atualizar perfil:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };
} 