import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { ProcessedDocument } from '../types/models';

const DocumentsContainer = styled.div`
  padding: 2rem;
`;

const UploadSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
`;

const UploadArea = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#667eea' : '#e2e8f0'};
  border-radius: 8px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isDragging ? '#f7fafc' : 'white'};

  &:hover {
    border-color: #667eea;
    background: #f7fafc;
  }
`;

const UploadText = styled.p`
  color: #4a5568;
  margin-bottom: 1rem;
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

const DocumentsList = styled.div`
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

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 1rem;
`;

export default function Documents() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do arquivo');
      }

      const data = await response.json();
      setDocuments(prev => [data.document, ...prev]);
      setError('');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao fazer upload do arquivo');
    }
  };

  if (loading) {
    return (
      <Layout>
        <DocumentsContainer>
          <div>Carregando...</div>
        </DocumentsContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <DocumentsContainer>
        <UploadSection>
          <UploadArea
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadText>
              Arraste e solte seu arquivo aqui ou clique para selecionar
            </UploadText>
            <UploadButton>Selecionar Arquivo</UploadButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".txt,.doc,.docx,.pdf"
            />
          </UploadArea>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </UploadSection>

        <DocumentsList>
          <SectionTitle>Meus Documentos</SectionTitle>
          {documents.length === 0 ? (
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
        </DocumentsList>
      </DocumentsContainer>
    </Layout>
  );
} 