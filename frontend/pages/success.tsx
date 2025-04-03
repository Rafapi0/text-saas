import { useEffect } from 'react';
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
  successCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '3rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    textAlign: 'center' as const,
  },
  icon: {
    fontSize: '4rem',
    color: '#4caf50',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2rem',
    color: '#1a237e',
    marginBottom: '1rem',
    fontWeight: 700,
  },
  message: {
    fontSize: '1.1rem',
    color: '#4a5568',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  button: {
    background: '#1a237e',
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
    '&:hover': {
      background: '#0d47a1',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
};

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={styles.container}>
      <div style={styles.successCard}>
        <div style={styles.icon}>✓</div>
        <h1 style={styles.title}>Pagamento Concluído!</h1>
        <p style={styles.message}>
          Obrigado por escolher nossos serviços. Sua assinatura foi ativada com sucesso.
          Você será redirecionado para o dashboard em alguns segundos.
        </p>
        <a href="/dashboard" style={styles.button}>
          Ir para o Dashboard
        </a>
      </div>
    </div>
  );
} 