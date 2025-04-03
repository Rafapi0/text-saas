import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const AnimatedButton = styled.button<{ variant?: 'primary' | 'outline' }>`
  padding: ${props => props.variant === 'outline' ? '0.8rem 1.5rem' : '1rem 2rem'};
  border-radius: 30px;
  font-size: ${props => props.variant === 'outline' ? '1rem' : '1.1rem'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: ${props => props.variant === 'outline' ? 'auto' : '100%'};
  background: ${props => props.variant === 'outline' ? 'transparent' : '#1a237e'};
  color: ${props => props.variant === 'outline' ? '#1a237e' : '#ffffff'};
  border: ${props => props.variant === 'outline' ? '2px solid #1a237e' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    background: ${props => props.variant === 'outline' ? '#1a237e' : '#0d47a1'};
    color: ${props => props.variant === 'outline' ? '#ffffff' : '#ffffff'};
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 5px 15px rgba(26, 35, 126, 0.3);
  }

  &:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 2px 5px rgba(26, 35, 126, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease-out, height 0.6s ease-out;
  }

  &:hover::before {
    width: 300%;
    height: 300%;
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    padding: '2rem',
  },
  registerCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '3rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '2rem',
    color: '#1a237e',
    marginBottom: '2rem',
    textAlign: 'center' as const,
    fontWeight: 700,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '1rem',
    color: '#1a237e',
    fontWeight: 500,
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#1a237e',
      boxShadow: '0 0 0 3px rgba(26, 35, 126, 0.1)',
    },
  },
  error: {
    color: '#dc3545',
    fontSize: '0.9rem',
  },
  link: {
    color: '#1a237e',
    textDecoration: 'none',
    textAlign: 'center' as const,
    marginTop: '1rem',
    fontSize: '0.9rem',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar');
      }

      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerCard}>
        <h1 style={styles.title}>Criar Conta</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <AnimatedButton type="submit" variant="primary">
            Registrar
          </AnimatedButton>

          <a href="/login" style={styles.link}>
            Já tem uma conta? Faça login
          </a>
        </form>
      </div>
    </div>
  );
} 