import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { User } from '../types/models';

const ProfileContainer = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #4a5568;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Button = styled.button`
  background: #4299e1;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #3182ce;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #2f855a;
  font-size: 0.9rem;
`;

const SubscriptionInfo = styled.div`
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 5px;
  margin-top: 1rem;
`;

const SubscriptionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const SubscriptionDetails = styled.div`
  color: #4a5568;
  font-size: 0.9rem;
`;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (newPassword && newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao atualizar perfil');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess('Perfil atualizado com sucesso');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProfileContainer>
        <ProfileCard>
          <Title>Meu Perfil</Title>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Form>

          <SubscriptionInfo>
            <SubscriptionTitle>Plano de Assinatura</SubscriptionTitle>
            <SubscriptionDetails>
              <div>Plano: {user?.subscription.plan}</div>
              <div>Status: {user?.subscription.status}</div>
              {user?.subscription.startDate && (
                <div>
                  Início: {new Date(user.subscription.startDate).toLocaleDateString()}
                </div>
              )}
              {user?.subscription.endDate && (
                <div>
                  Término: {new Date(user.subscription.endDate).toLocaleDateString()}
                </div>
              )}
            </SubscriptionDetails>
          </SubscriptionInfo>
        </ProfileCard>
      </ProfileContainer>
    </Layout>
  );
} 