import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AuthForm from '../components/AuthForm';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  text-align: center;
  margin-top: 1rem;
`;

const Link = styled.a`
  color: #667eea;
  text-decoration: none;
  text-align: center;
  display: block;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Remover referência ao dashboard
        // router.push('/dashboard');
      } else {
        setError(data.message || 'Erro no registro');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Registro</Title>
        <AuthForm onSubmit={handleRegister} isLogin={false} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Link href="/login">Já tem uma conta? Faça login</Link>
      </FormContainer>
    </Container>
  );
} 