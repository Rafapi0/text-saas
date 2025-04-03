import os
import stripe
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

# Configura o Stripe
stripe_key = os.getenv('STRIPE_SECRET_KEY')
print(f"Usando chave do Stripe: {stripe_key[:10]}...")
stripe.api_key = stripe_key

try:
    # Lista todos os produtos
    products = stripe.Product.list(limit=10)
    print("\nProdutos encontrados:")
    for product in products.data:
        print(f"\nNome: {product.name}")
        print(f"ID: {product.id}")
        print(f"Descrição: {product.description}")
        print(f"Ativo: {product.active}")
        
        # Lista os preços associados
        prices = stripe.Price.list(product=product.id)
        print("Preços:")
        for price in prices.data:
            print(f"  - €{price.unit_amount/100}/mês (ID: {price.id})")
            
except stripe.error.StripeError as e:
    print(f"Erro ao listar produtos: {str(e)}")
    print(f"Detalhes do erro: {e.error.message if hasattr(e, 'error') else 'Nenhum detalhe adicional'}") 