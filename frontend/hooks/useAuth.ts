import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from '../types/models';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Verificando autenticação...');
      const response = await fetch('/api/auth/me');
      console.log('Resposta da verificação de autenticação:', response.status);
      if (response.ok) {
        const userData = await response.json();
        console.log('Usuário autenticado:', userData);
        setUser(userData);
      } else {
        console.log('Usuário não autenticado');
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
      console.log('Iniciando login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('Resposta do login:', response.status);

      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (!response.ok) {
        console.error('Erro na resposta do servidor:', data);
        throw new Error(data.message || 'Erro ao fazer login');
      }

      console.log('Login bem-sucedido:', data);
      setUser(data.user);
      
      // Força um refresh da página para garantir que o cookie seja definido
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro detalhado ao fazer login:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Iniciando registro...');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      console.log('Resposta do registro:', response.status);

      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (!response.ok) {
        console.error('Erro na resposta do servidor:', data);
        throw new Error(data.message || 'Erro ao registrar');
      }

      console.log('Registro bem-sucedido:', data);
      setUser(data.user);
      
      // Força um refresh da página para garantir que o cookie seja definido
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro detalhado ao registrar:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Iniciando logout...');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      console.log('Resposta do logout:', response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao fazer logout');
      }

      console.log('Logout bem-sucedido');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erro detalhado ao fazer logout:', error);
      throw error;
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