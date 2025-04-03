import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

# Tenta obter a chave do Stripe
stripe_key = os.getenv('STRIPE_SECRET_KEY')
print(f"Chave do Stripe encontrada: {stripe_key[:10]}...") 