import { useState } from 'react';
import { useRouter } from 'next/router';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    padding: '2rem',
  },
  loginCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '3rem',
    width: '100%',
    maxWidth: '400px',
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
    marginBottom: '2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#4a5568',
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
  button: {
    background: '#1a237e',
    color: '#ffffff',
    padding: '1rem',
    borderRadius: '10px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#0d47a1',
      transform: 'translateY(-2px)',
    },
  },
  linksContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    alignItems: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1.5rem',
  },
  link: {
    color: '#1a237e',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      textDecoration: 'underline',
      transform: 'translateY(-1px)',
    },
  },
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de autenticação
    console.log('Login:', { email, password });
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Bem-vindo de volta</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        <div style={styles.linksContainer}>
          <a href="/register" style={styles.link}>
            Não tem uma conta? Registre-se
          </a>
          <a href="/" style={styles.link}>
            Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
} 