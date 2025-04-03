import os
import stripe
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

# Configura o Stripe
stripe_key = os.getenv('STRIPE_SECRET_KEY')
print(f"Usando chave do Stripe: {stripe_key[:10]}...")
stripe.api_key = stripe_key

def create_stripe_products():
    products = {
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
            ]
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
            ]
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
            ]
        }
    }

    for plan_id, plan_data in products.items():
        try:
            print(f"\nCriando produto: {plan_data['name']}")
            # Cria o produto
            product = stripe.Product.create(
                name=plan_data['name'],
                description=plan_data['description'],
                metadata={
                    'features': ','.join(plan_data['features'])
                }
            )
            print(f"Produto criado: {product.name} (ID: {product.id})")

            # Cria o preço
            print(f"Criando preço: €{plan_data['price']}/mês")
            price = stripe.Price.create(
                product=product.id,
                unit_amount=plan_data['price'] * 100,  # Stripe trabalha com centavos
                currency='eur',
                recurring={'interval': 'month'}
            )
            print(f"Preço criado: €{plan_data['price']}/mês (ID: {price.id})")

            # Atualiza o arquivo de configuração
            update_config_file(plan_id, product.id, price.id)
            print(f"Arquivo de configuração atualizado para {plan_id}")

        except stripe.error.StripeError as e:
            print(f"Erro ao criar produto {plan_id}: {str(e)}")
            print(f"Detalhes do erro: {e.error.message if hasattr(e, 'error') else 'Nenhum detalhe adicional'}")

def update_config_file(plan_id, product_id, price_id):
    config_file = 'app/config/stripe_products.py'
    
    # Lê o arquivo atual
    with open(config_file, 'r') as f:
        content = f.read()

    # Atualiza os IDs
    content = content.replace(f"prod_1Q2W3E4R5T6Y7U8I9O0P", product_id)
    content = content.replace(f"price_1Q2W3E4R5T6Y7U8I9O0P", price_id)

    # Salva o arquivo atualizado
    with open(config_file, 'w') as f:
        f.write(content)

if __name__ == '__main__':
    create_stripe_products() 