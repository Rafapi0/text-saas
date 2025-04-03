import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { ProcessedDocument } from '../types/models';

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
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: #2d3748;
  font-size: 2rem;
  font-weight: bold;
`;

const DocumentsSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DocumentList = styled.div`
  display: grid;
  gap: 1rem;
`;

const DocumentCard = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.h3`
  color: #2d3748;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const DocumentDate = styled.p`
  color: #718096;
  font-size: 0.875rem;
`;

const DocumentStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background: ${({ status }) => {
    switch (status) {
      case 'completed':
        return '#C6F6D5';
      case 'processing':
        return '#FEFCBF';
      default:
        return '#FED7D7';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'completed':
        return '#2F855A';
      case 'processing':
        return '#975A16';
      default:
        return '#C53030';
    }
  }};
`;

const UploadButton = styled.button`
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #5a67d8;
  }
`;

export default function Dashboard() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Erro ao buscar documentos');
      }
      const data = await response.json();
      setDocuments(data.documents);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      setError('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: documents.length,
    processed: documents.filter(doc => doc.status === 'completed').length,
    processing: documents.filter(doc => doc.status === 'processing').length,
  };

  if (loading) {
    return (
      <Layout>
        <DashboardContainer>
          <div>Carregando...</div>
        </DashboardContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardContainer>
        <StatsGrid>
          <StatCard>
            <StatTitle>Total de Documentos</StatTitle>
            <StatValue>{stats.total}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Processados</StatTitle>
            <StatValue>{stats.processed}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Em Processamento</StatTitle>
            <StatValue>{stats.processing}</StatValue>
          </StatCard>
        </StatsGrid>

        <DocumentsSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <SectionTitle>Meus Documentos</SectionTitle>
            <UploadButton onClick={() => window.location.href = '/documents'}>
              Novo Documento
            </UploadButton>
          </div>

          {error ? (
            <div style={{ color: '#e53e3e' }}>{error}</div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#718096' }}>
              Nenhum documento encontrado. Comece fazendo upload de um documento!
            </div>
          ) : (
            <DocumentList>
              {documents.map((doc) => (
                <DocumentCard key={doc._id}>
                  <DocumentInfo>
                    <DocumentName>{doc.name}</DocumentName>
                    <DocumentDate>
                      {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                    </DocumentDate>
                  </DocumentInfo>
                  <DocumentStatus status={doc.status}>
                    {doc.status === 'completed' ? 'Processado' :
                     doc.status === 'processing' ? 'Processando' : 'Pendente'}
                  </DocumentStatus>
                </DocumentCard>
              ))}
            </DocumentList>
          )}
        </DocumentsSection>
      </DashboardContainer>
    </Layout>
  );
} 