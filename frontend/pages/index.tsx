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
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0',
    fontFamily: "'Poppins', sans-serif",
    background: '#FFFFFF',
    minHeight: '100vh',
  },
  heroSection: {
    position: 'relative' as const,
    height: '80vh',
    background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/hero-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    color: '#FFFFFF',
    marginBottom: '4rem',
  },
  heroContent: {
    maxWidth: '800px',
    padding: '0 2rem',
  },
  title: {
    fontSize: '4.5rem',
    color: '#FFFFFF',
    marginBottom: '1.5rem',
    fontWeight: 700,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '1.8rem',
    color: '#FFFFFF',
    maxWidth: '700px',
    margin: '0 auto',
    opacity: 0.9,
    lineHeight: '1.6',
  },
  uploadSection: {
    background: '#FFFFFF',
    padding: '4rem 2rem',
    marginBottom: '4rem',
    position: 'relative' as const,
  },
  uploadTitle: {
    fontSize: '2.5rem',
    color: '#2D3748',
    marginBottom: '2rem',
    fontWeight: 600,
    textAlign: 'center' as const,
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
  uploadArea: {
    border: '3px dashed #4299E1',
    borderRadius: '20px',
    padding: '4rem',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #EBF8FF 0%, #F7FAFC 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      borderColor: '#2B6CB0',
      backgroundColor: '#EBF8FF',
      transform: 'scale(1.02)',
      boxShadow: '0 20px 40px rgba(66, 153, 225, 0.15)',
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
  uploadText: {
    color: '#4A5568',
    marginBottom: '2rem',
    fontSize: '1.4rem',
    lineHeight: '1.6',
  },
  uploadButton: {
    background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    color: '#FFFFFF',
    padding: '1.2rem 3rem',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(66, 153, 225, 0.3)',
    },
  },
  documentsList: {
    marginTop: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  documentItem: {
    background: '#FFFFFF',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(66, 153, 225, 0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    },
  },
  documentName: {
    fontWeight: 500,
    color: '#2D3748',
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  documentStatus: {
    padding: '0.8rem 1.5rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'inline-block',
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
    background: '#F7FAFC',
    padding: '6rem 2rem',
    marginTop: '4rem',
  },
  plansTitle: {
    fontSize: '3rem',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '3rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  planCard: {
    background: '#FFFFFF',
    borderRadius: '25px',
    padding: '3rem',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(66, 153, 225, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-15px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    },
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    },
  },
  planName: {
    fontSize: '2rem',
    color: '#2D3748',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  planPrice: {
    fontSize: '3rem',
    color: '#4299E1',
    marginBottom: '2rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  planDescription: {
    color: '#4A5568',
    marginBottom: '2.5rem',
    lineHeight: '1.8',
    fontSize: '1.2rem',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '3rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.2rem',
    color: '#4A5568',
    fontSize: '1.1rem',
    lineHeight: '1.6',
  },
  featureIcon: {
    color: '#48BB78',
    marginRight: '1rem',
    fontSize: '1.4rem',
  },
  subscribeButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
    color: '#FFFFFF',
    padding: '1.2rem',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
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
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Transforme seus Documentos</h1>
          <p style={styles.subtitle}>
            Processe e analise seus documentos de forma inteligente com nossa plataforma avançada
          </p>
        </div>
      </section>

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