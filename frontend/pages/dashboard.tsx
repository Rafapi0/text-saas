import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { ProcessedDocument } from '../types/models';

const DashboardContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: #2d3748;
  font-size: 2rem;
  font-weight: bold;
`;

const RecentDocuments = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DocumentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  transition: all 0.2s;

  &:hover {
    border-color: #4299e1;
    background: #f7fafc;
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DocumentName = styled.div`
  color: #2d3748;
  font-weight: 500;
`;

const DocumentDate = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const DocumentStatus = styled.div<{ status: ProcessedDocument['status'] }>`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  background: ${props => {
    switch (props.status) {
      case 'completed':
        return '#c6f6d5';
      case 'processing':
        return '#fefcbf';
      case 'pending':
        return '#e2e8f0';
      default:
        return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed':
        return '#2f855a';
      case 'processing':
        return '#975a16';
      case 'pending':
        return '#4a5568';
      default:
        return '#4a5568';
    }
  }};
`;

export default function Dashboard() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: ProcessedDocument['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Layout>
      <DashboardContainer>
        <StatsGrid>
          <StatCard>
            <StatTitle>Total de Documentos</StatTitle>
            <StatValue>{documents.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Documentos Processados</StatTitle>
            <StatValue>
              {documents.filter(doc => doc.status === 'completed').length}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Em Processamento</StatTitle>
            <StatValue>
              {documents.filter(doc => doc.status === 'processing').length}
            </StatValue>
          </StatCard>
        </StatsGrid>

        <RecentDocuments>
          <SectionTitle>Documentos Recentes</SectionTitle>
          <DocumentList>
            {loading ? (
              <div>Carregando...</div>
            ) : documents.length === 0 ? (
              <div>Nenhum documento encontrado</div>
            ) : (
              documents.map(doc => (
                <DocumentItem key={doc._id}>
                  <DocumentInfo>
                    <DocumentName>{doc.name}</DocumentName>
                    <DocumentDate>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </DocumentDate>
                  </DocumentInfo>
                  <DocumentStatus status={doc.status}>
                    {getStatusText(doc.status)}
                  </DocumentStatus>
                </DocumentItem>
              ))
            )}
          </DocumentList>
        </RecentDocuments>
      </DashboardContainer>
    </Layout>
  );
} 