import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '../config/stripe';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    padding: '2rem',
  },
  checkoutCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '3rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '2rem',
    color: '#1a237e',
    marginBottom: '2rem',
    textAlign: 'center' as const,
    fontWeight: 700,
  },
  planInfo: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '2rem',
  },
  planName: {
    fontSize: '1.5rem',
    color: '#1a237e',
    marginBottom: '0.5rem',
    fontWeight: 600,
  },
  planPrice: {
    fontSize: '2rem',
    color: '#1a237e',
    fontWeight: 700,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  cardElement: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    '&:focus': {
      borderColor: '#1a237e',
      boxShadow: '0 0 0 3px rgba(26, 35, 126, 0.1)',
    },
  },
  button: {
    background: '#1a237e',
    color: '#ffffff',
    padding: '1rem',
    borderRadius: '10px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#0d47a1',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  error: {
    color: '#dc3545',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

function CheckoutForm({ priceId }: { priceId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        setError(stripeError.message || 'Ocorreu um erro ao processar o pagamento.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId,
        }),
      });

      const { error: subscriptionError } = await response.json();

      if (subscriptionError) {
        setError(subscriptionError);
        setLoading(false);
        return;
      }

      router.push('/success');
    } catch (err) {
      setError('Ocorreu um erro ao processar o pagamento.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.cardElement}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1a237e',
                '::placeholder': {
                  color: '#a0aec0',
                },
              },
              invalid: {
                color: '#dc3545',
              },
            },
          }}
        />
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={styles.button}
      >
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            Processando...
          </div>
        ) : (
          'Finalizar Pagamento'
        )}
      </button>
    </form>
  );
}

export default function Checkout() {
  const router = useRouter();
  const { priceId } = router.query;

  useEffect(() => {
    if (!priceId) {
      router.push('/');
    }
  }, [priceId, router]);

  if (!priceId) return null;

  return (
    <div style={styles.container}>
      <div style={styles.checkoutCard}>
        <h1 style={styles.title}>Finalizar Assinatura</h1>
        <div style={styles.planInfo}>
          <h2 style={styles.planName}>Plano Selecionado</h2>
          <div style={styles.planPrice}>€29/mês</div>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm priceId={priceId as string} />
        </Elements>
      </div>
    </div>
  );
} 