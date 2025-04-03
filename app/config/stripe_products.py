STRIPE_PRODUCTS = {
    'basic': {
        'name': 'Plano Básico',
        'description': 'Ideal para usuários individuais e pequenas empresas',
        'price': 29,
        'features': [
            '100 documentos/mês',
            'Processamento básico',
            'Suporte por email',
            'Exportação em PDF',
            'Armazenamento de 1GB'
        ],
        'stripe_price_id': 'price_1R9gslLf5ulcbXEOIeFqWliy',
        'stripe_product_id': 'prod_S3oV2WerWujgme'
    },
    'pro': {
        'name': 'Plano Pro',
        'description': 'Perfeito para empresas e usuários avançados',
        'price': 99,
        'features': [
            'Documentos ilimitados',
            'Processamento avançado',
            'Suporte prioritário',
            'API access',
            'Exportação em múltiplos formatos',
            'Armazenamento de 10GB',
            'Análise avançada de documentos',
            'Integração com ferramentas empresariais'
        ],
        'stripe_price_id': 'price_1R9gsmLf5ulcbXEOn9Z4A4T5',
        'stripe_product_id': 'prod_S3oV2WerWujgme'
    },
    'enterprise': {
        'name': 'Plano Enterprise',
        'description': 'Solução completa para grandes empresas',
        'price': 299,
        'features': [
            'Documentos ilimitados',
            'Processamento avançado',
            'Suporte dedicado 24/7',
            'API access com rate limits elevados',
            'Exportação em múltiplos formatos',
            'Armazenamento ilimitado',
            'Análise avançada de documentos',
            'Integração com ferramentas empresariais',
            'Treinamento personalizado',
            'SLA garantido',
            'Backup automático',
            'Conformidade com GDPR'
        ],
        'stripe_price_id': 'price_1R9gsmLf5ulcbXEOkJbSK5XF',
        'stripe_product_id': 'prod_S3oVGO4iQm4vHq'
    }
} 