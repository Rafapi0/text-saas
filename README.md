# Sistema de Monitoramento AWS

Este conjunto de scripts permite monitorar a performance e os custos dos serviços AWS utilizados no projeto, incluindo Lambda, DynamoDB, S3 e CloudFront.

## Requisitos

- Sistema operacional: Ubuntu/Debian, CentOS/RHEL ou macOS
- Acesso à AWS com permissões para acessar os serviços monitorados
- Python 3.8 ou superior
- AWS CLI configurado com credenciais válidas

## Instalação

1. Clone este repositório:
```bash
git clone <url-do-repositorio>
cd <diretorio-do-repositorio>
```

2. Execute o script de instalação de dependências:
```bash
bash install-dependencies.sh
```

3. Configure as variáveis necessárias:
   - Em `send-report.sh`: Configure o email do destinatário dos relatórios
   - Em `analyze-cloudfront.sh`: Configure o ID da distribuição CloudFront

## Estrutura dos Scripts

- `monitor-costs.sh`: Monitora os custos dos serviços AWS
- `analyze-lambda.sh`: Analisa a performance do Lambda
- `analyze-dynamodb.sh`: Analisa a performance do DynamoDB
- `analyze-s3.sh`: Analisa a performance do S3
- `analyze-cloudfront.sh`: Analisa a performance do CloudFront
- `analyze-all.sh`: Executa todas as análises de performance
- `generate-report.sh`: Gera relatório HTML com os resultados
- `send-report.sh`: Envia o relatório por email
- `setup-monitoring.sh`: Configura o agendamento das análises
- `setup-reporting.sh`: Configura o agendamento dos relatórios

## Configuração do Monitoramento

1. Configure o monitoramento:
```bash
bash setup-monitoring.sh
```

2. Configure o envio de relatórios:
```bash
bash setup-reporting.sh
```

## Agendamento

Os scripts são configurados para executar nos seguintes horários:

### Monitoramento
- Análise de custos: Diariamente às 00:00
- Análise de Lambda: A cada 5 minutos
- Análise de DynamoDB: A cada 5 minutos
- Análise de S3: A cada 5 minutos
- Análise de CloudFront: A cada 5 minutos
- Análise completa: Diariamente às 01:00

### Relatórios
- Geração de relatório: Diariamente às 06:00
- Envio de relatório: Diariamente às 07:00
- Limpeza de logs antigos: Semanalmente aos domingos às 02:00
- Limpeza de relatórios antigos: Semanalmente aos domingos às 03:00

## Estrutura de Diretórios

```
.
├── performance_logs/     # Logs das análises de performance
├── performance_reports/  # Relatórios HTML gerados
├── cron_logs/           # Logs dos jobs do crontab
└── scripts/             # Scripts de monitoramento
```

## Logs e Relatórios

- Os logs das análises são armazenados em `performance_logs/`
- Os relatórios HTML são gerados em `performance_reports/`
- Os logs do crontab são armazenados em `cron_logs/`
- Logs e relatórios antigos são automaticamente removidos após 30 dias

## Manutenção

### Verificar Status

Para verificar o status dos jobs agendados:
```bash
crontab -l
```

### Verificar Logs

Para verificar os logs mais recentes:
```bash
tail -f performance_logs/*.log
```

### Atualizar Configurações

Para atualizar as configurações de monitoramento:
```bash
bash setup-monitoring.sh
```

Para atualizar as configurações de relatórios:
```bash
bash setup-reporting.sh
```

## Solução de Problemas

### AWS CLI não configurado

Se o AWS CLI não estiver configurado:
```bash
aws configure
```

### Erro de Permissões

Verifique se as credenciais AWS têm as seguintes permissões:
- `cloudwatch:GetMetricStatistics`
- `dynamodb:Scan`
- `s3:ListBucket`
- `lambda:GetFunction`
- `cloudfront:GetDistribution`

### Email não enviado

Verifique se o Postfix está configurado e em execução:
```bash
sudo systemctl status postfix
```

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 