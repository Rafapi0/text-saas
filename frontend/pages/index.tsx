import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '../config/stripe';

// Inicializa o Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Estilos globais
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: "'Poppins', sans-serif",
    background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '4rem',
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    borderRadius: '20px',
    color: '#FFFFFF',
    boxShadow: '0 10px 20px rgba(66, 153, 225, 0.2)',
  },
  title: {
    fontSize: '3.5rem',
    color: '#FFFFFF',
    marginBottom: '1.5rem',
    fontWeight: 700,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  subtitle: {
    fontSize: '1.4rem',
    color: '#FFFFFF',
    maxWidth: '700px',
    margin: '0 auto',
    opacity: 0.9,
  },
  uploadSection: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    marginBottom: '4rem',
    border: '1px solid rgba(66, 153, 225, 0.1)',
  },
  uploadTitle: {
    fontSize: '1.8rem',
    color: '#2D3748',
    marginBottom: '2rem',
    fontWeight: 600,
    textAlign: 'center' as const,
  },
  uploadArea: {
    border: '3px dashed #4299E1',
    borderRadius: '15px',
    padding: '3rem',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #EBF8FF 0%, #F7FAFC 100%)',
    '&:hover': {
      borderColor: '#2B6CB0',
      backgroundColor: '#EBF8FF',
      transform: 'scale(1.02)',
    },
  },
  uploadText: {
    color: '#4A5568',
    marginBottom: '1.5rem',
    fontSize: '1.2rem',
  },
  uploadButton: {
    background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    color: '#FFFFFF',
    padding: '1rem 2rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(66, 153, 225, 0.3)',
    },
  },
  documentsList: {
    marginTop: '2.5rem',
  },
  documentItem: {
    background: '#F7FAFC',
    borderRadius: '12px',
    padding: '1.2rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid rgba(66, 153, 225, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateX(5px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },
  },
  documentName: {
    fontWeight: 500,
    color: '#2D3748',
    fontSize: '1.1rem',
  },
  documentStatus: {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.9rem',
    fontWeight: 500,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  statusPending: {
    background: 'linear-gradient(135deg, #FEFCBF 0%, #FAF089 100%)',
    color: '#975A16',
  },
  statusCompleted: {
    background: 'linear-gradient(135deg, #C6F6D5 0%, #9AE6B4 100%)',
    color: '#2F855A',
  },
  statusError: {
    background: 'linear-gradient(135deg, #FED7D7 0%, #FEB2B2 100%)',
    color: '#C53030',
  },
  plansSection: {
    marginTop: '4rem',
    padding: '2rem 0',
  },
  plansTitle: {
    fontSize: '2.5rem',
    color: '#2D3748',
    textAlign: 'center' as const,
    marginBottom: '4rem',
    fontWeight: 700,
    position: 'relative' as const,
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100px',
      height: '4px',
      background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
      borderRadius: '2px',
    },
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
  },
  planCard: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(66, 153, 225, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    },
  },
  planName: {
    fontSize: '1.8rem',
    color: '#2D3748',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  planPrice: {
    fontSize: '2.5rem',
    color: '#4299E1',
    marginBottom: '1.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  planDescription: {
    color: '#4A5568',
    marginBottom: '2rem',
    lineHeight: '1.6',
    fontSize: '1.1rem',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2.5rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    color: '#4A5568',
    fontSize: '1.1rem',
  },
  featureIcon: {
    color: '#48BB78',
    marginRight: '0.75rem',
    fontSize: '1.2rem',
  },
  subscribeButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    color: '#FFFFFF',
    padding: '1rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(66, 153, 225, 0.3)',
    },
  },
};

const HomeContent = () => {
  const stripe = useStripe();
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; status: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar o documento');
      }

      const result = await response.json();
      setDocuments(prev => [...prev, { id: result.id, name: file.name, status: 'pending' }]);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!stripe) return;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Processador de Documentos</h1>
        <p style={styles.subtitle}>
          Processe seus documentos de forma rápida e eficiente com nossa solução avançada
        </p>
      </header>

      <section style={styles.uploadSection}>
        <h2 style={styles.uploadTitle}>Upload de Documentos</h2>
        <div style={styles.uploadArea}>
          <p style={styles.uploadText}>
            Arraste e solte seus documentos aqui ou clique para selecionar
          </p>
          <input
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" style={styles.uploadButton}>
            Selecionar Arquivo
          </label>
        </div>

        <div style={styles.documentsList}>
          {documents.map(doc => (
            <div key={doc.id} style={styles.documentItem}>
              <span style={styles.documentName}>{doc.name}</span>
              <span
                style={{
                  ...styles.documentStatus,
                  ...(doc.status === 'pending'
                    ? styles.statusPending
                    : doc.status === 'completed'
                    ? styles.statusCompleted
                    : styles.statusError),
                }}
              >
                {doc.status === 'pending'
                  ? 'Processando'
                  : doc.status === 'completed'
                  ? 'Concluído'
                  : 'Erro'}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.plansSection}>
        <h2 style={styles.plansTitle}>Escolha seu Plano</h2>
        <div style={styles.plansGrid}>
          <div style={styles.planCard}>
            <h3 style={styles.planName}>Plano Básico</h3>
            <div style={styles.planPrice}>€29/mês</div>
            <p style={styles.planDescription}>
              Ideal para usuários individuais e pequenas empresas
            </p>
            <ul style={styles.featuresList}>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> 100 documentos/mês
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Processamento básico
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Suporte por email
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Exportação em PDF
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Armazenamento de 1GB
              </li>
            </ul>
            <button
              style={styles.subscribeButton}
              onClick={() => handleSubscribe('price_1R9gslLf5ulcbXEOIeFqWliy')}
            >
              Assinar
            </button>
          </div>

          <div style={styles.planCard}>
            <h3 style={styles.planName}>Plano Pro</h3>
            <div style={styles.planPrice}>€99/mês</div>
            <p style={styles.planDescription}>
              Perfeito para empresas e usuários avançados
            </p>
            <ul style={styles.featuresList}>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Documentos ilimitados
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Processamento avançado
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Suporte prioritário
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> API access
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Exportação em múltiplos formatos
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Armazenamento de 10GB
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Análise avançada de documentos
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Integração com ferramentas empresariais
              </li>
            </ul>
            <button
              style={styles.subscribeButton}
              onClick={() => handleSubscribe('price_1R9gsmLf5ulcbXEOn9Z4A4T5')}
            >
              Assinar
            </button>
          </div>

          <div style={styles.planCard}>
            <h3 style={styles.planName}>Plano Enterprise</h3>
            <div style={styles.planPrice}>€299/mês</div>
            <p style={styles.planDescription}>
              Solução completa para grandes empresas
            </p>
            <ul style={styles.featuresList}>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Documentos ilimitados
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Processamento avançado
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Suporte dedicado 24/7
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> API access com rate limits elevados
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Exportação em múltiplos formatos
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Armazenamento ilimitado
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Análise avançada de documentos
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Integração com ferramentas empresariais
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Treinamento personalizado
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> SLA garantido
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Backup automático
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span> Conformidade com GDPR
              </li>
            </ul>
            <button
              style={styles.subscribeButton}
              onClick={() => handleSubscribe('price_1R9gsmLf5ulcbXEOkJbSK5XF')}
            >
              Assinar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function Home() {
  return (
    <Elements stripe={stripePromise}>
      <HomeContent />
    </Elements>
  );
} 