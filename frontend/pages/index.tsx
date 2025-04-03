import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Inicializa o Stripe com sua chave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function HomeContent() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const stripe = useStripe();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      setResult('Erro ao processar documento');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await axios.post('/api/subscribe', { planId });
      const session = response.data;
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });
        
        if (error) {
          console.error('Erro ao redirecionar para checkout:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Processador de Documentos
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selecione um documento
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full"
                accept=".pdf,.doc,.docx,.txt"
              />
              <button
                onClick={handleProcess}
                disabled={!file || loading}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Processar Documento'}
              </button>
            </div>

            {result && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Resultado
                </h2>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                  {result}
                </pre>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Planos de Assinatura
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Plano Básico</h3>
                  <p className="text-3xl font-bold mb-4">€29/mês</p>
                  <ul className="space-y-2 mb-6">
                    <li>100 documentos/mês</li>
                    <li>Processamento básico</li>
                    <li>Suporte por email</li>
                  </ul>
                  <button
                    onClick={() => handleSubscribe('price_basic')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Assinar
                  </button>
                </div>
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Plano Pro</h3>
                  <p className="text-3xl font-bold mb-4">€99/mês</p>
                  <ul className="space-y-2 mb-6">
                    <li>Documentos ilimitados</li>
                    <li>Processamento avançado</li>
                    <li>Suporte prioritário</li>
                    <li>API access</li>
                  </ul>
                  <button
                    onClick={() => handleSubscribe('price_pro')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Assinar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Elements stripe={stripePromise}>
      <HomeContent />
    </Elements>
  );
} 