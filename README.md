# Processador de Documentos SaaS

Um serviço SaaS para processamento de documentos que pode gerar €100/dia.

## Estrutura do Projeto

```
.
├── app/                    # Backend Python (FastAPI)
├── frontend/              # Frontend Next.js
├── terraform/             # Infraestrutura AWS
└── requirements.txt       # Dependências Python
```

## Pré-requisitos

- Python 3.8+
- Node.js 16+
- AWS CLI configurado
- Conta Stripe
- Terraform

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/document-processor.git
cd document-processor
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

3. Instale as dependências do backend:
```bash
pip install -r requirements.txt
```

4. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

5. Configure a infraestrutura AWS:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Desenvolvimento

1. Inicie o backend:
```bash
uvicorn app.main:app --reload
```

2. Inicie o frontend:
```bash
cd frontend
npm run dev
```

## Modelo de Negócio

### Planos de Assinatura

- **Plano Básico**: €29/mês
  - 100 documentos/mês
  - Processamento básico
  - Suporte por email

- **Plano Pro**: €99/mês
  - Documentos ilimitados
  - Processamento avançado
  - Suporte prioritário
  - API access

### Projeção de Receita

Para atingir €100/dia (€3000/mês):

- 100 usuários no plano básico (€29/mês) = €2900
- 30 usuários no plano pro (€99/mês) = €2970

## Tecnologias Utilizadas

- **Backend**: Python, FastAPI, AWS Lambda
- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Infraestrutura**: AWS (Lambda, DynamoDB, S3, CloudFront)
- **Pagamentos**: Stripe
- **Email**: SendGrid

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 