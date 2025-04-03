import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: #4299e1;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #4a5568;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #4299e1;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background: #fff5f5;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <LayoutContainer>
      <Header>
        <Logo href="/dashboard">TextSaaS</Logo>
        <Nav>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/documents">Documentos</NavLink>
          <NavLink href="/profile">Perfil</NavLink>
          <LogoutButton onClick={logout}>Sair</LogoutButton>
        </Nav>
      </Header>
      <Main>{children}</Main>
    </LayoutContainer>
  );
} 