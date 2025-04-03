import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { ProcessedDocument } from '../types/models';

const DocumentsContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const UploadSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const UploadArea = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#4299e1' : '#e2e8f0'};
  border-radius: 10px;
  padding: 2rem;
  margin: 1rem 0;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isDragging ? '#ebf8ff' : 'white'};

  &:hover {
    border-color: #4299e1;
    background: #ebf8ff;
  }
`;

const UploadText = styled.div`
  color: #4a5568;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const DocumentsList = styled.div`
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

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

export default function Documents() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setError('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao fazer upload');
      }

      const data = await response.json();
      setDocuments(prev => [data.document, ...prev]);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setUploading(false);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
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
      <DocumentsContainer>
        <UploadSection>
          <h2>Upload de Documentos</h2>
          <UploadArea
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadText>
              {uploading ? 'Enviando...' : 'Arraste e solte seu documento aqui'}
            </UploadText>
            <UploadSubtext>
              ou clique para selecionar um arquivo
            </UploadSubtext>
          </UploadArea>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".txt,.doc,.docx,.pdf"
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </UploadSection>

        <DocumentsList>
          <SectionTitle>Meus Documentos</SectionTitle>
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
        </DocumentsList>
      </DocumentsContainer>
    </Layout>
  );
} 