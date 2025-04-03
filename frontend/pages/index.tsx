import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <Container>
      <Title>DocGenius</Title>
      <Subtitle>
        Processe seus documentos de texto com facilidade e eficiência
      </Subtitle>
      <ButtonContainer>
        <Button onClick={() => router.push('/login')}>Entrar</Button>
        <Button onClick={() => router.push('/register')}>Registrar</Button>
      </ButtonContainer>
    </Container>
  );
} 