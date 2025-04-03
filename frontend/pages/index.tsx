import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { STRIPE_PRODUCTS } from '../config/stripe';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const AnimatedButton = styled.button<{ variant?: 'primary' | 'outline' }>`
  padding: ${props => props.variant === 'outline' ? '0.8rem 1.5rem' : '1rem 2rem'};
  border-radius: 30px;
  font-size: ${props => props.variant === 'outline' ? '1rem' : '1.1rem'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: ${props => props.variant === 'outline' ? 'auto' : '100%'};
  background: ${props => props.variant === 'outline' ? 'transparent' : '#1a237e'};
  color: ${props => props.variant === 'outline' ? '#1a237e' : '#ffffff'};
  border: ${props => props.variant === 'outline' ? '2px solid #1a237e' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    background: ${props => props.variant === 'outline' ? '#1a237e' : '#0d47a1'};
    color: ${props => props.variant === 'outline' ? '#ffffff' : '#ffffff'};
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 5px 15px rgba(26, 35, 126, 0.3);
  }

  &:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 2px 5px rgba(26, 35, 126, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease-out, height 0.6s ease-out;
  }

  &:hover::before {
    width: 300%;
    height: 300%;
  }
`;

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    background: '#ffffff',
    minHeight: '100vh',
  },
  heroSection: {
    height: '90vh',
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '0 20px',
  },
  title: {
    fontSize: '4.5rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#ffffff',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  uploadSection: {
    background: '#ffffff',
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    marginTop: '-100px',
    position: 'relative',
    zIndex: 3,
  },
  uploadArea: {
    border: '3px dashed #1a237e',
    borderRadius: '15px',
    padding: '3rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#f8f9fa',
    '&:hover': {
      background: '#f0f2f5',
      borderColor: '#0d47a1',
    },
  },
  uploadIcon: {
    fontSize: '4rem',
    color: '#1a237e',
    marginBottom: '1rem',
  },
  uploadText: {
    fontSize: '1.2rem',
    color: '#1a237e',
    marginBottom: '1rem',
  },
  uploadButton: {
    background: '#1a237e',
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#0d47a1',
      transform: 'translateY(-2px)',
    },
  },
  documentList: {
    marginTop: '2rem',
  },
  documentItem: {
    background: '#ffffff',
    padding: '1.5rem',
    borderRadius: '15px',
    marginBottom: '1rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    },
  },
  documentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  documentIcon: {
    fontSize: '2rem',
    color: '#1a237e',
  },
  documentName: {
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#1a237e',
  },
  documentStatus: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  statusPending: {
    background: '#fff3e0',
    color: '#e65100',
  },
  statusProcessing: {
    background: '#e3f2fd',
    color: '#1565c0',
  },
  statusCompleted: {
    background: '#e8f5e9',
    color: '#2e7d32',
  },
  plansSection: {
    padding: '5rem 0',
    background: '#f8f9fa',
  },
  plansTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#1a237e',
    marginBottom: '3rem',
    fontWeight: 700,
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '0 20px',
  },
  planCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    },
  },
  planName: {
    fontSize: '1.8rem',
    color: '#1a237e',
    marginBottom: '1rem',
    fontWeight: 700,
  },
  planPrice: {
    fontSize: '2.5rem',
    color: '#1a237e',
    marginBottom: '2rem',
    fontWeight: 700,
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  planFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    color: '#1a237e',
    fontSize: '1.1rem',
  },
  subscribeButton: {
    background: '#1a237e',
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      background: '#0d47a1',
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 5px 15px rgba(26, 35, 126, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0) scale(0.98)',
      boxShadow: '0 2px 5px rgba(26, 35, 126, 0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      width: '0',
      height: '0',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.6s ease-out, height 0.6s ease-out',
    },
    '&:hover::before': {
      width: '300px',
      height: '300px',
    },
  },
  header: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    padding: '1rem 2rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a237e',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  loginButton: {
    background: 'transparent',
    color: '#1a237e',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    border: '2px solid #1a237e',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      background: '#1a237e',
      color: '#ffffff',
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: '0 5px 15px rgba(26, 35, 126, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0) scale(0.95)',
      boxShadow: '0 2px 5px rgba(26, 35, 126, 0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      width: '0',
      height: '0',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.6s ease-out, height 0.6s ease-out',
    },
    '&:hover::before': {
      width: '300px',
      height: '300px',
    },
  },
  registerButton: {
    background: '#1a237e',
    color: '#ffffff',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      background: '#0d47a1',
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: '0 5px 15px rgba(26, 35, 126, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0) scale(0.95)',
      boxShadow: '0 2px 5px rgba(26, 35, 126, 0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      width: '0',
      height: '0',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.6s ease-out, height 0.6s ease-out',
    },
    '&:hover::before': {
      width: '300px',
      height: '300px',
    },
  },
  planDescription: {
    fontSize: '1.1rem',
    color: '#4a5568',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
};

export default function Home() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; status: 'pending' | 'processing' | 'completed' }>>([]);
  const stripe = useStripe();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      setUploadedFiles([...uploadedFiles, ...newFiles.map(file => ({ name: file.name, status: 'pending' }))]);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    router.push(`/checkout?priceId=${priceId}`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <a href="/" style={styles.logo}>DocProcessor</a>
        <div style={styles.buttonGroup}>
          <AnimatedButton 
            variant="outline"
            onClick={() => router.push('/login')}
          >
            Entrar
          </AnimatedButton>
          <AnimatedButton 
            variant="primary"
            onClick={() => router.push('/register')}
          >
            Registrar
          </AnimatedButton>
        </div>
      </header>

      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Transforme seus documentos em insights valiosos</h1>
          <p style={styles.subtitle}>
            Processamento inteligente de documentos com IA avançada
          </p>
        </div>
      </section>

      <section style={styles.uploadSection}>
        <div style={styles.uploadArea}>
          <div style={styles.uploadIcon}>📄</div>
          <p style={styles.uploadText}>
            Arraste e solte seus documentos aqui ou clique para selecionar
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <AnimatedButton variant="primary">
              Selecionar Arquivos
            </AnimatedButton>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div style={styles.documentList}>
            {uploadedFiles.map((file, index) => (
              <div key={index} style={styles.documentItem}>
                <div style={styles.documentInfo}>
                  <div style={styles.documentIcon}>📄</div>
                  <span style={styles.documentName}>{file.name}</span>
                </div>
                <span style={{...styles.documentStatus, ...styles[`status${file.status.charAt(0).toUpperCase() + file.status.slice(1)}`]}}>
                  {file.status === 'pending' && 'Pendente'}
                  {file.status === 'processing' && 'Processando'}
                  {file.status === 'completed' && 'Concluído'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.plansSection}>
        <h2 style={styles.plansTitle}>Escolha o plano ideal para você</h2>
        <div style={styles.plansGrid}>
          {Object.entries(STRIPE_PRODUCTS).map(([key, product]) => (
            <div key={key} style={styles.planCard}>
              <h3 style={styles.planName}>{product.name}</h3>
              <div style={styles.planPrice}>€{product.price}/mês</div>
              <p style={styles.planDescription}>{product.description}</p>
              <ul style={styles.planFeatures}>
                {product.features.map((feature, index) => (
                  <li key={index} style={styles.planFeature}>✓ {feature}</li>
                ))}
              </ul>
              <AnimatedButton
                variant="primary"
                onClick={() => handleSubscribe(product.priceId)}
              >
                Assinar Agora
              </AnimatedButton>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 