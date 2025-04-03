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

const PricingSection = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

const PricingTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const PricingTable = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const PricingCard = styled.div`
  background: white;
  color: #667eea;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 350px;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.p`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
`;

const Feature = styled.li`
  margin-bottom: 0.5rem;
`;

const PaymentButton = styled.button`
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5a67d8;
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
      <PricingSection>
        <PricingTitle>Planos e Preços</PricingTitle>
        <PricingTable>
          <PricingCard>
            <PlanName>Utilização Única</PlanName>
            <PlanPrice>€1,20</PlanPrice>
            <PlanFeatures>
              <Feature>Processamento de 1 documento</Feature>
            </PlanFeatures>
            <PaymentButton onClick={() => router.push(user ? '/login' : '/login')}>Comprar Agora</PaymentButton>
          </PricingCard>
          <PricingCard>
            <PlanName>Básico</PlanName>
            <PlanPrice>€19,99/mês</PlanPrice>
            <PlanFeatures>
              <Feature>Processamento de até 30 documentos</Feature>
              <Feature>Suporte por email</Feature>
            </PlanFeatures>
            <PaymentButton onClick={() => router.push(user ? '/login' : '/login')}>Assinar</PaymentButton>
          </PricingCard>
          <PricingCard>
            <PlanName>Profissional</PlanName>
            <PlanPrice>€49,99/mês</PlanPrice>
            <PlanFeatures>
              <Feature>Processamento ilimitado</Feature>
              <Feature>Suporte prioritário</Feature>
              <Feature>Integrações avançadas</Feature>
            </PlanFeatures>
            <PaymentButton onClick={() => router.push(user ? '/login' : '/login')}>Assinar</PaymentButton>
          </PricingCard>
        </PricingTable>
      </PricingSection>
    </Container>
  );
} 