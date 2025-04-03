import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-components';
import axios from 'axios';

export default function Home() {
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900">
                    Plano Básico
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    €29/mês
                  </p>
                  <button
                    onClick={() => handleSubscribe('price_monthly_29')}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Assinar
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900">
                    Plano Pro
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    €99/mês
                  </p>
                  <button
                    onClick={() => handleSubscribe('price_monthly_99')}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
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