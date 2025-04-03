export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const STRIPE_PRODUCTS = {
  basic: {
    name: 'Básico',
    price: 9.99,
    priceId: 'price_basic',
    description: 'Ideal para usuários individuais',
    features: [
      'Até 100 documentos por mês',
      'Análise de sentimento básica',
      'Extração de entidades',
      'Suporte por email',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29.99,
    priceId: 'price_pro',
    description: 'Perfeito para equipes pequenas',
    features: [
      'Até 500 documentos por mês',
      'Análise de sentimento avançada',
      'Extração de entidades',
      'Análise de tópicos',
      'Suporte prioritário',
      'API de acesso',
    ],
  },
  enterprise: {
    name: 'Empresarial',
    price: 99.99,
    priceId: 'price_enterprise',
    description: 'Solução completa para empresas',
    features: [
      'Documentos ilimitados',
      'Análise de sentimento avançada',
      'Extração de entidades',
      'Análise de tópicos',
      'Suporte 24/7',
      'API de acesso',
      'Personalização completa',
      'Treinamento dedicado',
    ],
  },
}; 