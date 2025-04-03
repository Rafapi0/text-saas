import { useRouter } from 'next/router';
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
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
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

export default function Checkout() {
  const router = useRouter();

  return (
    <Container>
      <Title>Checkout</Title>
      <Subtitle>Complete seu pagamento para continuar</Subtitle>
      <Button onClick={() => router.push('/')}>Voltar para a Home</Button>
    </Container>
  );
} 