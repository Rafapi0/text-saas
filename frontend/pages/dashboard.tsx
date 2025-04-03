import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: bold;
`;

const DocumentsSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.25rem;
`;

const UploadButton = styled.button`
  background: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #3182ce;
  }
`;

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const DocumentCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
`;

const DocumentName = styled.h3`
  color: #2d3748;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const DocumentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #718096;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ status }) => {
    switch (status) {
      case 'completed':
        return '#c6f6d5';
      case 'processing':
        return '#fefcbf';
      case 'pending':
        return '#fed7d7';
      default:
        return '#e2e8f0';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'completed':
        return '#2f855a';
      case 'processing':
        return '#975a16';
      case 'pending':
        return '#c53030';
      default:
        return '#4a5568';
    }
  }};
`;

interface Document {
  id: string;
  name: string;
  status: 'completed' | 'processing' | 'pending';
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Erro ao carregar documentos');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: documents.length,
    completed: documents.filter(doc => doc.status === 'completed').length,
    processing: documents.filter(doc => doc.status === 'processing').length,
  };

  if (loading) {
    return (
      <Layout>
        <DashboardContainer>
          <p>Carregando...</p>
        </DashboardContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardContainer>
        <h1>Bem-vindo, {user?.name}!</h1>
        
        <StatsGrid>
          <StatCard>
            <StatTitle>Total de Documentos</StatTitle>
            <StatValue>{stats.total}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Processados</StatTitle>
            <StatValue>{stats.completed}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Em Processamento</StatTitle>
            <StatValue>{stats.processing}</StatValue>
          </StatCard>
        </StatsGrid>

        <DocumentsSection>
          <SectionHeader>
            <SectionTitle>Meus Documentos</SectionTitle>
            <UploadButton onClick={() => window.location.href = '/documents'}>
              Novo Documento
            </UploadButton>
          </SectionHeader>

          {error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : documents.length === 0 ? (
            <p>Nenhum documento encontrado.</p>
          ) : (
            <DocumentsGrid>
              {documents.map(doc => (
                <DocumentCard key={doc.id}>
                  <DocumentName>{doc.name}</DocumentName>
                  <DocumentMeta>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    <StatusBadge status={doc.status}>
                      {doc.status === 'completed' ? 'Concluído' :
                       doc.status === 'processing' ? 'Processando' : 'Pendente'}
                    </StatusBadge>
                  </DocumentMeta>
                </DocumentCard>
              ))}
            </DocumentsGrid>
          )}
        </DocumentsSection>
      </DashboardContainer>
    </Layout>
  );
} 