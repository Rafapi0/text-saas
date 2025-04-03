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
        'stripe_price_id': 'price_1Q2W3E4R5T6Y7U8I9O0P',  # Substitua pelo ID real do Stripe
        'stripe_product_id': 'prod_1Q2W3E4R5T6Y7U8I9O0P'  # Substitua pelo ID real do Stripe
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
        'stripe_price_id': 'price_2Q3W4E5R6T7Y8U9I0O1P',  # Substitua pelo ID real do Stripe
        'stripe_product_id': 'prod_2Q3W4E5R6T7Y8U9I0O1P'  # Substitua pelo ID real do Stripe
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
        'stripe_price_id': 'price_3Q4W5E6R7T8Y9U0I1O2P',  # Substitua pelo ID real do Stripe
        'stripe_product_id': 'prod_3Q4W5E6R7T8Y9U0I1O2P'  # Substitua pelo ID real do Stripe
    }
} 