import { ReactNode } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

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
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: #667eea;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #4a5568;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fff5f5;
  }
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
`;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <LayoutContainer>
      <Header>
        <Logo href="/">Text SaaS</Logo>
        <Nav>
          {user ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/documents">Documentos</NavLink>
              <NavLink href="/profile">Perfil</NavLink>
              <LogoutButton onClick={logout}>Sair</LogoutButton>
            </>
          ) : (
            <>
              <NavLink href="/login">Entrar</NavLink>
              <NavLink href="/register">Registrar</NavLink>
            </>
          )}
        </Nav>
      </Header>
      <Main>{children}</Main>
    </LayoutContainer>
  );
} 