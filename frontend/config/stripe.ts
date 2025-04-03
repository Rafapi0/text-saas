export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const STRIPE_PRODUCTS = {
  basic: {
    name: 'Plano Básico',
    price: 29,
    priceId: 'price_1R9gslLf5ulcbXEOIeFqWliy',
    features: [
      '100 documentos/mês',
      'Processamento básico',
      'Suporte por email',
      'Exportação em PDF',
      '1GB de armazenamento',
      'Interface web básica'
    ],
    description: 'Ideal para usuários individuais e pequenas empresas'
  },
  pro: {
    name: 'Plano Pro',
    price: 99,
    priceId: 'price_1R9gsmLf5ulcbXEOn9Z4A4T5',
    features: [
      'Documentos ilimitados',
      'Processamento avançado',
      'Suporte prioritário',
      'API dedicada',
      '10GB de armazenamento',
      'Exportação em múltiplos formatos',
      'Análise avançada de documentos',
      'Integração com ferramentas empresariais'
    ],
    description: 'Perfeito para empresas e usuários avançados'
  },
  enterprise: {
    name: 'Plano Enterprise',
    price: 299,
    priceId: 'price_1R9gsmLf5ulcbXEOkJbSK5XF',
    features: [
      'Documentos ilimitados',
      'Processamento avançado',
      'Suporte dedicado 24/7',
      'API com rate limits elevados',
      'Armazenamento ilimitado',
      'Exportação em múltiplos formatos',
      'Análise avançada de documentos',
      'Integração com ferramentas empresariais',
      'Treinamento personalizado',
      'SLA garantido',
      'Backup automático',
      'Conformidade com GDPR'
    ],
    description: 'Solução completa para grandes empresas'
  }
}; 